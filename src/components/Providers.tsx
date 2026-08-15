"use client";

import { DemoProvider } from "@/lib/store";
import { Nav, Footer } from "@/components/Nav";
import { DemoChrome } from "@/components/DemoChrome";
import { FulfillmentNotice } from "@/components/DonatePanel";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <Nav />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-5 py-8">{children}</main>
      <Footer />
      <DemoChrome />
      <FulfillmentNotice />
    </DemoProvider>
  );
}
