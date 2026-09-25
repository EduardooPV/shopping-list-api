"use client";

import { useActionState } from "react";
import { registerAction } from "../../actions/auth";
import { SubmitButton } from "../_components/submit-button";
import { FormField } from "../_components/form-field";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [state, action] = useActionState(registerAction, null);

  return (
    <div className="flex flex-col flex-1 justify-center gap-8">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted">Preencha os dados para se cadastrar</p>
        </div>
      </div>

      <form action={action} className="flex flex-col gap-3">
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

        <div className="mt-1">
          <SubmitButton label="Criar conta" />
        </div>
      </form>

      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <a href="/login" className="font-medium text-primary">
          Entrar
        </a>
      </p>
    </div>
  );
}
