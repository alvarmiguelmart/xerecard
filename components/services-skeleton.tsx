export function ServicesSkeleton() {
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-3" aria-hidden="true">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-[28rem] animate-pulse rounded-xl border border-ink/10 bg-paper"
        >
          <div className="h-48 rounded-t-xl bg-cloud" />
          <div className="grid gap-3 p-5">
            <div className="h-4 w-2/3 rounded bg-line" />
            <div className="h-7 w-full rounded bg-line" />
            <div className="h-7 w-4/5 rounded bg-line" />
            <div className="h-16 rounded bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

