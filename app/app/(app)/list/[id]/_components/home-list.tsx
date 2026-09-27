"use client";

import { ConfirmDialog } from "../../../../../components/confirm-dialog";
import { useOptimistic, useState, useTransition } from "react";
import {
  deleteListAction,
  updateListAction,
} from "../../../../actions/shopping-list";
import { useRouter } from "next/navigation";
import { ListFormSheet } from "../../../_components/list-form-sheet";
import { ArrowLeft, MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ItemFormSheet } from "./item-form-sheet";
import {
  createItemListAction,
  deleteItemListAction,
  toggleItemStatusAction,
  updateItemListAction,
} from "../../../../actions/item-list";
import { ItemListItem } from "./item-list-item";
import { useToast } from "../../../../../components/toast";

type ShoppingList = { id: string; name: string };
type ItemsList = {
  id: string;
  name: string;
  status: string;
  quantity: number;
  amount: number;
};

type OptimisticAction = { type: "delete"; id: string };

export default function HomeList({
  list,
  itemsList,
}: {
  list: ShoppingList;
  itemsList: ItemsList[];
}) {
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const [deleteListTarget, setDeleteListTarget] = useState<ShoppingList | null>(
    null,
  );
  const [deleteItemTarget, setDeleteItemTarget] = useState<ItemsList | null>(
    null,
  );
  const [formListSheet, setFormListSheet] = useState<{
    list?: ShoppingList;
  } | null>(null);
  const [formItemSheet, setFormItemSheet] = useState<{
    item?: ItemsList;
  } | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();
  const [pendingToggleIds, setPendingToggleIds] = useState<Set<string>>(new Set());

  const [optimisticItems, dispatchOptimistic] = useOptimistic(
    itemsList,
    (current: ItemsList[], action: OptimisticAction) => {
      if (action.type === "delete")
        return current.filter((i) => i.id !== action.id);
      return current;
    },
  );

  const pendingItems = optimisticItems.filter((i) => i.status !== "done");
  const doneItems = optimisticItems.filter((i) => i.status === "done");
  const doneTotal = doneItems.reduce(
    (sum, i) => sum + i.amount * i.quantity,
    0,
  );

  function handleDeleteList() {
    setDeleteListTarget(null);
    startTransition(async () => {
      const result = await deleteListAction(list.id);
      if (result.error) {
        showToast(result.error);
        return;
      }
      router.push("/");
    });
  }

  function handleDeleteItem() {
    if (!deleteItemTarget) return;
    const item = deleteItemTarget;
    setDeleteItemTarget(null);
    startTransition(async () => {
      dispatchOptimistic({ type: "delete", id: item.id });
      const result = await deleteItemListAction(list.id, item.id);
      if (result.error) {
        showToast(result.error);
      }
      router.refresh();
    });
  }

  function handleCompleteItem(item: ItemsList) {
    setPendingToggleIds((prev) => new Set([...prev, item.id]));
    startTransition(async () => {
      const result = await toggleItemStatusAction(list.id, item);
      if (result.error) showToast(result.error);
      setPendingToggleIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      router.refresh();
    });
  }

  async function handleListFormSubmit(
    name: string,
  ): Promise<string | undefined> {
    const result = await updateListAction(list.id, name);
    if (result.error) {
      showToast(result.error);
      setFormListSheet(null);
      return undefined;
    }
    setFormListSheet(null);
    router.refresh();
    return undefined;
  }

  async function handleItemFormSubmit(
    data: Omit<ItemsList, "id">,
  ): Promise<string | undefined> {
    const result = formItemSheet?.item
      ? await updateItemListAction(list.id, formItemSheet.item.id, data)
      : await createItemListAction(list.id, data);
    if (result.error) {
      showToast(result.error);
      setFormItemSheet(null);
      return undefined;
    }
    setFormItemSheet(null);
    router.refresh();
    return undefined;
  }

  return (
    <div className="flex flex-col min-h-dvh">
      {listMenuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setListMenuOpen(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border/40 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>

        <p className="text-base font-semibold text-foreground truncate mx-3 flex-1 text-center">
          {list.name}
        </p>

        <div className="relative">
          <button
            onClick={() => setListMenuOpen((p) => !p)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border/40 transition-colors"
            aria-label="Opções da lista"
          >
            <MoreHorizontal size={20} className="text-foreground" />
          </button>

          {listMenuOpen && (
            <div className="absolute right-0 top-10 z-20 bg-white border border-border rounded-2xl shadow-md overflow-hidden w-40">
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-border/30 transition-colors"
                onClick={() => {
                  setListMenuOpen(false);
                  setFormListSheet({ list });
                }}
              >
                <Pencil size={15} className="text-muted" />
                Editar
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-border/30 transition-colors"
                onClick={() => {
                  setListMenuOpen(false);
                  setDeleteListTarget(list);
                }}
              >
                <Trash2 size={15} />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {optimisticItems.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-muted">
              {doneItems.length} de {optimisticItems.length} concluídos
            </p>
            <p className="text-xs font-medium text-foreground">
              {Math.round((doneItems.length / optimisticItems.length) * 100)}%
            </p>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${(doneItems.length / optimisticItems.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 pb-40">
        {optimisticItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-1.5 text-center pt-20">
            <p className="text-sm font-medium text-foreground">
              Nenhum item ainda
            </p>
            <p className="text-sm text-muted">
              Toque no + para criar seu primeiro item
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingItems.map((item) => (
              <ItemListItem
                key={item.id}
                item={item}
                isPending={pendingToggleIds.has(item.id)}
                onEdit={() => setFormItemSheet({ item })}
                onDelete={() => setDeleteItemTarget(item)}
                onComplete={() => handleCompleteItem(item)}
              />
            ))}

            {doneItems.length > 0 && (
              <>
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-border" />
                  <p className="text-xs text-muted shrink-0">Concluídos</p>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {doneItems.map((item) => (
                  <ItemListItem
                    key={item.id}
                    item={item}
                    isPending={pendingToggleIds.has(item.id)}
                    onEdit={() => setFormItemSheet({ item })}
                    onDelete={() => setDeleteItemTarget(item)}
                    onComplete={() => handleCompleteItem(item)}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Total bar — only when there are done items */}
      {doneItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-muted">Total gasto</p>
          <p className="text-sm font-semibold text-foreground">
            R$ {doneTotal.toFixed(2)}
          </p>
        </div>
      )}

      <button
        onClick={() => setFormItemSheet({})}
        className="fixed right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        style={{ bottom: doneItems.length > 0 ? "80px" : "32px" }}
        aria-label="Novo item"
      >
        <Plus size={24} color="white" />
      </button>

      {deleteListTarget && (
        <ConfirmDialog
          title="Apagar lista"
          message={`"${deleteListTarget.name}" será removida permanentemente.`}
          confirmLabel="Apagar"
          variant="destructive"
          onConfirm={handleDeleteList}
          onCancel={() => setDeleteListTarget(null)}
        />
      )}

      {deleteItemTarget && (
        <ConfirmDialog
          title="Apagar item"
          message={`"${deleteItemTarget.name}" será removido permanentemente.`}
          confirmLabel="Apagar"
          variant="destructive"
          onConfirm={handleDeleteItem}
          onCancel={() => setDeleteItemTarget(null)}
        />
      )}

      {formListSheet !== null && (
        <ListFormSheet
          initialName={formListSheet.list?.name}
          isEditing={!!formListSheet.list}
          onSubmit={handleListFormSubmit}
          onCancel={() => setFormListSheet(null)}
        />
      )}

      {formItemSheet !== null && (
        <ItemFormSheet
          initialItem={formItemSheet.item}
          isEditing={!!formItemSheet.item}
          onSubmit={handleItemFormSubmit}
          onCancel={() => setFormItemSheet(null)}
        />
      )}
    </div>
  );
}
