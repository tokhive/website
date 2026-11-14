import { setRequestLocale } from "next-intl/server";
import { ModelsPage } from "@/components/pages/ModelsPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("models", "zh");

export default function Page() {
  setRequestLocale("zh");
  return <ModelsPage />;
}
