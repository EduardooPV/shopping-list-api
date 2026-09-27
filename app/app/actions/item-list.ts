"use server";

import { revalidatePath } from "next/cache";
import { api } from "../lib/api";
import { parseApiError } from "../lib/error-messages";

const CONNECTION_ERROR = "Sem conexão com o servidor. Verifique sua internet.";

type ItemData = {
  name: string;
  quantity: number;
  amount: number;
  status: string;
};

export async function createItemListAction(
  listId: string,
  data: ItemData,
): Promise<{ error?: string }> {
  try {
    const response = await api.post(`/lists/${listId}/items`, data);
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath(`/list/${listId}`);
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}

export async function updateItemListAction(
  listId: string,
  itemId: string,
  data: ItemData,
): Promise<{ error?: string }> {
  try {
    const response = await api.put(`/lists/${listId}/items/${itemId}`, data);
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath(`/list/${listId}`);
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}

export async function deleteItemListAction(
  listId: string,
  itemId: string,
): Promise<{ error?: string }> {
  try {
    const response = await api.delete(`/lists/${listId}/items/${itemId}`);
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath(`/list/${listId}`);
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}

export async function toggleItemStatusAction(
  listId: string,
  item: {
    id: string;
    name: string;
    quantity: number;
    amount: number;
    status: string;
  },
): Promise<{ error?: string }> {
  try {
    const newStatus = item.status === "done" ? "pending" : "done";
    const response = await api.put(`/lists/${listId}/items/${item.id}`, {
      name: item.name,
      quantity: item.quantity,
      amount: item.amount,
      status: newStatus,
    });
    if (!response.ok) return { error: await parseApiError(response) };
    revalidatePath(`/list/${listId}`);
    return {};
  } catch {
    return { error: CONNECTION_ERROR };
  }
}
