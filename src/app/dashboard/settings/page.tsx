import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "lucide-react";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a bit about yourself..."
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
                    <Button variant="outline" size="sm">
                      Change Image
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
              <CardDescription>
                Update your agency's information and branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency-name">Agency Name</Label>
                    <Input
                      id="agency-name"
                      defaultValue="Creative Solutions Agency"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency-website">Website</Label>
                    <Input
                      id="agency-website"
                      defaultValue="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency-email">Contact Email</Label>
                    <Input
                      id="agency-email"
                      type="email"
                      defaultValue="info@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency-phone">Contact Phone</Label>
                    <Input id="agency-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency-address">Address</Label>
                  <Input
                    id="agency-address"
                    defaultValue="123 Marketing Street, San Francisco, CA 94103"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        $49/month, billed monthly
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next billing date</span>
                      <span>November 15, 2023</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment method</span>
                      <span>Visa ending in 4242</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      Update Payment Method
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Available Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold">Basic</h4>
                      <p className="text-2xl font-bold mt-2 mb-1">
                        $29
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        For small agencies
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Up to 5 team members</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>20 proposals per month</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Basic analytics</span>
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full">
                        Downgrade
                      </Button>
                    </div>
                    <div className="border-2 border-blue-500 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Pro</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Current
                        </span>
                      </div>
                      <p className="text-2xl font-bold mt-2 mb-1">
                        $49
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        For growing agencies
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Up to 15 team members</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Unlimited proposals</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Custom branding</span>
                        </li>
                      </ul>
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold">Enterprise</h4>
                      <p className="text-2xl font-bold mt-2 mb-1">
                        $99
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        For large agencies
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Unlimited team members</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Unlimited proposals</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Custom branding</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                      <Button className="w-full">Upgrade</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing History</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 border-b bg-muted/50 p-3 text-sm font-medium">
                      <div className="col-span-2">Date</div>
                      <div className="col-span-1">Amount</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Invoice</div>
                    </div>
                    <div className="divide-y">
                      {[
                        {
                          date: "Oct 15, 2023",
                          amount: "$49.00",
                          status: "Paid",
                        },
                        {
                          date: "Sep 15, 2023",
                          amount: "$49.00",
                          status: "Paid",
                        },
                        {
                          date: "Aug 15, 2023",
                          amount: "$49.00",
                          status: "Paid",
                        },
                      ].map((invoice, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-5 p-3 text-sm"
                        >
                          <div className="col-span-2">{invoice.date}</div>
                          <div className="col-span-1">{invoice.amount}</div>
                          <div className="col-span-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {invoice.status}
                            </span>
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 p-0 text-blue-600 hover:text-blue-800"
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: "proposal-viewed",
                        label: "When a proposal is viewed by a client",
                      },
                      {
                        id: "proposal-accepted",
                        label: "When a proposal is accepted",
                      },
                      {
                        id: "proposal-rejected",
                        label: "When a proposal is rejected",
                      },
                      {
                        id: "comment-added",
                        label: "When a comment is added to a proposal",
                      },
                      {
                        id: "team-changes",
                        label: "When team members are added or removed",
                      },
                    ].map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between"
                      >
                        <Label htmlFor={notification.id} className="text-sm">
                          {notification.label}
                        </Label>
                        <input
                          type="checkbox"
                          id={notification.id}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Notifications</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: "system-updates",
                        label: "Product updates and announcements",
                      },
                      {
                        id: "maintenance",
                        label: "Scheduled maintenance notifications",
                      },
                      { id: "tips", label: "Tips and best practices" },
                      {
                        id: "marketing",
                        label: "Marketing and promotional emails",
                      },
                    ].map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between"
                      >
                        <Label htmlFor={notification.id} className="text-sm">
                          {notification.label}
                        </Label>
                        <input
                          type="checkbox"
                          id={notification.id}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked={notification.id !== "marketing"}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Delivery</h3>
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">
                      Email Digest Frequency
                    </Label>
                    <select
                      id="notification-frequency"
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    >
                      <option value="immediate">Send immediately</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly digest</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Two-factor authentication is disabled
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Enable
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <h3 className="text-lg font-medium">Sessions</h3>
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-1">Device</div>
                    <div className="col-span-1">Location</div>
                    <div className="col-span-1">Last Active</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        device: "Chrome on Windows",
                        location: "San Francisco, CA",
                        lastActive: "Now (Current session)",
                      },
                      {
                        device: "Safari on iPhone",
                        location: "San Francisco, CA",
                        lastActive: "Yesterday at 2:43 PM",
                      },
                      {
                        device: "Firefox on Mac",
                        location: "New York, NY",
                        lastActive: "Oct 15, 2023 at 10:31 AM",
                      },
                    ].map((session, index) => (
                      <div key={index} className="grid grid-cols-3 p-3 text-sm">
                        <div className="col-span-1">{session.device}</div>
                        <div className="col-span-1">{session.location}</div>
                        <div className="col-span-1 flex items-center justify-between">
                          <span>{session.lastActive}</span>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 p-0 text-red-500 hover:text-red-600"
                            >
                              Logout
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout of All Sessions
                </Button>
              </div>

              <div className="pt-6 border-t space-y-4">
                <h3 className="text-lg font-medium">Account Deletion</h3>
                <div className="bg-red-50 border border-red-100 rounded-md p-4">
                  <p className="text-sm text-red-800 mb-4">
                    Permanently delete your account and all of your content.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-600 hover:bg-red-100 border-red-200"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team and their permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  5 of 15 team members (Pro Plan)
                </p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      name: "John Doe",
                      email: "john@example.com",
                      role: "Admin",
                      status: "Active",
                    },
                    {
                      name: "Jane Smith",
                      email: "jane@example.com",
                      role: "Editor",
                      status: "Active",
                    },
                    {
                      name: "Bob Johnson",
                      email: "bob@example.com",
                      role: "Viewer",
                      status: "Active",
                    },
                    {
                      name: "Alice Williams",
                      email: "alice@example.com",
                      role: "Editor",
                      status: "Invited",
                    },
                    {
                      name: "Charlie Brown",
                      email: "charlie@example.com",
                      role: "Viewer",
                      status: "Invited",
                    },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 p-3 text-sm items-center"
                    >
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{member.name}</span>
                      </div>
                      <div className="col-span-3">{member.email}</div>
                      <div className="col-span-2">
                        <select
                          className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors"
                          defaultValue={member.role.toLowerCase()}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${member.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        {member.status === "Invited" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            Resend
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pending Invitations</h3>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-4">Email</div>
                    <div className="col-span-3">Role</div>
                    <div className="col-span-3">Invited On</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        email: "david@example.com",
                        role: "Editor",
                        invitedOn: "Oct 15, 2023",
                      },
                      {
                        email: "sarah@example.com",
                        role: "Viewer",
                        invitedOn: "Oct 14, 2023",
                      },
                    ].map((invitation, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 p-3 text-sm items-center"
                      >
                        <div className="col-span-4">{invitation.email}</div>
                        <div className="col-span-3">{invitation.role}</div>
                        <div className="col-span-3">{invitation.invitedOn}</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            Resend
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-red-500 hover:text-red-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Permissions</CardTitle>
              <CardDescription>
                Configure what team members can do based on their role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-1">Permission</div>
                    <div className="col-span-1 text-center">Admin</div>
                    <div className="col-span-1 text-center">Editor</div>
                    <div className="col-span-1 text-center">Viewer</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        permission: "View proposals",
                        admin: true,
                        editor: true,
                        viewer: true,
                      },
                      {
                        permission: "Create proposals",
                        admin: true,
                        editor: true,
                        viewer: false,
                      },
                      {
                        permission: "Edit proposals",
                        admin: true,
                        editor: true,
                        viewer: false,
                      },
                      {
                        permission: "Delete proposals",
                        admin: true,
                        editor: false,
                        viewer: false,
                      },
                      {
                        permission: "Manage team members",
                        admin: true,
                        editor: false,
                        viewer: false,
                      },
                      {
                        permission: "Manage billing",
                        admin: true,
                        editor: false,
                        viewer: false,
                      },
                      {
                        permission: "Access agency settings",
                        admin: true,
                        editor: false,
                        viewer: false,
                      },
                    ].map((perm, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 p-3 text-sm items-center"
                      >
                        <div className="col-span-1">{perm.permission}</div>
                        <div className="col-span-1 text-center">
                          {perm.admin ? (
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            "-"
                          )}
                        </div>
                        <div className="col-span-1 text-center">
                          {perm.editor ? (
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            "-"
                          )}
                        </div>
                        <div className="col-span-1 text-center">
                          {perm.viewer ? (
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            "-"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Permissions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
