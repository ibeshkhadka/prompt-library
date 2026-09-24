import { createClient } from "npm:@supabase/supabase-js@2";

const defaultSiteOrigin = "https://ibeshkhadka.github.io";
const localOrigins = new Set(["http://localhost:3000", "http://127.0.0.1:3000"]);
const message = "If this address is approved for admin access, a secure sign-in link has been sent.";

function getOrigin(request: Request) {
  const configuredOrigin = new URL(Deno.env.get("SITE_ORIGIN") || defaultSiteOrigin).origin;
  const origin = request.headers.get("Origin");
  const requestOrigin = origin || configuredOrigin;
  const allowed = requestOrigin === configuredOrigin || localOrigins.has(requestOrigin);

  return allowed ? requestOrigin : null;
}

function headers(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(origin: string, body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: headers(origin) });
}

function getDefaultKey(variable: string, legacyVariable: string) {
  const keyMap = Deno.env.get(variable);
  if (keyMap) {
    const parsed = JSON.parse(keyMap) as Record<string, unknown>;
    if (typeof parsed.default === "string") return parsed.default;
  }
  return Deno.env.get(legacyVariable) || "";
}

Deno.serve(async (request) => {
  const origin = getOrigin(request);
  if (!origin) return Response.json({ error: "Origin not allowed." }, { status: 403 });

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: headers(origin) });
  }
  if (request.method !== "POST") {
    return json(origin, { error: "Method not allowed." }, 405);
  }

  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(origin, { error: "Invalid request." }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(origin, { error: "Enter a valid email address." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  let adminKey: string;
  let publishableKey: string;
  try {
    adminKey = getDefaultKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
    publishableKey = getDefaultKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  } catch {
    return json(origin, { error: "Admin sign-in is not configured." }, 503);
  }

  if (!supabaseUrl || !adminKey || !publishableKey) {
    return json(origin, { error: "Admin sign-in is not configured." }, 503);
  }

  try {
    const lookupUrl = new URL("/rest/v1/admin_allowlist", supabaseUrl);
    lookupUrl.searchParams.set("select", "email");
    lookupUrl.searchParams.set("email", `eq.${email}`);

    const lookupHeaders: Record<string, string> = {
      apikey: adminKey,
      Accept: "application/json",
    };
    // Legacy service-role keys are JWTs; modern secret keys must only be sent as apikey.
    if (!adminKey.startsWith("sb_secret_")) {
      lookupHeaders.Authorization = `Bearer ${adminKey}`;
    }

    const allowlistResponse = await fetch(lookupUrl, { headers: lookupHeaders });
    if (!allowlistResponse.ok) {
      return json(origin, { error: "Admin sign-in is temporarily unavailable." }, 503);
    }

    const allowlistRows = await allowlistResponse.json();
    const isAllowed = Array.isArray(allowlistRows) && allowlistRows.some((row) => row?.email === email);
    if (!isAllowed) return json(origin, { message });

    const authClient = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { error } = await authClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: new URL("/prompt-library/admin/", origin).toString(),
        shouldCreateUser: false,
      },
    });

    if (error) return json(origin, { error: "Could not send the sign-in link. Please try again." }, 502);
    return json(origin, { message });
  } catch {
    return json(origin, { error: "Admin sign-in is temporarily unavailable." }, 503);
  }
});
