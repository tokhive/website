import { setRequestLocale } from "next-intl/server";
import { ModelsPage } from "@/components/pages/ModelsPage";
import { pageMetadata } from "@/i18n/metadata";
import { buildTimeModels } from "@/lib/build-snapshot";

export const generateMetadata = () => pageMetadata("models", "en");

export default async function Page() {
  setRequestLocale("en");
  return <ModelsPage initialModels={await buildTimeModels()} />;
}
