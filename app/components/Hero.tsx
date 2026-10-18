import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default async function Hero() {
  // 1. Fetch data right inside the component
  const { data: heroData } = await supabase
    .from("hero_sections")
    .select("*")
    .eq("is_active", true)
    .single();

  // 2. Fallback logic (protects against empty DB or network failure)
  const hero = heroData || {
    headline: "Find your fitf.",
    button_text: "Explore styles",
    button_link: "/products",
    video_url: "/hero-video.mp4",
    poster_url: "",
  };

  return (
    <section className="relative h-[70svh] w-full overflow-hidden flex flex-col justify-end px-6 pb-12 md:px-12 md:pb-16">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={hero.poster_url}
        className="absolute inset-0 z-0 w-full h-full object-cover brightness-90"
      >
        <source src={hero.video_url} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-1 flex flex-col items-start gap-6">
        <h1 className="font-zodiak text-4xl md:text-6xl text-white tracking-tight leading-tight ">
          {hero.headline}
        </h1>

        <Link
          href={hero.button_link}
          className="border border-white text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-white hover:text-black transition-all duration-300"
        >
          {hero.button_text}
        </Link>
      </div>
    </section>
  );
}
