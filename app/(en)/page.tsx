import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/pages/HomePage";

export default function Page() {
  setRequestLocale("en");
  return <HomePage />;
}
