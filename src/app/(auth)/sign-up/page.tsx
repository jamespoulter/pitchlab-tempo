import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { createClient } from "../../../../supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default async function Signup(props: {
  searchParams: Promise<Message & { plan?: string; trial?: string }>;
}) {
  const searchParams = await props.searchParams;
  const planId = searchParams.plan;
  const trialDays = searchParams.trial || "7";
  
  // Fetch plan details if a plan ID is provided
  let planDetails = null;
  if (planId) {
    const supabase = await createClient();
    const { data: planData, error } = await supabase.functions.invoke(
      "get-plans",
      {
        body: {
          product_id: "prod_RuEdYVyOF1Vitg" // PitchHub Plus product ID
        }
      }
    );
    
    if (planData && Array.isArray(planData)) {
      planDetails = planData.find((plan: any) => plan.id === planId);
    }
  }
  
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  // Format currency amount
  const formatAmount = (amount: number | null | undefined, currency: string = 'GBP') => {
    const safeAmount = amount ?? 4500;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(safeAmount / 100);
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          {planDetails && (
            <Card className="mb-6 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Selected Plan: {planDetails.product?.name || "PitchHub Plus"}</CardTitle>
                <CardDescription className="text-lg font-semibold">
                  {formatAmount(planDetails.amount, planDetails.currency)}/{planDetails.interval || "month"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {planDetails.product?.metadata?.description || "Full access to all PitchHub Plus features"}
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <Check size={16} className="mr-1" />
                  <span>Includes {trialDays}-day free trial</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Hidden fields to pass plan information */}
            {planId && <input type="hidden" name="plan_id" value={planId} />}
            {trialDays && <input type="hidden" name="trial_days" value={trialDays} />}

            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full"
            >
              {planDetails ? "Sign up & Continue to Payment" : "Sign up"}
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
