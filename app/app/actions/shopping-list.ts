"use server";

import { revalidatePath } from "next/cache";
import { api } from "../lib/api";
import { getErrorMessage } from "../lib/error-messages";

export async function createListAction(
  name: string,
): Promise<{ error?: string }> {
  const response = await api.post("/lists", { name });

  if (!response.ok) {
    const data = await response.json();
    return { error: getErrorMessage(data.error.code, data.error.message) };
  }

  revalidatePath("/");
  return {};
}

export async function updateListAction(
  id: string,
  name: string,
): Promise<{ error?: string }> {
  const response = await api.put(`/lists/${id}`, { name });

  if (!response.ok) {
    const data = await response.json();
    console.log(data.error.issues);
    return { error: getErrorMessage(data.error.code, data.error.message) };
  }

  revalidatePath("/");
  return {};
}

export async function deleteListAction(
  id: string,
): Promise<{ error?: string }> {
  const response = await api.delete(`/lists/${id}`);

  if (!response.ok) {
    const data = await response.json();
    return { error: getErrorMessage(data.error.code, data.error.message) };
  }

  revalidatePath("/");
  return {};
}
