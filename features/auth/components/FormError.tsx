export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-2xl bg-urgent/8 px-4 py-3 text-[13px] leading-relaxed text-urgent"
    >
      {message}
    </p>
  );
}
