"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import {
  createListAction,
  deleteListAction,
  updateListAction,
} from "../../actions/shopping-list";
import Link from "next/link";
import { ListItem } from "./list-item";
import { Plus } from "lucide-react";
import { ListFormSheet } from "./list-form-sheet";
import { ConfirmDialog } from "../../../components/confirm-dialog";

type ShoppingList = { id: string; name: string };
type User = { id: string; name: string; email: string };

export function HomeClient({
  lists,
  user,
}: {
  lists: ShoppingList[];
  user: User;
}) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShoppingList | null>(null);
  const [formSheet, setFormSheet] = useState<{ list?: ShoppingList } | null>(
    null,
  );
  const [, startTransition] = useTransition();

  const [optimisticLists, optimisticDelete] = useOptimistic(
    lists,
    (current: ShoppingList[], deletedId: string) =>
      current.filter((l) => l.id !== deletedId),
  );

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    startTransition(async () => {
      optimisticDelete(id);
      await deleteListAction(id);
      router.refresh();
    });
  }

  async function handleFormSubmit(name: string): Promise<string | undefined> {
    const result = formSheet?.list
      ? await updateListAction(formSheet.list.id, name)
      : await createListAction(name);

    if (result.error) return result.error;

    setFormSheet(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-dvh p-6">
      {openMenuId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      <div className="flex items-center justify-between mb-10">
        <p className="text-base font-medium text-foreground">
          Olá {user.name.split(" ")[0]}, bem vindo
        </p>
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0"
          aria-label="Perfil"
        >
          <span className="text-white text-sm font-semibold">{initials}</span>
        </Link>
      </div>

      {optimisticLists.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5 text-center">
          <p className="text-sm font-medium text-foreground">
            Nenhuma lista ainda
          </p>
          <p className="text-sm text-muted">
            Toque no + para criar sua primeira lista
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
            Suas listas
          </p>
          {optimisticLists.map((list) => (
            <ListItem
              key={list.id}
              list={list}
              isMenuOpen={openMenuId === list.id}
              onMenuToggle={() =>
                setOpenMenuId((prev) => (prev === list.id ? null : list.id))
              }
              onEdit={() => {
                setOpenMenuId(null);
                setFormSheet({ list });
              }}
              onDelete={() => {
                setOpenMenuId(null);
                setDeleteTarget(list);
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setFormSheet({})}
        className="fixed bottom-8 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="Nova lista"
      >
        <Plus size={24} color="white" />
      </button>

      {deleteTarget && (
        <ConfirmDialog
          title="Apagar lista"
          message={`"${deleteTarget.name}" será removida permanentemente.`}
          confirmLabel="Apagar"
          variant="destructive"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {formSheet !== null && (
        <ListFormSheet
          initialName={formSheet.list?.name}
          isEditing={!!formSheet.list}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormSheet(null)}
        />
      )}
    </div>
  );
}
