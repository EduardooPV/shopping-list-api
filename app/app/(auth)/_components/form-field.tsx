interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function FormField({ error, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <input
        className="w-full rounded-2xl border border-border bg-white px-4 py-4 outline-none transition-colors placeholder:text-muted focus:border-primary"
        {...props}
      />
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  );
}
