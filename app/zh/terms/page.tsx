import { setRequestLocale } from "next-intl/server";
import { TermsPage, termsMetadata } from "@/components/legal/TermsPage";

// Policies are published in English only; the Chinese site keeps its own navigation around them.
export const generateMetadata = () => termsMetadata("zh");

export default function Page() {
  setRequestLocale("zh");
  return <TermsPage />;
}
