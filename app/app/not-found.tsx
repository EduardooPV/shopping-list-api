import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center p-6 gap-2 text-center">
      <p className="text-sm font-semibold text-foreground">Página não encontrada</p>
      <p className="text-sm text-muted max-w-xs">
        O endereço que você acessou não existe.
      </p>
      <Link
        href="/"
        className="mt-3 px-6 py-3 bg-primary text-white text-sm font-medium rounded-2xl"
      >
        Voltar para início
      </Link>
    </div>
  );
}
