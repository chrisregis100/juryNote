import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTAFinal } from "@/components/landing/cta-final";
import { Footer } from "@/components/landing/footer";

export default async function HomePage() {
  const session = await getServerSession();

  if (session?.user) {
    if ("eventId" in session.user && "juryAssignmentId" in session.user) {
      redirect("/jury");
    }
    redirect("/admin");
  }

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
