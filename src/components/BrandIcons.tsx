export function WhatsAppMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#25D366" />
      <path
        d="M22.4 9.6a7.6 7.6 0 0 0-11.9 9.1L9 24l5.5-1.4a7.6 7.6 0 0 0 10.9-6.8 7.55 7.55 0 0 0-3-6.2Z"
        fill="#fff"
      />
      <path
        d="M13.1 12.7c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.6 1.5c.1.2.1.3 0 .5l-.3.4c-.2.2-.3.3-.1.5.1.3.7 1.2 1.6 1.9 1.1.9 1.6 1 1.9.8.2 0 .3-.3.5-.5.1-.2.3-.1.5-.1l1.4.7c.2.1.4.2.4.4 0 .5-.2 1.1-.6 1.5-.4.3-.8.5-1.2.5-1.2 0-2.7-.6-4.3-2-1.6-1.5-2.4-3-2.5-4.2 0-.5.1-.9.5-1.3Z"
        fill="#25D366"
      />
    </svg>
  );
}

export function DriveMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#fff" stroke="#E4DFD3" />
      <path d="M11.2 6.5h9.6l7.2 12.5-4.8 8.5h-14.4l-4.8-8.5 7.2-12.5Z" fill="#fff" />
      <path d="M11.2 6.5 4 19l4.8 8.5 7.2-12.5-4.8-8.5Z" fill="#0066DA" />
      <path d="M20.8 6.5H11.2L16 15l4.8-8.5Z" fill="#00AC47" />
      <path d="M16 15 8.8 27.5h14.4L16 15Z" fill="#FFBA00" />
      <path d="M20.8 6.5 16 15l7.2 12.5L28 19 20.8 6.5Z" fill="#EA4335" />
    </svg>
  );
}

export function GalleryMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--color-paper-dim)" />
      <rect x="7" y="9" width="18" height="14" rx="2.5" stroke="var(--color-ink-soft)" strokeWidth="1.8" />
      <circle cx="12.5" cy="14" r="1.8" stroke="var(--color-ink-soft)" strokeWidth="1.8" />
      <path
        d="m9 20 4.5-4.2 3.2 2.8L22.5 14 25 17.5"
        stroke="var(--color-ink-soft)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
