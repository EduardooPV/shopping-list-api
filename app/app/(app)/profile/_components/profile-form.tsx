"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { updateUserAction } from "@/app/actions/users";
import { Button } from "@/components/button";
import { FormField } from "@/components/form-field";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast";

type User = { id: string; name: string; email: string };

export function ProfileForm({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    const newErrors: Record<string, string> = {};
    if (name && name.length < 2) newErrors.name = "Mínimo 2 caracteres";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "E-mail inválido";
    if (password && password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";
    if (password && password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setShowDialog(true);
  }

  function handleConfirm() {
    setShowDialog(false);
    startTransition(async () => {
      const result = await updateUserAction(
        null,
        new FormData(formRef.current!),
      );
      if (result?.success) {
        router.refresh();
        onClose();
      } else if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
      } else if (result?.error) {
        showToast(result.error, "error");
        onClose();
      }
    });
  }

  return (
    <div className="flex flex-col min-h-dvh px-6 py-10">
      <button
        type="button"
        onClick={onClose}
        className="self-start flex items-center gap-1.5 text-sm text-muted mb-8"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Editar perfil</h1>
        <p className="text-sm text-muted">
          Preencha apenas o que deseja alterar
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 flex-1"
      >
        <FormField
          name="name"
          type="text"
          placeholder="Novo nome"
          defaultValue={user.name}
          error={errors.name}
        />
        <FormField
          name="email"
          type="email"
          placeholder="Novo e-mail"
          defaultValue={user.email}
          error={errors.email}
        />

        <div className="border-t border-border my-2" />

        <FormField
          name="password"
          type="password"
          placeholder="Nova senha (opcional)"
          error={errors.password}
        />
        <FormField
          name="confirmPassword"
          type="password"
          placeholder="Confirmar nova senha"
          error={errors.confirmPassword}
        />

        <div className="mt-auto pt-8">
          <Button type="submit" loading={isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>

      {showDialog && (
        <ConfirmDialog
          title="Editar perfil"
          message="Tem certeza que deseja salvar as alterações?"
          confirmLabel="Salvar"
          variant="default"
          onConfirm={handleConfirm}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
