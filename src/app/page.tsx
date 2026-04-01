import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Stats } from "@/components/landing/stats";
import dynamic from "next/dynamic";

const FAQ = dynamic(
  () => import("@/components/landing/faq").then((m) => ({ default: m.FAQ })),
  { ssr: true },
);

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        {/* <PublicEventsSection /> */}
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        <FAQ />
        {/* <CTAFinal /> */}
      </main>
      <Footer />
    </>
  );
}
