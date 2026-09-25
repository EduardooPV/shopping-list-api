"use server";

import { cookies } from "next/headers";
import { api } from "../lib/api";
import { redirect } from "next/navigation";
import z from "zod";
import { getErrorMessage } from "../lib/error-messages";

type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function loginAction(
  _AgoraprevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      fieldErrors: Object.fromEntries(
        result.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const response = await api.post("/auth/login", result.data);

  if (!response.ok) {
    const data = await response.json();
    return { error: getErrorMessage(data.error.code, data.error.message) };
  }

  const data = await response.json();

  await setAccessTokenCookie(data.accessToken);
  redirect("/");
}

export async function registerAction(
  _AgoraprevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const result = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!result.success) {
    return {
      fieldErrors: Object.fromEntries(
        result.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const registerResponse = await api.post("/users", result.data);

  if (!registerResponse.ok) {
    const data = await registerResponse.json();
    return { error: getErrorMessage(data.error.code, data.error.message) };
  }

  const loginResponse = await api.post("/auth/login", { email, password });

  if (!loginResponse.ok) {
    redirect("/login");
  }

  const data = await loginResponse.json();

  await setAccessTokenCookie(data.accessToken);
  redirect("/");
}
