import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Edit,
  Trash,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeamPage() {
  // This would normally fetch real data from the database
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Creative Director",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      bio: "Over 10 years of experience in brand strategy and creative direction for Fortune 500 companies.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      skills: ["Brand Strategy", "Creative Direction", "Team Leadership"],
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Lead Developer",
      email: "michael@example.com",
      phone: "+1 (555) 234-5678",
      bio: "Full-stack developer with expertise in React, Node.js, and cloud architecture.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      skills: ["React", "Node.js", "AWS", "Database Design"],
    },
    {
      id: 3,
      name: "Jessica Rivera",
      role: "Marketing Strategist",
      email: "jessica@example.com",
      phone: "+1 (555) 345-6789",
      bio: "Digital marketing expert specializing in data-driven campaign optimization and growth strategies.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      skills: ["SEO", "Content Strategy", "Analytics", "PPC"],
    },
    {
      id: 4,
      name: "David Kim",
      role: "UX/UI Designer",
      email: "david@example.com",
      phone: "+1 (555) 456-7890",
      bio: "Award-winning designer focused on creating intuitive and engaging user experiences.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      skills: ["UI Design", "User Research", "Prototyping", "Figma"],
    },
    {
      id: 5,
      name: "Emily Wilson",
      role: "Content Strategist",
      email: "emily@example.com",
      phone: "+1 (555) 567-8901",
      bio: "Experienced content creator with a background in journalism and brand storytelling.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      skills: ["Content Creation", "Copywriting", "Editorial Planning"],
    },
    {
      id: 6,
      name: "James Thompson",
      role: "Account Manager",
      email: "james@example.com",
      phone: "+1 (555) 678-9012",
      bio: "Client relationship specialist with a track record of growing accounts and delivering exceptional service.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      skills: [
        "Client Relations",
        "Project Management",
        "Business Development",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's team and showcase their expertise.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Team Member</span>
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
                  placeholder="Search team members..."
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
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="role">By Role</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t p-3 flex justify-between items-center bg-gray-50">
                  <Button variant="outline" size="sm">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    Add to Proposal
                  </Button>
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            <div className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Add New Team Member</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Showcase your agency's talent
                </p>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Team Member
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Organization</CardTitle>
          <CardDescription>
            Organize your team by departments and roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                name: "Creative",
                members: teamMembers.filter((m) =>
                  ["Creative Director", "UX/UI Designer"].includes(m.role),
                ),
              },
              {
                name: "Development",
                members: teamMembers.filter((m) =>
                  ["Lead Developer"].includes(m.role),
                ),
              },
              {
                name: "Marketing",
                members: teamMembers.filter((m) =>
                  ["Marketing Strategist", "Content Strategist"].includes(
                    m.role,
                  ),
                ),
              },
              {
                name: "Account Management",
                members: teamMembers.filter((m) =>
                  ["Account Manager"].includes(m.role),
                ),
              },
            ].map((department, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div className="bg-muted/50 p-3 font-medium border-b">
                  {department.name} Department
                </div>
                <div className="divide-y">
                  {department.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit Role
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Add New Department
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
