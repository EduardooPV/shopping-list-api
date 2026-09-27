"use client";

import { useTransition } from "react";
import { deleteUserAction, logoutAction } from "../../../actions/users";

export function ProfileActions() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    if (!confirm("Tem certeza que deseja sair?")) return;

    startTransition(() => logoutAction());
  }

  function handleDelete() {
    if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;

    startTransition(async () => {
      await deleteUserAction();
    });
  }

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-border">
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="w-full rounded-2xl border border-border py-4 text-sm font-medium text-foreground transition-colors disabled:opacity-60"
      >
        Sair da conta
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="w-full rounded-2xl py-4 text-sm font-medium text-red-500 transition-colors disabled:opacity-60"
      >
        Deletar conta
      </button>
    </div>
  );
}
