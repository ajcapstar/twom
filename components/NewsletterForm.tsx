"use client";

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row items-stretch gap-3"
    >
      <input
        type="email"
        placeholder="Enter your email address"
        className="bg-transparent border border-twom-border px-4 py-3 text-sm text-twom-title placeholder:text-twom-muted/60 focus:outline-none focus:border-twom-title flex-1 transition-colors"
      />
      <button
        type="submit"
        className="bg-twom-dark text-white px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-twom-muted transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
