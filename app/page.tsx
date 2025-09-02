import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Faq } from "@/components/home/FAQ";
import { Contact } from "@/components/home/Contact";
import { Working } from "@/components/home/Working";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Faq />
      <Working />
      <Contact />
      <Footer />
    </>
  );
}
