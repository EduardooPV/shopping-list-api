import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

async function request(path: string, options?: RequestInit) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  return response;
}

export const api = {
  get: (path: string) => request(path),

  post: (path: string, body: unknown) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path: string, body: unknown) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (path: string) => request(path, { method: "DELETE" }),
};
