"use client";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-32 left-1/2 z-50 max-w-[88vw] rounded-full px-5 py-2.5 text-center text-[13px] font-medium shadow-lg"
      style={{
        background: "var(--color-toast-bg)",
        color: "var(--color-toast-fg)",
        transform: "translateX(-50%)",
        animation: "toast-in 0.25s ease-out",
      }}
    >
      {message}
    </div>
  );
}
