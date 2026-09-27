import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ListNotFound() {
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-2 text-center">
        <p className="text-sm font-semibold text-foreground">
          Lista não encontrada
        </p>
        <p className="text-sm text-muted max-w-xs">
          Essa lista pode ter sido removida ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="mt-3 px-6 py-3 bg-primary text-white text-sm font-medium rounded-2xl"
        >
          Voltar para início
        </Link>
      </div>
    </div>
  );
}
