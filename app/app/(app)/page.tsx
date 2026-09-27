import { redirect } from "next/navigation";
import { api } from "../lib/api";
import { HomeClient } from "./_components/home-client";

type ShoppingList = { id: string; name: string };
type User = { id: string; name: string; email: string };

export default async function HomePage() {
  let listsRes: Response;
  let userRes: Response;

  try {
    [listsRes, userRes] = await Promise.all([
      api.get("/lists"),
      api.get("/users/me"),
    ]);
  } catch {
    throw new Error(
      "Erro de conexão. Verifique sua internet e tente novamente.",
    );
  }

  if (listsRes.status === 401 || userRes.status === 401) {
    redirect("/api/session/clear");
  }

  if (!listsRes.ok || !userRes.ok) {
    throw new Error("Não foi possível carregar seus dados. Tente novamente.");
  }

  const { items: lists }: { items: ShoppingList[] } = await listsRes.json();
  const user: User = await userRes.json();

  return <HomeClient lists={lists} user={user} />;
}
