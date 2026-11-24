import { setRequestLocale } from "next-intl/server";
import { EgressPage } from "@/components/pages/EgressPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("egress", "en");

export default function Page() {
  setRequestLocale("en");
  return <EgressPage />;
}
