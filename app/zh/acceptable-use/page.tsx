import { setRequestLocale } from "next-intl/server";
import { AcceptableUsePage, acceptableUseMetadata } from "@/components/legal/AcceptableUsePage";

// Policies are published in English only; the Chinese site keeps its own navigation around them.
export const generateMetadata = () => acceptableUseMetadata("zh");

export default function Page() {
  setRequestLocale("zh");
  return <AcceptableUsePage />;
}
