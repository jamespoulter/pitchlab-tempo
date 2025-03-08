"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, Bell, Plus, Search, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export default function AdminNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Check if the user's UUID matches the admin UUID
      const ADMIN_UUID = "1a737665-e3bd-47f7-8cd2-c5d2937a9689";
      const isUserAdmin = user && user.id === ADMIN_UUID;
      
      setIsAdmin(!!isUserAdmin);
      
      // Redirect non-admins
      if (!isUserAdmin) {
        router.push('/');
      }
    };
    
    getUser();
  }, [supabase, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-3">
      <div className="px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-1.5 rounded">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-heading font-bold">Admin Panel</span>
          </Link>
          
          <div className="relative w-64 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full p-2 pl-10 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Admin Mode
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.user_metadata?.full_name || user?.email}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin" className="w-full">
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/waitlist" className="w-full">
                  Waitlist Management
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard" className="w-full">
                  Back to Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/" className="w-full">
                  Back to Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
                className="text-red-600 focus:text-red-600"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
} 