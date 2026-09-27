"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserAction } from "@/app/actions/users";
import { FormField } from "@/app/(auth)/_components/form-field";
import { SubmitButton } from "@/app/(auth)/_components/submit-button";

type User = { id: string; name: string; email: string };

export function ProfileForm({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter();
  const [state, action] = useActionState(updateUserAction, null);

  useEffect(() => {
    if (!state?.success) return;
    router.refresh();
    onClose();
  }, [state?.success, router, onClose]);

  return (
    <div className="flex flex-col min-h-dvh px-6 py-10">
      <button
        type="button"
        onClick={onClose}
        className="self-start text-sm text-muted mb-8"
      >
        ← Voltar
      </button>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Editar perfil</h1>
        <p className="text-sm text-muted">Atualize suas informações</p>
      </div>

      <form action={action} className="flex flex-col gap-3">
        <FormField
          name="name"
          type="text"
          placeholder="Nome"
          defaultValue={user.name}
          error={state?.fieldErrors?.name}
        />
        <FormField
          name="email"
          type="email"
          placeholder="E-mail"
          defaultValue={user.email}
          error={state?.fieldErrors?.email}
        />
        <FormField
          name="password"
          type="password"
          placeholder="Nova senha (opcional)"
          error={state?.fieldErrors?.password}
        />
        <FormField
          name="confirmPassword"
          type="password"
          placeholder="Confirmar nova senha"
          error={state?.fieldErrors?.confirmPassword}
        />

        {state?.error && (
          <p className="text-sm text-red-500 text-center">{state.error}</p>
        )}

        <div className="mt-1">
          <SubmitButton label="Salvar alterações" />
        </div>
      </form>
    </div>
  );
}
