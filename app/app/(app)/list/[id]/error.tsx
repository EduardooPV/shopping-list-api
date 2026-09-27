"use client";

import Link from "next/link";
import { Button } from "../../../../components/button";
import { ArrowLeft } from "lucide-react";

export default function ListError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <div className="px-6 pt-6 pb-4">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border/40 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
        <p className="text-sm font-semibold text-foreground">Algo deu errado</p>
        <p className="text-sm text-muted max-w-xs">
          {error.message || "Tente novamente em instantes."}
        </p>
        <div className="w-full max-w-xs mt-2">
          <Button onClick={reset}>Tentar novamente</Button>
        </div>
      </div>
    </div>
  );
}
