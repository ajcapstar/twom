import Image from "next/image";
import Link from "next/link";

export interface CampaignBannerItem {
  title: string;
  image: string;
  link: string;
  priority?: boolean;
}

interface EditorialCampaignBannersProps {
  banner1?: CampaignBannerItem;
  banner2?: CampaignBannerItem;
}

const DEFAULT_BANNER_1: CampaignBannerItem = {
  title: "Tees & Tanks",
  image: "/campaign/tees-and-tanks.jpg",
  link: "/products?category=Tees%20%26%20Tanks",
  priority: true,
};

const DEFAULT_BANNER_2: CampaignBannerItem = {
  title: "Pants",
  image: "/campaign/pants.jpg",
  link: "/products?category=Pants",
  priority: true,
};

export default function EditorialCampaignBanners({
  banner1 = DEFAULT_BANNER_1,
  banner2 = DEFAULT_BANNER_2,
}: EditorialCampaignBannersProps) {
  const isLogo1 =
    banner1.image.includes("TWOM.png") || banner1.image.includes("Twom.png");
  const isLogo2 =
    banner2.image.includes("TWOM.png") || banner2.image.includes("Twom.png");

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-0 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* BANNER 1 */}
        <Link
          href={banner1.link}
          className={`group relative block h-175 md:h-175 w-full overflow-hidden ${
            isLogo1 ? "bg-zinc-950" : "bg-zinc-100"
          }`}
        >
          <Image
            src={banner1.image}
            alt={`${banner1.title} Campaign`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={banner1.priority}
            className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
              isLogo1
                ? "object-contain p-16 invert opacity-90"
                : "object-cover object-center"
            }`}
          />

          {/* Subtle gradient vignette to ensure text contrast */}
          <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/15 to-transparent pointer-events-none" />

          {/* Editorial Typography Overlay */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 flex flex-col items-start gap-1">
            <h2 className="font-nippo italic font-black text-2xl md:text-3xl text-white uppercase tracking-wider drop-shadow-sm leading-tight">
              {banner1.title}
            </h2>
            <span className="font-nippo italic font-bold text-[11px] md:text-xs text-white uppercase tracking-wider underline underline-offset-4 group-hover:opacity-80 transition-opacity">
              Shop Now
            </span>
          </div>
        </Link>

        {/* BANNER 2 */}
        <Link
          href={banner2.link}
          className={`group relative block h-175 md:h-175 w-full overflow-hidden ${
            isLogo2 ? "bg-zinc-950" : "bg-zinc-100"
          }`}
        >
          <Image
            src={banner2.image}
            alt={`${banner2.title} Campaign`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={banner2.priority}
            className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
              isLogo2
                ? "object-contain p-16 invert opacity-90"
                : "object-cover object-center"
            }`}
          />

          {/* Subtle gradient vignette to ensure text contrast */}
          <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/15 to-transparent pointer-events-none" />

          {/* Editorial Typography Overlay */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 flex flex-col items-start gap-1">
            <h2 className="font-nippo italic font-black text-2xl md:text-3xl text-white uppercase tracking-wider drop-shadow-sm leading-tight">
              {banner2.title}
            </h2>
            <span className="font-nippo italic font-bold text-[11px] md:text-xs text-white uppercase tracking-wider underline underline-offset-4 group-hover:opacity-80 transition-opacity">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
