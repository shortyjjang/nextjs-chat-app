"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {

  return (
    <SessionProvider>
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{children}</div>
    </div>
    </SessionProvider>
  );
}