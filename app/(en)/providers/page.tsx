import { setRequestLocale } from "next-intl/server";
import { ProvidersPage } from "@/components/pages/ProvidersPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("providers", "en");

export default function Page() {
  setRequestLocale("en");
  return <ProvidersPage />;
}
