import { redirect } from "next/navigation";

export default function StripeTestPage() {
  // Redirect to the consolidated test page
  redirect('/stripe-test-consolidated');
} 