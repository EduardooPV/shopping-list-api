"use client";

import Link from "next/link";
import { Button } from "../../components/button";

export default function HomeError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center p-6 gap-3 text-center">
      <p className="text-sm font-semibold text-foreground">Algo deu errado</p>
      <p className="text-sm text-muted max-w-xs">
        {error.message || "Tente novamente em instantes."}
      </p>
      <div className="w-full max-w-xs flex flex-col gap-2 mt-2">
        <Button onClick={reset}>Tentar novamente</Button>
        <Link
          href="/"
          className="w-full rounded-2xl py-4 text-sm font-medium border border-border text-foreground flex items-center justify-center transition-colors"
        >
          Voltar para início
        </Link>
      </div>
    </div>
  );
}
