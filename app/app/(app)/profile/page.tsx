import { api } from "../../lib/api";
import { redirect } from "next/navigation";
import { ProfileClient } from "./_components/profile-client";

type User = { id: string; name: string; email: string };

export default async function ProfilePage() {
  const response = await api.get("/users/me");

  if (!response.ok) {
    redirect("/api/session/clear");
  }

  const user: User = await response.json();
  return <ProfileClient user={user} />;
}
