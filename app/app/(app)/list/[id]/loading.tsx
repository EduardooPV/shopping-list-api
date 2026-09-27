export default function ListLoading() {
  return (
    <div className="flex flex-col min-h-dvh animate-pulse">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="w-9 h-9 rounded-full bg-border" />
        <div className="h-5 w-32 bg-border rounded-full" />
        <div className="w-9 h-9 rounded-full bg-border" />
      </div>

      <div className="px-6 pb-4">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 w-28 bg-border rounded-full" />
          <div className="h-3 w-8 bg-border rounded-full" />
        </div>
        <div className="h-1.5 w-full bg-border rounded-full" />
      </div>

      <div className="px-6 flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-border" />
        ))}
      </div>
    </div>
  );
}
