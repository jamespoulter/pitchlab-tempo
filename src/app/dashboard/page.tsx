import { createClient } from "../../../supabase/server";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  FileText,
  FolderKanban,
  Users,
  Award,
  Briefcase,
  MessageSquareQuote,
  ArrowUpRight,
  Clock,
  BarChart4,
  Palette,
  Star,
  Image as ImageIcon,
  ExternalLink,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import StripeRedirectHandler from "@/components/stripe-redirect-handler";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch data directly from Supabase using the server client
  const { data: caseStudies = [] } = await supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const { data: teamMembers = [] } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const { data: brandAssets = [] } = await supabase
    .from("agency_assets")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const { data: branding } = await supabase
    .from("agency_branding")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  const { data: services = [] } = await supabase
    .from("services")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const { data: testimonials = [] } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  // Get recent case studies (last 3)
  const recentCaseStudies = caseStudies.slice(0, 3);

  // Get recent brand assets (last 3)
  const recentBrandAssets = brandAssets.slice(0, 3);

  // Get most frequently used team members (for now, just take the first 3)
  const frequentTeamMembers = teamMembers.slice(0, 3);

  // Check if we have any logo variations
  const hasLogos = branding && (branding.logo_url || branding.logo_dark_url || branding.icon_url);

  // This would normally fetch real data from the database
  const recentProposals = [
    {
      id: 1,
      title: "Digital Marketing Strategy",
      client: "Acme Corp",
      status: "Draft",
      date: "2023-10-15",
    },
    {
      id: 2,
      title: "Website Redesign Proposal",
      client: "TechStart Inc",
      status: "Sent",
      date: "2023-10-12",
    },
    {
      id: 3,
      title: "Social Media Campaign",
      client: "Fashion Brand",
      status: "Viewed",
      date: "2023-10-10",
    },
  ];

  // Calculate directory stats from real data
  const directoryStats = [
    {
      title: "Case Studies",
      count: caseStudies.length,
      icon: <FolderKanban className="h-5 w-5" />,
      href: "/dashboard/case-studies",
    },
    {
      title: "Team Members",
      count: teamMembers.length,
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/team",
    },
    {
      title: "Services",
      count: services.length,
      icon: <Briefcase className="h-5 w-5" />,
      href: "/dashboard/services",
    },
    {
      title: "Testimonials",
      count: testimonials.length,
      icon: <MessageSquareQuote className="h-5 w-5" />,
      href: "/dashboard/testimonials",
    },
    {
      title: "Brand Assets",
      count: brandAssets.length,
      icon: <ImageIcon className="h-5 w-5" />,
      href: "/dashboard/agency-details/assets",
    },
  ];

  return (
    <SubscriptionCheck>
      <StripeRedirectHandler />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/proposals/new">
              <Button>Create New Proposal</Button>
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Proposals
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentProposals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Case Studies
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caseStudies.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {caseStudies.length > 0
                  ? `Latest: ${new Date(
                      caseStudies[0].created_at
                    ).toLocaleDateString()}`
                  : "No case studies yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {teamMembers.length > 0 ? "Team members added" : "Add your team"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Brand Assets
              </CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandAssets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {brandAssets.length > 0 ? "Assets available" : "Add your first asset"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Case Studies & Brand Assets */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Case Studies */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Case Studies</CardTitle>
                <Link
                  href="/dashboard/case-studies"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription>
                Your recently added case studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCaseStudies.length === 0 ? (
                <div className="text-center py-6">
                  <FolderKanban className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">No case studies yet</p>
                  <Link href="/dashboard/case-studies">
                    <Button variant="outline" size="sm">Add Case Study</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCaseStudies.map((caseStudy) => (
                    <div
                      key={caseStudy.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {caseStudy.image_url ? (
                            <img 
                              src={caseStudy.image_url || "https://via.placeholder.com/100?text=Case+Study"} 
                              alt={caseStudy.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FolderKanban className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{caseStudy.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {caseStudy.client}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/case-studies/${caseStudy.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link href="/dashboard/case-studies" className="w-full">
                <Button variant="outline" className="w-full">Manage Case Studies</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Recent Brand Assets */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Brand Assets</CardTitle>
                <Link
                  href="/dashboard/agency-details/assets"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription>
                Your recently added brand assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentBrandAssets.length === 0 ? (
                <div className="text-center py-6">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">No brand assets yet</p>
                  <Link href="/dashboard/agency-details/assets">
                    <Button variant="outline" size="sm">Add Brand Asset</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBrandAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {asset.file_url ? (
                            <img 
                              src={asset.file_url || "https://via.placeholder.com/100?text=Asset"} 
                              alt={asset.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {asset.type}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/agency-details/assets/${asset.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link href="/dashboard/agency-details/assets" className="w-full">
                <Button variant="outline" className="w-full">Manage Brand Assets</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Team Members & Brand Logos */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Team Members */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Link
                  href="/dashboard/team"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription>
                Your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {frequentTeamMembers.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">No team members yet</p>
                  <Link href="/dashboard/team">
                    <Button variant="outline" size="sm">Add Team Member</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {frequentTeamMembers.map((member) => (
                    <Link 
                      key={member.id} 
                      href={`/dashboard/team/${member.id}`}
                      className="flex flex-col items-center text-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                        {member.avatar ? (
                          <img 
                            src={member.avatar || "https://via.placeholder.com/100?text=Team"} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link href="/dashboard/team" className="w-full">
                <Button variant="outline" className="w-full">Manage Team</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Brand Logos */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Brand Logos</CardTitle>
                <Link
                  href="/dashboard/agency-details/branding"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  Manage <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription>
                Quick access to your brand logos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!branding || !hasLogos ? (
                <div className="text-center py-6">
                  <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">No brand logos yet</p>
                  <Link href="/dashboard/agency-details/branding">
                    <Button variant="outline" size="sm">Add Brand Logos</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {branding.logo_url && (
                    <div className="flex flex-col items-center border rounded-lg p-3">
                      <div className="h-16 flex items-center justify-center mb-2">
                        <img 
                          src={branding.logo_url || "https://via.placeholder.com/100?text=Logo"} 
                          alt="Primary Logo" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-center">Primary Logo</p>
                    </div>
                  )}
                  {branding.logo_dark_url && (
                    <div className="flex flex-col items-center border rounded-lg p-3 bg-gray-800">
                      <div className="h-16 flex items-center justify-center mb-2">
                        <img 
                          src={branding.logo_dark_url || "https://via.placeholder.com/100?text=Logo"} 
                          alt="Dark Logo" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-center text-white">Dark Logo</p>
                    </div>
                  )}
                  {branding.icon_url && (
                    <div className="flex flex-col items-center border rounded-lg p-3">
                      <div className="h-16 flex items-center justify-center mb-2">
                        <img 
                          src={branding.icon_url || "https://via.placeholder.com/100?text=Icon"} 
                          alt="Icon" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-center">Icon</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link href="/dashboard/agency-details/branding" className="w-full">
                <Button variant="outline" className="w-full">Manage Brand Identity</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Directory Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Directory</CardTitle>
            <CardDescription>
              Quick access to all your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {directoryStats.map((stat, index) => (
                <Link
                  key={index}
                  href={stat.href}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    {stat.icon}
                  </div>
                  <h3 className="font-medium text-center">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-1">{stat.count}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SubscriptionCheck>
  );
}
