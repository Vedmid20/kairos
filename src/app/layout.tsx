"use client";

import React from 'react';
import './styles/globals.scss';
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
      </head>
      <body>
        <Header />
        <Sidebar />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
