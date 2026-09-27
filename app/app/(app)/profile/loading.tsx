export default function ProfileLoading() {
  return (
    <div className="flex flex-col min-h-dvh px-6 py-10 animate-pulse">
      <div className="h-5 w-16 bg-border rounded-full mb-8" />

      <div className="flex flex-col items-center gap-4 pt-6">
        <div className="w-16 h-16 rounded-full bg-border" />
      </div>

      <div className="flex flex-col mt-10 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-4 border-b border-border flex flex-col gap-2">
          <div className="h-3 w-10 bg-border rounded-full" />
          <div className="h-4 w-32 bg-border rounded-full" />
        </div>
        <div className="px-4 py-4 flex flex-col gap-2">
          <div className="h-3 w-10 bg-border rounded-full" />
          <div className="h-4 w-48 bg-border rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-8">
        <div className="h-14 rounded-2xl bg-border" />
        <div className="h-14 rounded-2xl bg-border" />
      </div>
    </div>
  );
}
