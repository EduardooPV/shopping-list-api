"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FormField } from "../../../../../components/form-field";
import { Button } from "../../../../../components/button";

type ItemData = {
  name: string;
  quantity: number;
  amount: number;
  status: string;
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(raw: string): number {
  const cleaned = raw.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function handleAmountInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface ItemFormSheetProps {
  initialItem?: ItemData;
  isEditing?: boolean;
  onSubmit: (item: ItemData) => Promise<string | undefined>;
  onCancel: () => void;
}

export function ItemFormSheet({
  initialItem,
  isEditing = false,
  onSubmit,
  onCancel,
}: ItemFormSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(initialItem?.name ?? "");
  const [quantity, setQuantity] = useState(String(initialItem?.quantity ?? 1));
  const [amount, setAmount] = useState(
    initialItem?.amount ? formatCurrency(initialItem.amount) : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2)
      newErrors.name = "Mínimo 2 caracteres";

    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty < 1)
      newErrors.quantity = "Quantidade deve ser ao menos 1";

    const amt = amount === "" ? 0 : parseCurrency(amount);
    if (amount !== "" && (isNaN(amt) || amt < 0))
      newErrors.amount = "Valor inválido";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    startTransition(async () => {
      await onSubmit({
        name: name.trim(),
        quantity: qty,
        amount: amt,
        status: initialItem?.status ?? "pending",
      });
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
          {isEditing ? "Editar item" : "Novo item"}
        </h2>

        <div className="flex flex-col gap-3">
          <FormField
            ref={inputRef}
            type="text"
            placeholder="Nome do item"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({});
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            error={errors.name}
          />

          <div className="flex gap-2">
            <div className="flex-1">
              <FormField
                type="number"
                placeholder="Quantidade"
                value={quantity}
                min={1}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setErrors({});
                }}
                error={errors.quantity}
              />
            </div>
            <div className="flex-1">
              <FormField
                type="text"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={amount ? `R$ ${amount}` : ""}
                onChange={(e) => {
                  setAmount(handleAmountInput(e.target.value));
                  setErrors({});
                }}
                error={errors.amount}
              />
            </div>
          </div>

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
