"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTeamMemberModal } from "@/components/modals/add-team-member-modal";
import { useRouter } from "next/navigation";
import { getTeamMembers, deleteTeamMember, createTeamMember } from "@/utils/supabase-client";
import { TeamMember } from "@/types/agency";
import { toast } from "sonner";

export default function TeamPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("a-z");
  const router = useRouter();

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTeamMember = (id: string) => {
    router.push(`/dashboard/team/${id}`);
  };

  const handleEditTeamMember = (id: string) => {
    router.push(`/dashboard/team/${id}?edit=true`);
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        const { success, error } = await deleteTeamMember(id);
        if (success) {
          toast.success("Team member deleted successfully");
          // Refresh the team members list
          fetchTeamMembers();
        } else {
          toast.error("Failed to delete team member");
          console.error("Error deleting team member:", error);
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error("Error deleting team member:", error);
      }
    }
  };

  const handleSaveTeamMember = async (teamMemberData: any) => {
    try {
      const { success, data, error } = await createTeamMember(teamMemberData);
      if (success && data) {
        toast.success("Team member added successfully");
        // Refresh the team members list
        fetchTeamMembers();
      } else {
        toast.error("Failed to add team member");
        console.error("Error adding team member:", error);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error adding team member:", error);
    }
  };

  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  // Sort team members based on sort order
  const sortedTeamMembers = [...filteredTeamMembers].sort((a, b) => {
    if (sortOrder === "a-z") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "z-a") {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === "role") {
      return a.role.localeCompare(b.role);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's team and showcase their expertise.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="role">By Role</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedTeamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div 
                      className="w-24 h-24 rounded-full overflow-hidden mb-4 cursor-pointer"
                      onClick={() => handleViewTeamMember(member.id!)}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 
                      className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                      onClick={() => handleViewTeamMember(member.id!)}
                    >
                      {member.name}
                    </h3>
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTeamMember(member.id!)}
                    >
                      <Users className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTeamMember(member.id!)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewTeamMember(member.id!)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTeamMember(member.id!)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              <div 
                className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full cursor-pointer hover:bg-gray-50"
                onClick={() => setIsAddModalOpen(true)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Add New Team Member</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showcase your agency's talent
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Member
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add your first team member to showcase your agency's talent and expertise.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddTeamMemberModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveTeamMember}
      />
    </div>
  );
}
