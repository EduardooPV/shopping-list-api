import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col flex-1 min-h-dvh px-6 py-12">
      {children}
    </main>
  );
}
