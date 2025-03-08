"use client";

import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ListChecks, Settings, BarChart } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardHeader
        heading="Admin Dashboard"
        description="Manage your PitchHub platform"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Waitlist</div>
            <p className="text-xs text-muted-foreground">
              View and manage users who have joined the waitlist
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/waitlist">View Waitlist</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Users</div>
            <p className="text-xs text-muted-foreground">
              View and manage user accounts and permissions
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#">Coming Soon</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Platform Analytics</div>
            <p className="text-xs text-muted-foreground">
              View usage statistics and platform analytics
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#">Coming Soon</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Platform Settings</div>
            <p className="text-xs text-muted-foreground">
              Configure global platform settings
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#">Coming Soon</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminShell>
  );
} 