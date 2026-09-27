import { ShoppingBag } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
        <ShoppingBag size={18} color="white" strokeWidth={2.5} />
      </div>
      <span className="font-semibold text-foreground">Shopping List</span>
    </div>
  );
}
