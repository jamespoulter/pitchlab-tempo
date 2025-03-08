"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Check if the user's UUID matches the admin UUID
        const ADMIN_UUID = "1a737665-e3bd-47f7-8cd2-c5d2937a9689";
        
        if (!user || user.id !== ADMIN_UUID) {
          console.log("Access denied: Not an admin user");
          // Not an admin, redirect to home
          redirect('/');
        } else {
          console.log("Admin access granted");
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Error checking admin status:", e);
        redirect('/');
      }
    };
    
    checkAdminStatus();
  }, []);

  // Show loading state while checking admin status
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
} 