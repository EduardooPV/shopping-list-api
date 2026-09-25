"use client";

import { useActionState } from "react";
import { registerAction } from "../../actions/auth";
import { SubmitButton } from "../_components/submit-button";
import { FormField } from "../_components/form-field";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, null);

  return (
    <div className="flex flex-col flex-1 justify-center gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-sm text-zinc-500">
          Preencha os dados para se cadastrar
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <FormField
          name="name"
          type="text"
          placeholder="Nome"
          error={state?.fieldErrors?.name}
        />
        <FormField
          name="email"
          type="email"
          placeholder="E-mail"
          error={state?.fieldErrors?.email}
        />
        <FormField
          name="password"
          type="password"
          placeholder="Senha"
          error={state?.fieldErrors?.password}
        />
        <FormField
          name="confirmPassword"
          type="password"
          placeholder="Confirmar senha"
          error={state?.fieldErrors?.confirmPassword}
        />

        {state?.error && (
          <p className="text-sm text-red-500 text-center">{state.error}</p>
        )}

        <SubmitButton label="Criar conta" />
      </form>

      <p className="text-center text-sm text-zinc-500">
        Já tem conta?{" "}
        <a href="/login" className="font-medium text-zinc-900">
          Entrar
        </a>
      </p>
    </div>
  );
}
