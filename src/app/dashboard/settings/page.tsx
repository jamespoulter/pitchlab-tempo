import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  CreditCard,
  Bell,
  Lock,
  Palette,
  Users,
  Save,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Shield,
  Key,
  LogOut,
  UserPlus,
  Trash,
  Check,
  Sparkles,
  Clock,
  AlertCircle,
} from "lucide-react";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { updateProfileAction, updatePasswordAction, deleteAccountAction, signOutAction } from "@/app/actions";
import { checkUserSubscription } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ManageBillingButton, UpgradeButton, CancelSubscriptionButton } from "@/components/subscription-actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { message?: string; type?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get subscription information
  const subscriptionInfo = await checkUserSubscription(user.id);
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get user profile data from the users table
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Message from form submission
  const message = searchParams.message;
  const type = searchParams.type;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and subscription.
        </p>
      </div>

      {message && (
        <Alert variant={type === "error" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings.
              </CardDescription>
            </CardHeader>
            <form action={updateProfileAction}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={user?.user_metadata?.full_name || ""}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email || ""}
                        placeholder="john@example.com"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us a bit about yourself..."
                      defaultValue={user?.user_metadata?.bio || ""}
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-image">Profile Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {user?.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        Change Image
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Profile image upload is not yet available.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <SubmitButton>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </SubmitButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Manage your PitchHub Plus subscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">
                        {subscriptionInfo.isSubscribed ? "PitchHub Plus" : "Free Plan"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {subscriptionInfo.isSubscribed ? "£45/month" : "Limited features"}
                      </p>
                    </div>
                    <Badge 
                      variant={subscriptionInfo.isSubscribed ? "premium" : "outline"}
                      className={subscriptionInfo.isSubscribed ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
                    >
                      {subscriptionInfo.isSubscribed ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  {subscriptionInfo.isSubscribed && (
                    <div className="space-y-2">
                      {subscriptionInfo.isTrialing && (
                        <div className="flex items-center gap-2 mb-3 bg-blue-50 p-2 rounded-md">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            Trial period: {subscriptionInfo.daysRemaining} day{subscriptionInfo.daysRemaining !== 1 ? 's' : ''} remaining
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span>Subscription ID</span>
                        <span className="font-mono text-xs">
                          {subscriptionInfo.subscription?.id?.substring(0, 14)}...
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Started on</span>
                        <span>
                          {formatDate(subscriptionInfo.subscription?.created_at)}
                        </span>
                      </div>
                      
                      {subscriptionInfo.isTrialing ? (
                        <div className="flex justify-between text-sm">
                          <span>Trial ends on</span>
                          <span>{formatDate(subscriptionInfo.trialEnd)}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span>Next billing date</span>
                          <span>
                            {formatDate(subscriptionInfo.subscription?.current_period_end)}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-2">
                        <ManageBillingButton />
                        <CancelSubscriptionButton />
                      </div>
                    </div>
                  )}
                  
                  {!subscriptionInfo.isSubscribed && (
                    <div className="mt-4">
                      <UpgradeButton />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">PitchHub Plus Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Unlimited Pitches</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>AI-Powered Content</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Custom Branding</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Team Collaboration</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Priority Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Manage your password and security settings.
              </CardDescription>
            </CardHeader>
            <form action={updatePasswordAction}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input id="current_password" name="current_password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input id="new_password" name="new_password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm_password" name="confirm_password" type="password" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton>
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </SubmitButton>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and sign out from other devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-3 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-1">Device</div>
                  <div className="col-span-1">Last Active</div>
                  <div className="col-span-1">Action</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-3 p-3 text-sm">
                    <div className="col-span-1">Current Session</div>
                    <div className="col-span-1">Now</div>
                    <div className="col-span-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out of All Sessions
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <form action={deleteAccountAction}>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-100 rounded-md p-4">
                  <p className="text-sm text-red-800 mb-4">
                    This action is irreversible. All your data, including proposals, 
                    settings, and subscription information will be permanently deleted.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation" className="text-red-800">
                      Type DELETE to confirm
                    </Label>
                    <Input
                      id="confirmation"
                      name="confirmation"
                      placeholder="DELETE"
                      className="border-red-200"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Account
                </SubmitButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Team management features will be available soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Coming Soon</AlertTitle>
                <AlertDescription>
                  Team management features are currently in development and will be available soon.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
