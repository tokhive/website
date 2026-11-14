import { setRequestLocale } from "next-intl/server";
import { NetworkPage } from "@/components/pages/NetworkPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("network", "zh");

export default function Page() {
  setRequestLocale("zh");
  return <NetworkPage />;
}
