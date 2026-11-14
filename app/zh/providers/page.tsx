import { setRequestLocale } from "next-intl/server";
import { ProvidersPage } from "@/components/pages/ProvidersPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("providers", "zh");

export default function Page() {
  setRequestLocale("zh");
  return <ProvidersPage />;
}
