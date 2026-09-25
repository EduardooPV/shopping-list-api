interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function FormField({ error, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className="w-full rounded-2xl border border-zinc-200 px-4 py-4 outline-none focus:border-zinc-400"
        {...props}
      />
      {error && <p className="text-xs text-red-500 px-2">{error}</p>}
    </div>
  );
}
