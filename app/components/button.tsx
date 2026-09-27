import { Loader2 } from "lucide-react";

type Variant = "primary" | "outline" | "destructive" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-primary hover:bg-primary-hover text-white",
  outline: "border border-border text-foreground",
  destructive: "bg-red-500 hover:bg-red-600 text-white",
  ghost: "text-red-500",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`w-full rounded-2xl py-4 text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center ${variants[variant]} ${className ?? ""}`.trim()}
      {...props}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
}
