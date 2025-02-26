"use client";

import UserHeader from "@/features/user/UserHeader";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {

  return (
    <SessionProvider>
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <div className="flex-1">{children}</div>
    </div>
    </SessionProvider>
  );
}