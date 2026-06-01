import { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Nav />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
