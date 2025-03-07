import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProposalsPage() {
  // This would normally fetch real data from the database
  const proposals = [
    {
      id: 1,
      title: "Digital Marketing Strategy",
      client: "Acme Corp",
      status: "Draft",
      date: "2023-10-15",
      views: 0,
    },
    {
      id: 2,
      title: "Website Redesign Proposal",
      client: "TechStart Inc",
      status: "Sent",
      date: "2023-10-12",
      views: 5,
    },
    {
      id: 3,
      title: "Social Media Campaign",
      client: "Fashion Brand",
      status: "Viewed",
      date: "2023-10-10",
      views: 3,
    },
    {
      id: 4,
      title: "SEO Optimization Plan",
      client: "Local Business",
      status: "Accepted",
      date: "2023-10-05",
      views: 8,
    },
    {
      id: 5,
      title: "Content Marketing Strategy",
      client: "Education Startup",
      status: "Rejected",
      date: "2023-10-01",
      views: 4,
    },
    {
      id: 6,
      title: "Brand Identity Refresh",
      client: "Retail Chain",
      status: "Draft",
      date: "2023-09-28",
      views: 0,
    },
    {
      id: 7,
      title: "Email Marketing Campaign",
      client: "E-commerce Shop",
      status: "Sent",
      date: "2023-09-25",
      views: 2,
    },
    {
      id: 8,
      title: "PPC Advertising Proposal",
      client: "Software Company",
      status: "Viewed",
      date: "2023-09-20",
      views: 6,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your client proposals.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Proposal</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search proposals..."
                  className="pl-8 h-9 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
              <div className="col-span-5">Proposal</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="grid grid-cols-12 items-center p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div
                      className={`rounded-md p-2 ${getStatusBgColor(proposal.status)}`}
                    >
                      <FileText className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium">{proposal.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="h-3 w-3 mr-1" />
                        {proposal.views} views
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm">{proposal.client}</div>
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {proposal.date}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(proposal.status)}`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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

function getStatusBgColor(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-gray-100";
    case "sent":
      return "bg-blue-100";
    case "viewed":
      return "bg-green-100";
    case "accepted":
      return "bg-emerald-100";
    case "rejected":
      return "bg-red-100";
    default:
      return "bg-gray-100";
  }
}
