import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { checkUserSubscription } from "@/app/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  
  // Check if user has an active subscription with trial information
  const subscriptionInfo = await checkUserSubscription(user.id);

  // Add subscription info to the global window object for client components
  const subscriptionScript = `
    window.subscriptionInfo = ${JSON.stringify(subscriptionInfo)};
  `;

  return (
    <div className="flex h-screen bg-gray-50">
      <script
        dangerouslySetInnerHTML={{ __html: subscriptionScript }}
      />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
