import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/pages/HomePage";
import { buildTimeModels } from "@/lib/build-snapshot";

export default async function Page() {
  setRequestLocale("zh");
  return <HomePage initialModels={await buildTimeModels()} />;
}
