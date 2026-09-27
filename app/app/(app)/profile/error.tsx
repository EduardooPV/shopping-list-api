"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/button";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col min-h-dvh px-6 py-10">
      <Link
        href="/"
        className="self-start flex items-center gap-1.5 text-sm text-muted mb-8"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-foreground">Algo deu errado</p>
        <p className="text-sm text-muted max-w-xs">
          {error.message || "Não foi possível carregar seu perfil."}
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
    </div>
  );
}
