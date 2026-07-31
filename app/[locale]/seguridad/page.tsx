import Nav from "@/components/Nav";
import ProcedureWizard from "@/components/ProcedureWizard";
import { Footer } from "@/components/CtaAndFooter";

export default async function SeguridadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Nav locale={locale} />
      <main className="flex-1 px-6 py-14 md:py-20">
        <ProcedureWizard procedureId="seguridad" namespace="seguridadWizard" />
      </main>
      <Footer locale={locale} />
    </>
  );
}
