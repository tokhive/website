import { setRequestLocale } from "next-intl/server";
import { LivePage } from "@/components/pages/LivePage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("live", "en");

export default function Page() {
  setRequestLocale("en");
  return <LivePage />;
}
