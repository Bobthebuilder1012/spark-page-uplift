import { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Nav />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
