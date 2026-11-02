export default function AdminOrdersLoading() {
  return (
    <div className="min-h-screen bg-twom-bg pt-28 pb-24 px-6 md:px-12 animate-pulse">
      <div className="max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-200">
          <div>
            <div className="h-9 w-64 bg-zinc-200 mb-2" />
            <div className="h-4 w-80 bg-zinc-200" />
          </div>
          <div className="h-8 w-36 bg-zinc-200" />
        </div>

        {/* Orders list skeleton */}
        <div className="flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-zinc-200 p-8 flex flex-col md:flex-row gap-8 justify-between"
            >
              <div className="flex-grow space-y-4">
                <div className="flex gap-3">
                  <div className="h-5 w-16 bg-zinc-200" />
                  <div className="h-5 w-24 bg-zinc-200" />
                </div>
                <div className="h-6 w-48 bg-zinc-200" />
                <div className="h-4 w-60 bg-zinc-200" />
                <div className="h-10 w-full bg-zinc-100" />
              </div>
              <div className="md:w-48 space-y-3 md:text-right">
                <div className="h-4 w-20 bg-zinc-200 md:ml-auto" />
                <div className="h-8 w-32 bg-zinc-200 md:ml-auto" />
                <div className="h-9 w-full bg-zinc-200 mt-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

