import type { ReactNode } from "react";
import { RootDocument, rootMetadata } from "@/components/RootDocument";

export const generateMetadata = () => rootMetadata("en");

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
