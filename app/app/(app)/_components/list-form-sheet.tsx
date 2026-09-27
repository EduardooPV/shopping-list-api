"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FormField } from "../../../components/form-field";
import { Button } from "../../../components/button";

interface ListFormSheetProps {
  initialName?: string;
  isEditing?: boolean;
  onSubmit: (name: string) => Promise<string | undefined>;
  onCancel: () => void;
}

export function ListFormSheet({
  initialName = "",
  isEditing = false,
  onSubmit,
  onCancel,
}: ListFormSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onCancel, 320);
  }

  function handleSubmit() {
    if (!name.trim() || name.trim().length < 2) {
      setError("Digite um nome com ao menos 2 caracteres");
      return;
    }

    setError(undefined);
    startTransition(async () => {
      const serverError = await onSubmit(name.trim());
      if (serverError) setError(serverError);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: isVisible ? 0.4 : 0 }}
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl px-6 pt-5 pb-10"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />

        <h2 className="text-base font-semibold text-center mb-6">
          {isEditing ? "Editar lista" : "Nova lista"}
        </h2>

        <div className="flex flex-col gap-3">
          <FormField
            ref={inputRef}
            type="text"
            placeholder="Nome da lista"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(undefined);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            error={error}
          />
          <Button loading={isPending} onClick={handleSubmit}>
            {isEditing ? "Salvar" : "Criar"}
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
