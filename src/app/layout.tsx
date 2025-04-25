"use client";

import React from "react";
import "./styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { ThemeProvider } from "./context/ThemeContext";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project", "/loading", "/not-found", "/privacy-policy", ];
  const isAuthPage = hiddenRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
      </head>
      <body className={`h-screen overflow-hidden ${isAuthPage ? "flex justify-center items-center" : ""}`} id="__next">
        {!isAuthPage && <Header />}
        <div className="flex h-screen">
          {!isAuthPage && <Sidebar />}
          <SessionProvider>
            <ThemeProvider>
              <main className={`flex-1 overflow-auto p-5 ${isAuthPage ? "w-screen" : "ml-80"}`}>
                {children}
                <Toaster />
              </main>
            </ThemeProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
