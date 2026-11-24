import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { LiveHive } from "@/components/live/LiveHive";

export function LivePage() {
  return (
    <>
      <main className="live-page">
        <div className="site-container">
          <Nav />
        </div>
        <LiveHive />
      </main>
      <Footer compact />
    </>
  );
}
