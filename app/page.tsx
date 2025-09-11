import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
// import { Faq } from "@/components/home/FAQ";
import { Contact } from "@/components/home/Contact";
import { Working } from "@/components/home/Working";
import { GlobalBG } from "@/components/home/GlobalBG";

export default function Home() {
  return (
    <div className="relative">
      <GlobalBG />
      <div className="relative z-10">
        <Hero />
        <Working />
        <Features />
        {/* <Faq /> */}
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
