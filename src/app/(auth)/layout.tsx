import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Ovation Ticket Show Booking System",
    default: "Ovation Ticket Show Booking System",
  },
  description: "Ovation Ticket Show Booking System",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
    <Providers>
      <NextTopLoader showSpinner={false} />
      <main className="w-full max-w-screen-xl mx-auto min-h-screen bg-gray-2 dark:bg-[#020d1a]">
        {children}
      </main>
    </Providers>
    </body>
    </html>
  );
}