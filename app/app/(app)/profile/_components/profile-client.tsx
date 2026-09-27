"use client";

import { useCallback, useState, useTransition } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { logoutAction, deleteUserAction } from "@/app/actions/users";
import { Button } from "@/components/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ProfileForm } from "./profile-form";
import { useToast } from "@/components/toast";
import Link from "next/link";

type User = { id: string; name: string; email: string };

type DialogConfig = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: "default" | "destructive";
  action: () => void;
};

export function ProfileClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [dialog, setDialog] = useState<DialogConfig | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

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

  function openLogoutDialog() {
    setDialog({
      title: "Sair da conta",
      message: "Tem certeza que deseja sair?",
      confirmLabel: "Sair",
      variant: "default",
      action: () =>
        startTransition(async () => {
          await logoutAction();
        }),
    });
  }

  function openDeleteDialog() {
    setDialog({
      title: "Excluir conta",
      message: "Essa ação é permanente e não pode ser desfeita.",
      confirmLabel: "Excluir",
      variant: "destructive",
      action: () =>
        startTransition(async () => {
          const result = await deleteUserAction();
          if (result?.error) showToast(result.error, "error");
        }),
    });
  }

  return (
    <div className="flex flex-col min-h-dvh px-6 py-10">
      <Link
        href="/"
        className="self-start flex items-center gap-1.5 text-sm text-muted mb-8"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div className="flex flex-col items-center gap-4 pt-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold text-xl">{initials}</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            aria-label="Editar perfil"
          >
            <Pencil size={11} color="white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-10 rounded-2xl border border-border overflow-hidden">
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
        <Button
          variant="outline"
          onClick={openLogoutDialog}
          disabled={isPending}
        >
          Sair da conta
        </Button>
        <Button variant="ghost" onClick={openDeleteDialog} disabled={isPending}>
          Excluir conta
        </Button>
      </div>

      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          confirmLabel={dialog.confirmLabel}
          variant={dialog.variant}
          onConfirm={() => {
            dialog.action();
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}
