import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/utils/subscription";
import StripeConsolidatedComponent from "@/components/stripe-consolidated-component";
import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function StripeTestConsolidatedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is not logged in, redirect to sign-in
  if (!user) {
    return redirect('/sign-in?redirect_to=/stripe-test-consolidated');
  }

  // Check if the user already has an active subscription
  const hasSubscription = await hasActiveSubscription(supabase, user.id);
  
  // If the user has an active subscription, show a message
  if (hasSubscription) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-6">Stripe Test Page</h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-2">You already have an active subscription!</h2>
            <p className="text-green-700">
              You can manage your subscription from the dashboard.
            </p>
            <div className="mt-4">
              <a href="/dashboard" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Get a test price ID for the Stripe checkout
  const { data: plans, error } = await supabase.functions.invoke('get-plans', {
    body: {
      product_id: "prod_RtvFwU7NJ0AK7g" // Updated to use the provided test product ID
    }
  });

  // If there's an error or no plans, show an error message
  if (error || !plans || plans.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-6">Stripe Test Page</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error loading plans</h2>
            <p className="text-red-700">
              {error?.message || "No plans available. Please try again later."}
            </p>
          </div>
        </div>
      </>
    );
  }

  // Get the first plan for testing, or use the fallback price ID
  const testPlan = plans[0] || {
    id: "price_1R07PCI7Diy7LoDfEfcS7u3L",
    price_id: "price_1R07PCI7Diy7LoDfEfcS7u3L",
    amount: 4500,
    currency: "gbp",
    product: {
      name: "PitchHub Plus",
      metadata: {
        trial_period_days: "7"
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Stripe Test Page</h1>
        
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="standard">Standard Checkout</TabsTrigger>
            <TabsTrigger value="tempo-fix">TEMPO Fix Checkout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="mt-0">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Standard Stripe Integration</h2>
              <p className="mb-6 text-gray-600">
                This is the standard Stripe checkout integration. Click the button below to start a test checkout process.
              </p>
              
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">User Information</h3>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">Test Plan Information</h3>
                <p><strong>Plan ID:</strong> {testPlan.id}</p>
                <p><strong>Price ID:</strong> {testPlan.price_id || testPlan.id}</p>
                <p><strong>Product:</strong> {testPlan.product?.name || 'Unknown'}</p>
                <p><strong>Amount:</strong> {(testPlan.amount / 100).toFixed(2)} {testPlan.currency?.toUpperCase()}</p>
                <p><strong>Trial Period:</strong> {testPlan.product?.metadata?.trial_period_days || 7} days</p>
              </div>
              
              <StripeConsolidatedComponent 
                user={user} 
                priceId={testPlan.price_id || testPlan.id} 
                trialPeriodDays={testPlan.product?.metadata?.trial_period_days || 7}
                useTempoFix={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tempo-fix" className="mt-0">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Stripe Integration with TEMPO Fix</h2>
              <p className="mb-6 text-gray-600">
                This test page disables Stripe's advanced fraud signals which may be conflicting with TEMPO's error handling.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2 text-yellow-800">How This Works</h3>
                <p className="text-yellow-700 mb-2">
                  TEMPO's error handling script may be interfering with Stripe's checkout process. This page:
                </p>
                <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                  <li>Uses the pure version of Stripe.js to defer loading</li>
                  <li>Disables Stripe's advanced fraud signals</li>
                  <li>Provides detailed error logging</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">User Information</h3>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">Test Plan Information</h3>
                <p><strong>Plan ID:</strong> {testPlan.id}</p>
                <p><strong>Price ID:</strong> {testPlan.price_id || testPlan.id}</p>
                <p><strong>Product:</strong> {testPlan.product?.name || 'Unknown'}</p>
                <p><strong>Amount:</strong> {(testPlan.amount / 100).toFixed(2)} {testPlan.currency?.toUpperCase()}</p>
                <p><strong>Trial Period:</strong> {testPlan.product?.metadata?.trial_period_days || 7} days</p>
              </div>
              
              <StripeConsolidatedComponent 
                user={user} 
                priceId={testPlan.price_id || testPlan.id} 
                trialPeriodDays={testPlan.product?.metadata?.trial_period_days || 7}
                useTempoFix={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
} 