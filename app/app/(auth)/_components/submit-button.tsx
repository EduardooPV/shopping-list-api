"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/button";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {label}
    </Button>
  );
}
