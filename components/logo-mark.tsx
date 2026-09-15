export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Prompt Library logo">
      <path d="M9 8.5h21.5A8.5 8.5 0 0 1 39 17v10.5a8.5 8.5 0 0 1-8.5 8.5H22l-7.5 5v-5H9A8.5 8.5 0 0 1 .5 27.5V17A8.5 8.5 0 0 1 9 8.5Z" fill="#fff7e2" stroke="#19191f" strokeWidth="2.5" />
      <path d="M14 19h13M14 25h9" stroke="#19191f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m36 3 1.6 4.4L42 9l-4.4 1.6L36 15l-1.6-4.4L30 9l4.4-1.6L36 3Z" fill="#ff6f61" stroke="#19191f" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="31" cy="31" r="3.5" fill="#19b394" stroke="#19191f" strokeWidth="1.5" />
    </svg>
  );
}
