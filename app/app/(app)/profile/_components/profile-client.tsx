"use client";

import { useCallback, useState, useTransition } from "react";
import { logoutAction, deleteUserAction } from "@/app/actions/users";
import { ProfileForm } from "./profile-form";

type User = { id: string; name: string; email: string };

export function ProfileClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClose = useCallback(() => setIsEditing(false), []);

  const initials = user.name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (isEditing) {
    return <ProfileForm user={user} onClose={handleClose} />;
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteUserAction();
    });
  }

  return (
    <div className="flex flex-col min-h-dvh px-6 py-10">
      <div className="flex flex-col items-center gap-4 pt-6">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-semibold text-xl">{initials}</span>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-0 mt-10 rounded-2xl border border-border overflow-hidden">
        <div className="flex flex-col gap-0.5 px-4 py-4 border-b border-border">
          <p className="text-xs text-muted">Nome</p>
          <p className="text-sm font-medium text-foreground">{user.name}</p>
        </div>
        <div className="flex flex-col gap-0.5 px-4 py-4">
          <p className="text-xs text-muted">E-mail</p>
          <p className="text-sm font-medium text-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-8">
        <button
          onClick={() => setIsEditing(true)}
          className="w-full rounded-2xl border border-border py-4 text-sm font-medium text-foreground transition-colors"
        >
          Editar perfil
        </button>

        {confirmingDelete ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-center text-muted">
              Tem certeza? Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-red-50 py-3.5 text-sm font-medium text-red-500 disabled:opacity-60"
              >
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            disabled={isPending}
            className="w-full py-4 text-sm font-medium text-red-500 disabled:opacity-60"
          >
            Excluir conta
          </button>
        )}

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full py-4 text-sm font-medium text-muted disabled:opacity-60"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
