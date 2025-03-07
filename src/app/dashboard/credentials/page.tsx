import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Edit,
  Trash,
  ExternalLink,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CredentialsPage() {
  // This would normally fetch real data from the database
  const credentials = [
    {
      id: 1,
      title: "Google Ads Certification",
      issuer: "Google",
      issueDate: "2023-05-15",
      expiryDate: "2024-05-15",
      image:
        "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      description:
        "Certified in creating and optimizing Google Ads campaigns across Search, Display, and Video networks.",
      credentialId: "GA-12345-XYZ",
      credentialUrl: "https://example.com/credential/ga-12345",
    },
    {
      id: 2,
      title: "Facebook Blueprint Certification",
      issuer: "Meta",
      issueDate: "2023-03-10",
      expiryDate: "2025-03-10",
      image:
        "https://api.dicebear.com/7.x/initials/svg?seed=FB&backgroundColor=1877F2&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      description:
        "Advanced certification in Facebook advertising, campaign management, and optimization strategies.",
      credentialId: "FB-67890-ABC",
      credentialUrl: "https://example.com/credential/fb-67890",
    },
    {
      id: 3,
      title: "HubSpot Inbound Marketing Certification",
      issuer: "HubSpot Academy",
      issueDate: "2023-01-20",
      expiryDate: "2024-01-20",
      image:
        "https://api.dicebear.com/7.x/initials/svg?seed=HS&backgroundColor=FF7A59&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      description:
        "Comprehensive certification in inbound marketing methodology, content creation, and lead generation.",
      credentialId: "HS-24680-DEF",
      credentialUrl: "https://example.com/credential/hs-24680",
    },
    {
      id: 4,
      title: "SEMrush SEO Fundamentals Certification",
      issuer: "SEMrush Academy",
      issueDate: "2022-11-05",
      expiryDate: "2023-11-05",
      image:
        "https://api.dicebear.com/7.x/initials/svg?seed=SR&backgroundColor=0CBF6F&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      description:
        "Certification in search engine optimization fundamentals, keyword research, and technical SEO.",
      credentialId: "SR-13579-GHI",
      credentialUrl: "https://example.com/credential/sr-13579",
    },
    {
      id: 5,
      title: "Hootsuite Social Marketing Certification",
      issuer: "Hootsuite Academy",
      issueDate: "2022-09-15",
      expiryDate: "2023-09-15",
      image:
        "https://api.dicebear.com/7.x/initials/svg?seed=HS&backgroundColor=143059&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      description:
        "Certification in social media marketing strategy, content planning, and analytics.",
      credentialId: "HS-97531-JKL",
      credentialUrl: "https://example.com/credential/hs-97531",
    },
    {
      id: 6,
      title: "Mailchimp Email Marketing Certification",
      issuer: "Mailchimp Academy",
      issueDate: "2022-07-20",
      expiryDate: "2023-07-20",
      image:
        "https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=FFE01B&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=000000",
      description:
        "Certification in email marketing strategy, campaign creation, and performance analysis.",
      credentialId: "MC-86420-MNO",
      credentialUrl: "https://example.com/credential/mc-86420",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's certifications and qualifications.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Credential</span>
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
                  placeholder="Search credentials..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={credential.image}
                      alt={credential.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {credential.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {credential.issuer}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Certificate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(credential.issueDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                      {" - "}
                      {new Date(credential.expiryDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 mb-3">
                    {credential.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      ID: {credential.credentialId}
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Add to Proposal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Add New Credential</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Showcase your agency's qualifications
                </p>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Credential
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credential Management</CardTitle>
          <CardDescription>
            Track expiration dates and renewal requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
              <div className="col-span-4">Credential</div>
              <div className="col-span-2">Issuer</div>
              <div className="col-span-2">Issue Date</div>
              <div className="col-span-2">Expiry Date</div>
              <div className="col-span-2">Status</div>
            </div>
            <div className="divide-y">
              {credentials.map((credential) => {
                const expiryDate = new Date(credential.expiryDate);
                const today = new Date();
                const daysUntilExpiry = Math.ceil(
                  (expiryDate.getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                let status = "";
                let statusClass = "";

                if (daysUntilExpiry < 0) {
                  status = "Expired";
                  statusClass = "bg-red-100 text-red-800";
                } else if (daysUntilExpiry < 30) {
                  status = "Expiring Soon";
                  statusClass = "bg-amber-100 text-amber-800";
                } else {
                  status = "Active";
                  statusClass = "bg-green-100 text-green-800";
                }

                return (
                  <div
                    key={credential.id}
                    className="grid grid-cols-12 p-3 items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden">
                        <img
                          src={credential.image}
                          alt={credential.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{credential.title}</p>
                      </div>
                    </div>
                    <div className="col-span-2">{credential.issuer}</div>
                    <div className="col-span-2">
                      {new Date(credential.issueDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>
                    <div className="col-span-2">
                      {new Date(credential.expiryDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusClass}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
