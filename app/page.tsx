import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import Hero from "@/components/sections/Hero";
import Collections from "@/components/sections/Collections";
import Categories from "@/components/sections/Categories";
import TopPicks from "@/components/sections/TopPicks";
import MoreFromUs from "@/components/sections/MoreFromUs";
import Testimonials from "@/components/sections/Testimonials";
import AboutUs from "@/components/sections/AboutUs";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Collections />
        <Categories />
        <TopPicks />
        <MoreFromUs />
        <Testimonials />
        <AboutUs />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
