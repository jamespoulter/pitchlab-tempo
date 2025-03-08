"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import { AdminShell } from "@/components/admin-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Download, RefreshCw } from "lucide-react";

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  created_at: string;
  contacted: boolean;
  source?: "database" | "localStorage";
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function AdminWaitlistPage() {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if the user's UUID matches the admin UUID
      const ADMIN_UUID = "1a737665-e3bd-47f7-8cd2-c5d2937a9689";
      const isUserAdmin = user && user.id === ADMIN_UUID;
      
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (e) {
      console.error("Error checking admin status:", e);
      return false;
    }
  };

  const fetchWaitlistEntries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check admin status first
      const isAdminUser = await checkAdminStatus();
      if (!isAdminUser) {
        setError("You don't have permission to view this page");
        setIsLoading(false);
        return;
      }
      
      // Fetch from database
      const supabase = createClient();
      const { data: dbEntries, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching from database:", error);
        setError("Failed to fetch waitlist entries from database");
      }

      // Get entries from localStorage
      let localStorageEntries: WaitlistEntry[] = [];
      try {
        const storedEntries = localStorage.getItem("waitlistEntries");
        if (storedEntries) {
          localStorageEntries = JSON.parse(storedEntries).map((entry: WaitlistEntry) => ({
            ...entry,
            source: "localStorage"
          }));
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }

      // Combine entries, marking their source
      const dbEntriesWithSource = (dbEntries || []).map((entry: WaitlistEntry) => ({
        ...entry,
        source: "database" as const
      }));

      // Filter out localStorage entries that exist in the database (by email)
      const dbEmails = new Set(dbEntriesWithSource.map(entry => entry.email));
      const uniqueLocalStorageEntries = localStorageEntries.filter(
        entry => !dbEmails.has(entry.email)
      );

      setWaitlistEntries([...dbEntriesWithSource, ...uniqueLocalStorageEntries]);
    } catch (e) {
      console.error("Error in fetchWaitlistEntries:", e);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistEntries();
  }, []);

  const handleMarkAsContacted = async (id: string, source: "database" | "localStorage" = "database") => {
    if (source === "database") {
      const supabase = createClient();
      await supabase
        .from("waitlist")
        .update({ contacted: true })
        .eq("id", id);
    } else {
      // Update in localStorage
      const storedEntries = JSON.parse(localStorage.getItem("waitlistEntries") || "[]");
      const updatedEntries = storedEntries.map((entry: WaitlistEntry) => 
        entry.id === id ? { ...entry, contacted: true } : entry
      );
      localStorage.setItem("waitlistEntries", JSON.stringify(updatedEntries));
    }
    
    // Refresh the list
    fetchWaitlistEntries();
  };

  const exportToCSV = () => {
    if (waitlistEntries.length === 0) return;
    
    const headers = ["Name", "Email", "Company", "Role", "Created At", "Contacted", "Source"];
    const csvRows = [
      headers.join(","),
      ...waitlistEntries.map(entry => [
        `"${entry.name.replace(/"/g, '""')}"`,
        `"${entry.email.replace(/"/g, '""')}"`,
        `"${entry.company.replace(/"/g, '""')}"`,
        `"${entry.role.replace(/"/g, '""')}"`,
        `"${entry.created_at}"`,
        entry.contacted ? "Yes" : "No",
        entry.source || "database"
      ].join(","))
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Format date for filename without date-fns
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    link.setAttribute("download", `waitlist-${dateStr}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin && !isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-heading font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this admin page. Please contact an administrator if you believe this is an error.
          </p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminShell>
      <DashboardHeader
        heading="Waitlist Management"
        description="Manage people who have joined the waitlist"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchWaitlistEntries}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={waitlistEntries.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </DashboardHeader>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : waitlistEntries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No waitlist entries found
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlistEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.company}</TableCell>
                  <TableCell>{entry.role}</TableCell>
                  <TableCell>
                    {formatDate(entry.created_at)}
                  </TableCell>
                  <TableCell>
                    {entry.contacted ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Contacted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={entry.source === "database" ? "default" : "outline"}>
                      {entry.source || "database"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!entry.contacted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsContacted(entry.id, entry.source)}
                      >
                        Mark as Contacted
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminShell>
  );
} 