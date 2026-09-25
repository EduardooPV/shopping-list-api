"use client";

import { useActionState } from "react";
import { loginAction } from "../../actions/auth";
import { SubmitButton } from "../_components/submit-button";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col flex-1 justify-center gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bem vindo</h1>
        <p className="text-sm text-zinc-500">
          Entre na sua conta para continuar
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          className="w-full rounded-2xl border border-zinc-200 px-4 py-4 outline-none focus:border-zinc-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          className="w-full rounded-2xl border border-zinc-200 px-4 py-4 outline-none focus:border-zinc-400"
        />
        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

        <SubmitButton label="Entrar" />
      </form>

      <p className="text-center text-sm text-zinc-500">
        Não tem conta?{" "}
        <a href="/register" className="font-medium text-zinc-900">
          Criar conta
        </a>
      </p>
    </div>
  );
}
