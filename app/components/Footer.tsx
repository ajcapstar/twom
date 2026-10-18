import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-twom-bg border-t border-twom-border text-twom-body pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Row: Newsletter & Brand Message */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-twom-border/40">
          <div>
            <h3 className="font-zodiak text-2xl text-twom-title mb-3">
              The TWOM Newsletter
            </h3>
            <p className="text-sm tracking-wide text-twom-muted max-w-md">
              Receive private invitations to seasonal collection releases,
              editorial stories, and atelier updates.
            </p>
          </div>

          <NewsletterForm />
        </div>

        {/* Middle Row: Navigation Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-twom-border/40 text-sm">
          {/* Column 1: Collection */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-twom-title font-semibold">
              Collection
            </span>
            <Link
              href="/shop"
              className="hover:text-twom-title transition-colors"
            >
              All Pieces
            </Link>
            <Link
              href="/shop?category=tailoring"
              className="hover:text-twom-title transition-colors"
            >
              Tailoring
            </Link>
            <Link
              href="/shop?category=essentials"
              className="hover:text-twom-title transition-colors"
            >
              Essentials
            </Link>
            <Link
              href="/archive"
              className="hover:text-twom-title transition-colors"
            >
              Archives
            </Link>
          </div>

          {/* Column 2: Client Care */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-twom-title font-semibold">
              Client Care
            </span>
            <Link
              href="/care"
              className="hover:text-twom-title transition-colors"
            >
              Fabric & Garment Care
            </Link>
            <Link
              href="/shipping"
              className="hover:text-twom-title transition-colors"
            >
              Shipping & Returns
            </Link>
            <Link
              href="/concierge"
              className="hover:text-twom-title transition-colors"
            >
              Private Concierge
            </Link>
            <Link
              href="/faqs"
              className="hover:text-twom-title transition-colors"
            >
              FAQs
            </Link>
          </div>

          {/* Column 3: Studios */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-twom-title font-semibold">
              Ateliers
            </span>
            <span className="text-twom-muted">42 Mercer Street, New York</span>
            <span className="text-twom-muted">14 Rue Saint-Honoré, Paris</span>
            <Link
              href="/appointments"
              className="hover:text-twom-title transition-colors underline underline-offset-4 pt-1"
            >
              Book an Appointment
            </Link>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-twom-title font-semibold">
              Connect
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-twom-title transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://vogue.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-twom-title transition-colors"
            >
              Editorial Press
            </a>
            <Link
              href="/story"
              className="hover:text-twom-title transition-colors"
            >
              The World of TWOM
            </Link>
          </div>
        </div>

        {/* Bottom Row: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs tracking-wider text-twom-muted space-y-4 md:space-y-0">
          <div>
            &copy; 2026 TWOM Studios. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="hover:text-twom-title transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-twom-title transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
