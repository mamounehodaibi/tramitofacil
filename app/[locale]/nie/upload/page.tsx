import Nav from "@/components/Nav";
import DocumentUpload from "@/components/DocumentUpload";
import { Footer } from "@/components/CtaAndFooter";

export default async function NieUploadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Nav locale={locale} />
      <main className="flex-1 px-6 py-14 md:py-20">
        <DocumentUpload procedureId="nie" />
      </main>
      <Footer locale={locale} />
    </>
  );
}
