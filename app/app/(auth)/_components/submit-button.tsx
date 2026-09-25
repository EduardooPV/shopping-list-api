"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? "Carregando..." : label}
    </button>
  );
}
