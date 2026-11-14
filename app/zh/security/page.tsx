import { setRequestLocale } from "next-intl/server";
import { SecurityPage } from "@/components/pages/SecurityPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("security", "zh");

export default function Page() {
  setRequestLocale("zh");
  return <SecurityPage />;
}
