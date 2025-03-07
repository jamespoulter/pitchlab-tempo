import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Building,
  FileText,
  Edit,
  Download,
  ExternalLink,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function CredentialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // This would normally fetch real data from the database based on the ID
  const credential = {
    id: params.id,
    title: "Google Ads Certification",
    issuer: "Google",
    issueDate: "2023-05-15",
    expiryDate: "2024-05-15",
    description:
      "This certification demonstrates proficiency in Google Ads, including search, display, video, shopping campaigns, and measurement solutions. It validates expertise in creating, managing, measuring, and optimizing ads across Google's advertising platforms.",
    credentialId: "GA-12345-XYZ",
    credentialUrl: "https://skillshop.exceedlms.com/student/award/12345",
    image:
      "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
    skills: [
      "Search Campaign Management",
      "Display Advertising",
      "Video Advertising",
      "Shopping Campaigns",
      "Performance Measurement",
      "Conversion Tracking",
    ],
    teamMembers: [
      { name: "Sarah Johnson", role: "Digital Marketing Director" },
      { name: "Michael Chen", role: "PPC Specialist" },
      { name: "Jessica Rivera", role: "Marketing Strategist" },
    ],
    relatedCredentials: [
      "Google Analytics Certification",
      "Facebook Blueprint Certification",
      "HubSpot Inbound Marketing Certification",
    ],
    projects: [
      "E-commerce PPC Campaign for RetailCo",
      "Lead Generation Campaign for B2B SaaS",
      "Brand Awareness Campaign for StartupX",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/credentials">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Credentials</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            <span>Add to Proposal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-lg overflow-hidden mb-4 bg-blue-600 flex items-center justify-center">
                  <img
                    src={credential.image}
                    alt={credential.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{credential.title}</h2>
                <p className="text-blue-600 font-medium mb-4">
                  {credential.issuer}
                </p>
                <div className="w-full space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Issued:</span>
                    <span>
                      {new Date(credential.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Expires:</span>
                    <span>
                      {new Date(credential.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 w-full">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Add to Proposal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credential Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Credential ID:</span>
                  <span>{credential.credentialId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Verification URL:</span>
                  <a
                    href={credential.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    View Credential
                  </a>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify Online
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {credential.relatedCredentials.map((cert, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Certification</CardTitle>
              <CardDescription>Description and key information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line mb-6">
                {credential.description}
              </p>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Skills Validated</h3>
                <div className="flex flex-wrap gap-2">
                  {credential.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certified Team Members</CardTitle>
              <CardDescription>
                Team members who hold this certification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {credential.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects Using This Expertise</CardTitle>
              <CardDescription>
                Client projects where this certification was applied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {credential.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{project}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
