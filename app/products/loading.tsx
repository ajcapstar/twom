export default function ProductsLoading() {
  return (
    <div className="w-full min-h-screen bg-twom-bg pt-32 pb-24 px-4 md:px-6 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-zinc-200 mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-3/4 w-full bg-zinc-200" />
              <div className="h-4 w-3/4 bg-zinc-200" />
              <div className="h-4 w-1/4 bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

