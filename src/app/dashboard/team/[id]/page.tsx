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
  Mail,
  Phone,
  Briefcase,
  Award,
  Calendar,
  FileText,
  Edit,
} from "lucide-react";
import Link from "next/link";

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  // This would normally fetch real data from the database based on the ID
  const teamMember = {
    id: params.id,
    name: "Sarah Johnson",
    role: "Creative Director",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Over 10 years of experience in brand strategy and creative direction for Fortune 500 companies. Sarah leads our creative team with a focus on innovative design solutions that drive business results. Her background in both traditional and digital media allows her to create cohesive brand experiences across all touchpoints.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    skills: [
      "Brand Strategy",
      "Creative Direction",
      "Team Leadership",
      "Visual Design",
      "Client Presentations",
      "Project Management",
    ],
    education: [
      {
        degree: "MFA in Graphic Design",
        institution: "Rhode Island School of Design",
        year: "2010",
      },
      {
        degree: "BFA in Visual Communication",
        institution: "Parsons School of Design",
        year: "2008",
      },
    ],
    experience: [
      {
        position: "Creative Director",
        company: "Current Agency",
        duration: "2018 - Present",
      },
      {
        position: "Senior Art Director",
        company: "Previous Agency",
        duration: "2014 - 2018",
      },
      {
        position: "Art Director",
        company: "First Agency",
        duration: "2010 - 2014",
      },
    ],
    projects: [
      "Brand Refresh for Major Retailer",
      "Website Redesign for Tech Startup",
      "Integrated Campaign for Financial Services",
      "Product Launch for Consumer Electronics",
    ],
    certifications: [
      "Adobe Certified Expert",
      "Google UX Design Professional Certificate",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/team">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Team</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <img
                    src={teamMember.avatar}
                    alt={teamMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{teamMember.name}</h2>
                <p className="text-blue-600 font-medium mb-4">
                  {teamMember.role}
                </p>
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {teamMember.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="w-full space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{teamMember.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{teamMember.phone}</span>
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
              <CardTitle className="text-lg">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {teamMember.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMember.certifications.map((cert, index) => (
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Professional Bio</CardTitle>
                <CardDescription>Background and expertise</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{teamMember.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMember.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-200 pl-4 pb-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold">{exp.position}</h3>
                    </div>
                    <p className="text-sm">{exp.company}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMember.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-200 pl-4 pb-4"
                  >
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm">{edu.institution}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notable Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teamMember.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
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
