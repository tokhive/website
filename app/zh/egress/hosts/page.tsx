import { setRequestLocale } from "next-intl/server";
import { EgressHostsPage } from "@/components/pages/EgressHostsPage";
import { pageMetadata } from "@/i18n/metadata";

export const generateMetadata = () => pageMetadata("egressHosts", "zh");

export default function Page() {
  setRequestLocale("zh");
  return <EgressHostsPage />;
}
