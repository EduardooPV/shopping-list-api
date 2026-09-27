import { api } from "../../lib/api";
import { redirect } from "next/navigation";
import { ProfileClient } from "./_components/profile-client";

type User = { id: string; name: string; email: string };

export default async function ProfilePage() {
  let response: Response;

  try {
    response = await api.get("/users/me");
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique sua internet.");
  }

  if (response.status === 401) {
    redirect("/api/session/clear");
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar seu perfil. Tente novamente.");
  }

  const user: User = await response.json();
  return <ProfileClient user={user} />;
}
