"use server";

import { revalidatePath } from "next/cache";
import { api } from "../lib/api";
import { parseApiError } from "../lib/error-messages";

const CONNECTION_ERROR = "Sem conexão com o servidor. Verifique sua internet.";

export async function createListAction(
  name: string,
): Promise<{ error?: string }> {
  try {
    const response = await api.post("/lists", { name });
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath("/");
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}

export async function updateListAction(
  id: string,
  name: string,
): Promise<{ error?: string }> {
  try {
    const response = await api.put(`/lists/${id}`, { name });
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath("/");
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}

export async function deleteListAction(
  id: string,
): Promise<{ error?: string }> {
  try {
    const response = await api.delete(`/lists/${id}`);
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath("/");
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}
