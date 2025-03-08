"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Award,
  FolderKanban,
  Users,
  Briefcase,
  MessageSquareQuote,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Badge } from "./ui/badge";

interface SubscriptionInfo {
  isSubscribed: boolean;
  subscription: any;
  trialEnd: string | null;
  daysRemaining: number;
  isTrialing: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

function SidebarItem({
  icon,
  title,
  href,
  isActive,
  isExpanded,
  onClick,
  children,
}: SidebarItemProps) {
  return (
    <div>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md group transition-colors",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100",
        )}
        onClick={onClick}
      >
        <div className={cn("flex items-center justify-between w-full")}>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "text-gray-500 group-hover:text-gray-700",
                isActive && "text-blue-600",
              )}
            >
              {icon}
            </div>
            <span className="font-medium">{title}</span>
          </div>
          {children && (
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          )}
        </div>
      </Link>
      {children && isExpanded && (
        <div className="ml-9 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "agency-details": true,
  });
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isSubscribed: false,
    subscription: null,
    trialEnd: null,
    daysRemaining: 0,
    isTrialing: false
  });
  const supabase = createClient();

  useEffect(() => {
    // Get subscription info from window object (set by server component)
    if (typeof window !== 'undefined' && window.subscriptionInfo) {
      setSubscriptionInfo(window.subscriptionInfo);
    } else {
      // Fallback to checking subscription directly if window object not available
      const checkSubscription = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if user has an active subscription
            const { data: subscription } = await supabase
              .from('subscriptions')
              .select('*, subscription_items(*)')
              .eq('user_id', user.id)
              .eq('status', 'active')
              .single();
            
            if (subscription) {
              // Check if subscription is in trial period
              const isTrialing = subscription.trial_end ? new Date(subscription.trial_end) > new Date() : false;
              
              // Calculate days remaining in trial
              let daysRemaining = 0;
              if (isTrialing && subscription.trial_end) {
                const trialEnd = new Date(subscription.trial_end);
                const today = new Date();
                const diffTime = trialEnd.getTime() - today.getTime();
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              }
              
              setSubscriptionInfo({
                isSubscribed: true,
                subscription,
                trialEnd: subscription.trial_end,
                daysRemaining,
                isTrialing
              });
            }
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      };
      
      checkSubscription();
    }
  }, [supabase]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-64 border-r border-gray-200 h-screen bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1 rounded">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">PitchHub</span>
        </Link>
        {subscriptionInfo.isSubscribed && (
          <div className="mt-2 space-y-1">
            <Badge variant="premium" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>PitchHub Plus</span>
            </Badge>
            
            {subscriptionInfo.isTrialing && subscriptionInfo.daysRemaining > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3" />
                <span>{subscriptionInfo.daysRemaining} day{subscriptionInfo.daysRemaining !== 1 ? 's' : ''} left in trial</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4 px-3 space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          title="Dashboard"
          href="/dashboard"
          isActive={pathname === "/dashboard"}
        />

        <SidebarItem
          icon={<FileText size={18} />}
          title="Proposals"
          href="/dashboard/proposals"
          isActive={pathname.startsWith("/dashboard/proposals")}
        />

        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            DIRECTORIES
          </p>
        </div>

        <SidebarItem
          icon={<Briefcase size={18} />}
          title="Agency Details"
          href="/dashboard/agency-details"
          isActive={pathname.startsWith("/dashboard/agency-details")}
          isExpanded={expandedSections["agency-details"]}
          onClick={() => toggleSection("agency-details")}
        >
          <Link
            href="/dashboard/agency-details/profile"
            className={cn(
              "block py-1 px-2 rounded text-sm",
              pathname === "/dashboard/agency-details/profile"
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Profile
          </Link>
          <Link
            href="/dashboard/agency-details/branding"
            className={cn(
              "block py-1 px-2 rounded text-sm",
              pathname === "/dashboard/agency-details/branding"
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Branding
          </Link>
          <Link
            href="/dashboard/agency-details/assets"
            className={cn(
              "block py-1 px-2 rounded text-sm",
              pathname === "/dashboard/agency-details/assets"
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Assets
          </Link>
        </SidebarItem>

        <SidebarItem
          icon={<Award size={18} />}
          title="Credentials"
          href="/dashboard/credentials"
          isActive={pathname.startsWith("/dashboard/credentials")}
        />

        <SidebarItem
          icon={<FolderKanban size={18} />}
          title="Case Studies"
          href="/dashboard/case-studies"
          isActive={pathname.startsWith("/dashboard/case-studies")}
        />

        <SidebarItem
          icon={<Users size={18} />}
          title="Team"
          href="/dashboard/team"
          isActive={pathname.startsWith("/dashboard/team")}
        />

        <SidebarItem
          icon={<Briefcase size={18} />}
          title="Services"
          href="/dashboard/services"
          isActive={pathname.startsWith("/dashboard/services")}
        />

        <SidebarItem
          icon={<MessageSquareQuote size={18} />}
          title="Testimonials"
          href="/dashboard/testimonials"
          isActive={pathname.startsWith("/dashboard/testimonials")}
        />
      </div>

      <div className="p-4 border-t border-gray-200">
        <SidebarItem
          icon={<Settings size={18} />}
          title="Settings"
          href="/dashboard/settings"
          isActive={pathname.startsWith("/dashboard/settings")}
        />
      </div>
    </div>
  );
}
