import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import Procedures from "@/components/Procedures";
import LanguagesSection from "@/components/LanguagesSection";
import Pricing from "@/components/Pricing";
import { CtaSection, Footer } from "@/components/CtaAndFooter";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Nav locale={locale} />
      <main className="flex-1">
        <Hero locale={locale} />
        <ProblemSection />
        <HowItWorks />
        <Procedures locale={locale} />
        <LanguagesSection />
        <Pricing locale={locale} />
        <CtaSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
