import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { checkUserSubscription } from "@/app/actions";
import Script from "next/script";
import StripeRedirectHandler from "@/components/stripe-redirect-handler";

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
  
  // Stringify the subscription info for client-side use
  const subscriptionData = JSON.stringify(subscriptionInfo);

  return (
    <div className="flex h-screen bg-gray-50">
      <Script id="subscription-data" strategy="afterInteractive">
        {`window.subscriptionInfo = ${subscriptionData};`}
      </Script>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <StripeRedirectHandler />
          {children}
        </main>
      </div>
    </div>
  );
}
