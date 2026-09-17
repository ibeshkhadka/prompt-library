export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Prompt Library logo">
      <path d="M5 13.5c6.5-2.8 12.8-1.9 19 2.7v24c-5.9-4.4-12.2-5.4-19-2.6v-24Z" fill="#ff6f61" stroke="#fff7e2" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M43 13.5c-6.5-2.8-12.8-1.9-19 2.7v24c5.9-4.4 12.2-5.4 19-2.6v-24Z" fill="#19b394" stroke="#fff7e2" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M24 16.2v24" stroke="#fff7e2" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M10 20.5c3.1-.8 6.2-.2 9.2 1.7M10 26c3.1-.8 6.2-.2 9.2 1.7M38 20.5c-3.1-.8-6.2-.2-9.2 1.7M38 26c-3.1-.8-6.2-.2-9.2 1.7" stroke="#19191f" strokeWidth="1.8" strokeLinecap="round" opacity=".78" />
      <path d="m35 3 1.35 3.65L40 8l-3.65 1.35L35 13l-1.35-3.65L30 8l3.65-1.35L35 3Z" fill="#ffd447" stroke="#fff7e2" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
