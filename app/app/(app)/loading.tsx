export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-dvh p-6 animate-pulse">
      <div className="flex items-center justify-between mb-10">
        <div className="h-5 w-44 bg-border rounded-full" />
        <div className="w-9 h-9 rounded-full bg-border" />
      </div>

      <div className="h-3 w-20 bg-border rounded-full mb-3" />

      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-border" />
        ))}
      </div>
    </div>
  );
}
