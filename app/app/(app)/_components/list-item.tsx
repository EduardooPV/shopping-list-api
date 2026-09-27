"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  function handleClick(id: string) {
    router.push(`/list/${id}`);
  }
  return (
    <div
      className="flex items-center justify-between px-4 py-4 rounded-2xl border border-border bg-white"
      onClick={() => handleClick(list.id)}
    >
      <p className="text-sm font-medium text-foreground truncate mr-3">
        {list.name}
      </p>

      <div className="relative shrink-0 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
          className="p-1 text-muted rounded-lg"
          aria-label="Opções"
        >
          <MoreHorizontal size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-2xl shadow-md overflow-hidden w-36 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-border/30 transition-colors"
              aria-label="Editar lista"
            >
              <Pencil size={15} className="text-muted" />
              Editar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-border/30 transition-colors"
              aria-label="Apagar lista"
            >
              <Trash2 size={15} />
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
