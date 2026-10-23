import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { LiveNetwork } from "@/components/network/LiveNetwork";

export const metadata: Metadata = {
  title: "Network",
  description: "Live TokHive network: providers online, token usage and TEE attestations.",
};

export default function NetworkPage() {
  return (
    <>
      <main className="site-container">
        <Nav />
        <LiveNetwork />
      </main>
      <Footer />
    </>
  );
}
