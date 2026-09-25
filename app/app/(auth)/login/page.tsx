"use client";

import { useActionState } from "react";
import { loginAction } from "../../actions/auth";
import { SubmitButton } from "../_components/submit-button";
import { FormField } from "../_components/form-field";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [state, action] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col flex-1 justify-center gap-8">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-muted">
            Entre na sua conta para continuar
          </p>
        </div>
      </div>

      <form action={action} className="flex flex-col gap-3">
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

        {state?.error && (
          <p className="text-sm text-red-500 text-center">{state.error}</p>
        )}

        <div className="mt-1">
          <SubmitButton label="Entrar" />
        </div>
      </form>

      <p className="text-center text-sm text-muted">
        Não tem conta?{" "}
        <a href="/register" className="font-medium text-primary">
          Criar conta
        </a>
      </p>
    </div>
  );
}
