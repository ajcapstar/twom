export default function CheckoutSuccessLoading() {
  return (
    <div className="min-h-screen bg-twom-bg pt-36 pb-24 px-6 md:px-12 flex flex-col items-center animate-pulse">
      <div className="max-w-2xl w-full bg-white border border-zinc-200 p-8 md:p-12 space-y-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-200" />
        <div className="h-4 w-32 bg-zinc-200 mx-auto" />
        <div className="h-8 w-64 bg-zinc-200 mx-auto" />
        <div className="h-20 w-full bg-zinc-100 mt-6" />
        <div className="h-32 w-full bg-zinc-100" />
        <div className="h-12 w-full bg-zinc-300 mt-6" />
      </div>
    </div>
  );
}

