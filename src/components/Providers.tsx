"use client";

import { AppProvider, useApp } from "@/lib/store";
import { Nav, Footer } from "@/components/Nav";
import { FulfillmentNotice } from "@/components/ClosePanel";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Nav />
      <main id="content" className="min-h-[70dvh] py-8">
        {children}
      </main>
      <Footer />
      <FulfillmentNotice />
    </AppProvider>
  );
}

export function useSession() {
  return useApp();
}
