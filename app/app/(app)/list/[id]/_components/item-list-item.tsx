"use client";

import { useRef, useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";

type Item = {
  id: string;
  name: string;
  status: string;
  quantity: number;
  amount: number;
};

interface ItemListItemProps {
  item: Item;
  isPending?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

const THRESHOLD = 80;

export function ItemListItem({ item, isPending = false, onEdit, onDelete, onComplete }: ItemListItemProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const isDone = item.status === "done";

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isPending) return;
    dragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    setOffsetX(delta);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);

    const delta = e.clientX - startX.current;

    if (delta < -THRESHOLD) {
      onDelete();
    } else if (delta > THRESHOLD) {
      onComplete();
    }

    setOffsetX(0);
  }

  function handleClick() {
    if (hasDragged.current || isPending) return;
    onEdit();
  }

  const swipingLeft = offsetX < -10;
  const swipingRight = offsetX > 10;
  const swipeLabel = isDone ? "Reabrir" : "Concluir";

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Background layer */}
      <div
        className={`absolute inset-0 flex items-center justify-between px-5 transition-colors duration-150 ${
          swipingLeft
            ? "bg-red-500"
            : swipingRight
              ? isDone
                ? "bg-amber-400"
                : "bg-primary"
              : "bg-transparent"
        }`}
      >
        <span
          className={`flex items-center gap-1.5 text-white text-xs font-medium transition-opacity duration-150 ${
            swipingRight ? "opacity-100" : "opacity-0"
          }`}
        >
          <Check size={15} strokeWidth={2.5} />
          {swipeLabel}
        </span>
        <span
          className={`flex items-center gap-1.5 text-white text-xs font-medium transition-opacity duration-150 ${
            swipingLeft ? "opacity-100" : "opacity-0"
          }`}
        >
          Apagar
          <Trash2 size={15} />
        </span>
      </div>

      {/* Card */}
      <div
        className="relative flex items-center gap-3 px-4 py-4 bg-white border border-border rounded-2xl select-none"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? "none" : "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        {/* Checkbox bullet */}
        <button
          onClick={(e) => { e.stopPropagation(); if (!isPending) onComplete(); }}
          disabled={isPending}
          className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isPending
              ? "border-primary bg-transparent"
              : isDone
                ? "bg-primary border-primary"
                : "border-border bg-transparent"
          }`}
          aria-label={isDone ? "Reabrir item" : "Concluir item"}
        >
          {isPending ? (
            <Loader2 size={11} strokeWidth={2.5} className="animate-spin text-primary" />
          ) : isDone ? (
            <Check size={11} strokeWidth={3} color="white" />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate transition-colors ${
              isDone ? "line-through text-muted" : "text-foreground"
            }`}
          >
            {item.name}
          </p>
          <p className="text-xs text-muted">Quantidade: {item.quantity}</p>
        </div>

        {item.amount > 0 && (
          <p className="text-sm font-medium text-foreground shrink-0">
            R$ {(item.amount * item.quantity).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
