# Prompt Library

A production-ready personal Prompt Library web app built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Supabase.

## Features

- **Public library** (`/`) — Browse, search, filter, and copy prompts
- **Admin dashboard** (`/admin`) — Create, edit, duplicate, archive, delete, publish/unpublish prompts
- **Prompt detail pages** (`/prompt/[slug]`) — SEO-friendly public pages for each prompt
- **Live search** — Searches title, description, content, tags, category, and tools
- **Filter chips** — All, New, Text, Image, Favorites + category filters with counts
- **One-click copy** — Clipboard API with success state, mobile-friendly
- **Shareable URLs** — Search and filters persist in query parameters
- **Import/Export** — JSON and CSV bulk operations
- **Responsive** — 375px mobile to large desktop
- **Accessible** — Keyboard navigation, focus styles, ARIA labels, modal focus management

## Tech Stack

- Next.js 15 (App Router, Server Components)
- TypeScript (strict mode)
- Tailwind CSS 3
- Supabase (Auth + PostgreSQL)
- Lucide React icons

## Local Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase project (free tier works)

### 1. Clone and install

```bash
cd "Prompt Library"
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to **SQL Editor** and run the migration:
   - `supabase/migrations/001_prompt_library.sql` — Creates tables, RLS policies, and seed categories
3. Go to **SQL Editor** and run the seed:
   - `supabase/seed.sql` — Seeds 20 sample prompts
4. Go to **Authentication → Users** and create your admin user
5. Set the user's role to `admin` in the `profiles` table:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 5. Verify

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public prompt library with search and filters |
| `/admin/login` | Admin login (email/password) |
| `/admin` | Protected dashboard (requires auth) |
| `/prompt/[slug]` | Public detail page for a prompt |

## Database Schema

- **categories** — Prompt categories with color coding
- **prompts** — Full prompt data with flags (featured, new, public, archived)
- **profiles** — Extends auth.users with roles
- **favorites** — Per-user favorites

## Row Level Security

- Public prompts are readable by anyone
- Admins (role = 'admin') can create, update, delete all prompts
- Users can manage their own favorites
- Private prompts are only visible to admins

## Project Structure

```
app/
├── layout.tsx          # Root layout with fonts
├── globals.css         # Global styles and animations
├── page.tsx            # Home page (server component)
├── admin/
│   ├── layout.tsx      # Auth guard
│   ├── page.tsx        # Dashboard (server component)
│   └── login/page.tsx  # Login page
├── prompt/[slug]/
│   └── page.tsx        # Public detail page
components/
├── header.tsx          # Sticky header
├── library.tsx         # Library with search/filters
├── prompt-card.tsx     # Card component
├── prompt-dialog.tsx   # Modal dialog
├── admin-studio.tsx    # Full admin UI
├── CopyButton.tsx      # Clipboard button
lib/
├── supabase/
│   ├── server.ts       # Server-side Supabase client
│   ├── client.ts       # Browser Supabase client
│   └── middleware.ts   # Session refresh
├── prompts.ts          # Data fetching functions
├── types.ts            # TypeScript types
supabase/migrations/
├── 001_prompt_library.sql
seed.sql
```

## License

MIT
