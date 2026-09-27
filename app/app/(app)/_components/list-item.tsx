"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

type ShoppingList = { id: string; name: string };

interface ListItemProps {
  list: ShoppingList;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ListItem({
  list,
  isMenuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: ListItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 rounded-2xl border border-border bg-white">
      <p className="text-sm font-medium text-foreground truncate mr-3">
        {list.name}
      </p>

      <div className="relative shrink-0">
        <button
          onClick={onMenuToggle}
          className="p-1 text-muted rounded-lg"
          aria-label="Opções"
        >
          <MoreHorizontal size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 flex gap-1 bg-white border border-border rounded-xl shadow-md p-1 z-20">
            <button
              onClick={onDelete}
              className="p-2 rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
              aria-label="Apagar lista"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={onEdit}
              className="p-2 rounded-lg border border-border text-muted transition-colors hover:bg-gray-50"
              aria-label="Editar lista"
            >
              <Pencil size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
