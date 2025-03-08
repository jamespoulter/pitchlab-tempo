"use client";

import { ReactNode } from "react";
import AdminNavbar from "./admin-navbar";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
} 