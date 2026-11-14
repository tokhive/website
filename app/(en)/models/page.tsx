import { setRequestLocale } from "next-intl/server";
import { ModelsPage } from "@/components/pages/ModelsPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("models", "en");

export default function Page() {
  setRequestLocale("en");
  return <ModelsPage />;
}
