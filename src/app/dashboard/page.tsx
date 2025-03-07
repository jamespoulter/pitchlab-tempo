import { createClient } from "../../../supabase/server";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const directoryStats = [
    {
      title: "Agency Details",
      count: 1,
      icon: <Briefcase className="h-5 w-5" />,
      href: "/dashboard/agency-details",
    },
    {
      title: "Credentials",
      count: 4,
      icon: <Award className="h-5 w-5" />,
      href: "/dashboard/credentials",
    },
    {
      title: "Case Studies",
      count: 8,
      icon: <FolderKanban className="h-5 w-5" />,
      href: "/dashboard/case-studies",
    },
    {
      title: "Team Members",
      count: 6,
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/team",
    },
    {
      title: "Services",
      count: 12,
      icon: <Briefcase className="h-5 w-5" />,
      href: "/dashboard/services",
    },
    {
      title: "Testimonials",
      count: 15,
      icon: <MessageSquareQuote className="h-5 w-5" />,
      href: "/dashboard/testimonials",
    },
  ];

  return (
    <SubscriptionCheck>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.user_metadata?.full_name || "User"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your agency's proposal assets.
            </p>
          </div>
          <Link
            href="/dashboard/proposals/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
          >
            <FileText className="h-4 w-4" />
            <span>Create New Proposal</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Proposals
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Proposal Views
              </CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground mt-1">
                +28% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Directory Assets
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">46</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Proposals & Directory Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Proposals */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Proposals</CardTitle>
                <Link
                  href="/dashboard/proposals"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription>
                Your recently created and updated proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-md bg-gray-100 p-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{proposal.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {proposal.client}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(proposal.status)}`}
                      >
                        {proposal.status}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {proposal.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Directory Stats */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Directory Assets</CardTitle>
              </div>
              <CardDescription>
                Overview of your content directories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {directoryStats.map((stat, index) => (
                  <Link
                    href={stat.href}
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="rounded-md bg-blue-50 p-2 text-blue-600">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="font-medium">{stat.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.count} items
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SubscriptionCheck>
  );
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "viewed":
      return "bg-green-100 text-green-800";
    case "accepted":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
