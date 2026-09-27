import { redirect } from "next/navigation";
import { api } from "../lib/api";
import { HomeClient } from "./_components/home-client";

type ShoppingList = { id: string; name: string };
type User = { id: string; name: string; email: string };

export default async function HomePage() {
  const [listsRes, userRes] = await Promise.all([
    api.get("/lists"),
    api.get("/users/me"),
  ]);

  if (!listsRes.ok || !userRes.ok) redirect("/api/session/clear");

  const { items: lists }: { items: ShoppingList[] } = await listsRes.json();
  const user: User = await userRes.json();

  return <HomeClient lists={lists} user={user} />;
}
