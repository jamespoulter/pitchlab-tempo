"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ManageBillingButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function ManageBillingButton({ className, size = "sm" }: ManageBillingButtonProps) {
  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      onClick={() => window.open('https://billing.stripe.com/p/login/test_28o5nA9Ot8Ub9yw288', '_blank')}
    >
      Manage Billing
    </Button>
  );
}

interface UpgradeButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function UpgradeButton({ className, size = "default" }: UpgradeButtonProps) {
  return (
    <Button
      className={className}
      size={size}
      onClick={() => window.location.href = '/#pricing'}
    >
      <Sparkles className="h-4 w-4 mr-2" />
      Upgrade to PitchHub Plus
    </Button>
  );
}

interface CancelSubscriptionButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function CancelSubscriptionButton({ className, size = "sm" }: CancelSubscriptionButtonProps) {
  return (
    <Button
      variant="outline"
      size={size}
      className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${className}`}
      onClick={() => window.open('https://billing.stripe.com/p/login/test_28o5nA9Ot8Ub9yw288', '_blank')}
    >
      Cancel Subscription
    </Button>
  );
} 