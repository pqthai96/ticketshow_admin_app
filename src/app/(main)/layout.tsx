import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers";
import { Sidebar } from "@/components/use-components/sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s | Ovation Ticket Show Booking System",
    default: "Ovation Ticket Show Booking System",
  },
  description: "Ovation Ticket Show Booking System",
};

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
    <Providers>
      <NextTopLoader showSpinner={false} />

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
    </body>
    </html>
  );
}