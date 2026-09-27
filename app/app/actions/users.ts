"use server";

import z from "zod";
import { getErrorMessage } from "../lib/error-messages";
import { api } from "../lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UserState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
} | null;

const updateUserSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mínimo 6 caracteres",
        path: ["password"],
      });
    }
    if (data.password && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }
  });

export async function updateUserAction(
  _prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const result = updateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      fieldErrors: Object.fromEntries(
        result.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const { name, email, password } = result.data;
  const payload: { name: string; email: string; password?: string } = { name, email };
  if (password && password.length > 0) payload.password = password;

  const response = await api.put("/users/me", payload);

  if (!response.ok) {
    const data = await response.json();
    return { error: getErrorMessage(data.error.code, data.error.message) };
  }

  return { success: true };
}

export async function logoutAction() {
  await api.post("/auth/logout", {});

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");

  redirect("/login");
}

export async function deleteUserAction() {
  const response = await api.delete("/users/me");

  if (!response.ok) {
    return { error: "Erro ao deletar conta." };
  }

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");

  redirect("/login");
}
