import { notFound, redirect } from "next/navigation";
import { api } from "../../../lib/api";
import HomeList from "./_components/home-list";

export default async function ListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let itemsListRes: Response;
  let listRes: Response;

  try {
    [itemsListRes, listRes] = await Promise.all([
      api.get(`/lists/${id}/items`),
      api.get(`/lists/${id}`),
    ]);
  } catch {
    throw new Error(
      "Erro de conexão. Verifique sua internet e tente novamente.",
    );
  }

  if (listRes.status === 401 || itemsListRes.status === 401) {
    redirect("/api/session/clear");
  }

  if (listRes.status === 404) {
    notFound();
  }

  if (!itemsListRes.ok || !listRes.ok) {
    throw new Error("Não foi possível carregar a lista. Tente novamente.");
  }

  const itemsList = await itemsListRes.json();
  const list = await listRes.json();

  return <HomeList list={list} itemsList={itemsList} />;
}
