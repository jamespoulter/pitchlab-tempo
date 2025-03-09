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
import { UserCircle, Home, Bell, Plus, Search, Sparkles, Clock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

interface SubscriptionInfo {
  isSubscribed: boolean;
  subscription: any;
  trialEnd: string | null;
  daysRemaining: number;
  isTrialing: boolean;
}

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isSubscribed: false,
    subscription: null,
    trialEnd: null,
    daysRemaining: 0,
    isTrialing: false
  });

  useEffect(() => {
    // Get subscription info from window object (set by server component)
    if (typeof window !== 'undefined') {
      // Add a small delay to ensure the script has executed
      const timer = setTimeout(() => {
        if (window.subscriptionInfo) {
          console.log("Found subscription info in window:", window.subscriptionInfo);
          setSubscriptionInfo(window.subscriptionInfo);
        } else {
          console.log("No subscription info found in window, fetching directly");
          getUser();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      getUser();
    }
  }, [supabase]);
  
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    // Check if the user is an admin
    const ADMIN_UUID = "1a737665-e3bd-47f7-8cd2-c5d2937a9689";
    setIsAdmin(user ? user.id === ADMIN_UUID : false);
    
    // Only fetch subscription info if not already set from window object
    if (!window.subscriptionInfo && user) {
      try {
        // Check if user has an active subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        
        if (subscription) {
          // Check if subscription is in trial period
          const isTrialing = subscription.trial_end ? new Date(subscription.trial_end * 1000) > new Date() : false;
          
          // Calculate days remaining in trial
          let daysRemaining = 0;
          if (isTrialing && subscription.trial_end) {
            const trialEnd = new Date(subscription.trial_end * 1000);
            const today = new Date();
            const diffTime = trialEnd.getTime() - today.getTime();
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          
          const newSubscriptionInfo = {
            isSubscribed: true,
            subscription,
            trialEnd: subscription.trial_end,
            daysRemaining,
            isTrialing
          };
          
          console.log("Setting subscription info from fetch:", newSubscriptionInfo);
          setSubscriptionInfo(newSubscriptionInfo);
        } else {
          // If no active subscription, check for trialing subscriptions
          const { data: trialingSubscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'trialing')
            .single();
            
          if (trialingSubscription) {
            // Calculate days remaining in trial
            let daysRemaining = 0;
            if (trialingSubscription.trial_end) {
              const trialEnd = new Date(trialingSubscription.trial_end * 1000);
              const today = new Date();
              const diffTime = trialEnd.getTime() - today.getTime();
              daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            const newSubscriptionInfo = {
              isSubscribed: true,
              subscription: trialingSubscription,
              trialEnd: trialingSubscription.trial_end,
              daysRemaining,
              isTrialing: true
            };
            
            console.log("Setting trialing subscription info from fetch:", newSubscriptionInfo);
            setSubscriptionInfo(newSubscriptionInfo);
          } else {
            console.log("No active or trialing subscription found");
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    }
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-3">
      <div className="px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              asChild
            >
              <Link href="/admin">
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </Button>
          )}
          
          {subscriptionInfo.isSubscribed && (
            <div className="flex items-center gap-2">
              <Badge 
                variant="premium" 
                className={`flex items-center gap-1 ${
                  subscriptionInfo.isTrialing 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>
                  {subscriptionInfo.isTrialing ? "Free Trial" : "PitchHub Plus"}
                </span>
              </Badge>
              
              {subscriptionInfo.isTrialing && subscriptionInfo.daysRemaining > 0 && (
                <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span>{subscriptionInfo.daysRemaining} day{subscriptionInfo.daysRemaining !== 1 ? 's' : ''} left</span>
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>New Proposal</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
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
              {isAdmin && (
                <DropdownMenuItem>
                  <Link href="/admin" className="w-full flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {subscriptionInfo.isSubscribed ? (
                <DropdownMenuItem className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <div className="flex flex-col">
                    <span>{subscriptionInfo.isTrialing ? "Free Trial Active" : "PitchHub Plus Active"}</span>
                    {subscriptionInfo.isTrialing && subscriptionInfo.daysRemaining > 0 && (
                      <span className="text-xs text-blue-600 font-medium">
                        {subscriptionInfo.daysRemaining} day{subscriptionInfo.daysRemaining !== 1 ? 's' : ''} left in trial
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Link href="/#pricing" className="w-full flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gray-500" />
                    <span>Upgrade to PitchHub Plus</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="w-full">
                  Settings
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
