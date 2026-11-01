export default function ProductLoading() {
  return (
    <div className="w-full min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12 animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Column Skeleton */}
        <div className="w-full md:w-1/2">
          <div className="aspect-3/4 w-full bg-zinc-200" />
        </div>

        {/* Right Column Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
          <div className="h-3 w-24 bg-zinc-200" />
          <div className="h-8 w-3/4 bg-zinc-200" />
          <div className="h-6 w-28 bg-zinc-200" />
          <div className="h-20 w-full bg-zinc-200 my-4" />
          <div className="h-12 w-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

