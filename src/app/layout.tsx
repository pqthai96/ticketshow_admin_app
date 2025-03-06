import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Ovation Ticket Show Booking System",
    default: "Ovation Ticket Show Booking System"
  },
  description:
    "Ovation Ticket Show Booking System"
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
    {children}
    </body>
    </html>
  );
}
