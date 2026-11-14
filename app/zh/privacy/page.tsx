import { setRequestLocale } from "next-intl/server";
import { PrivacyPage, privacyMetadata } from "@/components/legal/PrivacyPage";

// Policies are published in English only; the Chinese site keeps its own navigation around them.
export const generateMetadata = () => privacyMetadata("zh");

export default function Page() {
  setRequestLocale("zh");
  return <PrivacyPage />;
}
