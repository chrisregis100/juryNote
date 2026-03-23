import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
