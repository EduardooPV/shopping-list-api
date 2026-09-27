"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onCancel, 320);
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

        <div className="flex flex-col gap-1 mb-8 text-center">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant={variant === "destructive" ? "destructive" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
