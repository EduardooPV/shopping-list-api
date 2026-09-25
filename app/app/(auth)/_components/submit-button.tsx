"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-zinc-900 py-4 text-sm font-medium text-white disabled:opacity-60"
    >
      {pending ? "Carregando..." : label}
    </button>
  );
}
