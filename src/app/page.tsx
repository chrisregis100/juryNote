import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PublicEventsSection } from "@/components/landing/public-events-section";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { CTAFinal } from "@/components/landing/cta-final";
import { Footer } from "@/components/landing/footer";

const FAQ = dynamic(
  () => import("@/components/landing/faq").then((m) => ({ default: m.FAQ })),
  { ssr: true }
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
        <PublicEventsSection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
