"use client";

import React from 'react';
import './styles/globals.scss';
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { ThemeProvider } from './context/ThemeContext';
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project"];
  const isAuthPage = hiddenRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
      </head>
      <body className={isAuthPage ? "flex justify-center items-center min-h-screen" : ""} id='__next'>
        {!isAuthPage && <Header />}
        <div className="flex">
          {!isAuthPage && <Sidebar />}
          <SessionProvider>
            <ThemeProvider>
              <main className={`${isAuthPage ? "w-full max-w-md" : "ml-80 flex-1 p-5"}`}>
                {children}
              </main>
            </ThemeProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
