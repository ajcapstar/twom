export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 pb-6 border-b border-zinc-200">
          <div className="h-4 w-24 bg-zinc-200 mb-3" />
          <div className="h-10 w-64 bg-zinc-200" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="h-4 w-40 bg-zinc-200 mb-6" />
            <div className="h-12 w-full bg-zinc-200" />
            <div className="h-12 w-full bg-zinc-200" />
            <div className="h-28 w-full bg-zinc-200" />
            <div className="h-14 w-full bg-zinc-300 mt-6" />
          </div>

          <div className="w-full lg:w-5/12">
            <div className="bg-white border border-zinc-200 p-8 space-y-4">
              <div className="h-4 w-36 bg-zinc-200 mb-6" />
              <div className="h-16 w-full bg-zinc-100" />
              <div className="h-16 w-full bg-zinc-100" />
              <div className="h-8 w-full bg-zinc-200 mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

