"use client";

import { useState, useEffect } from "react";
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
  Save,
  X,
  Plus,
  Upload,
  Camera,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTeamMemberById, updateTeamMember, uploadTeamMemberAvatar } from "@/utils/supabase-client";
import { TeamMember } from "@/types/agency";
import { toast } from "sonner";

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for the team member data
  const [teamMember, setTeamMember] = useState<TeamMember>({
    id: params.id,
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
  });
  
  // State for new skill input
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newProject, setNewProject] = useState("");
  
  // State for new education and experience entries
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  
  const [newExperience, setNewExperience] = useState({
    position: "",
    company: "",
    duration: "",
  });
  
  // Add state for file upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch team member data on component mount
  useEffect(() => {
    fetchTeamMember();
  }, [params.id]);

  const fetchTeamMember = async () => {
    setIsLoading(true);
    try {
      const data = await getTeamMemberById(params.id);
      if (data) {
        setTeamMember({
          ...data,
          education: data.education || [],
          experience: data.experience || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
        });
      } else {
        toast.error("Team member not found");
        router.push("/dashboard/team");
      }
    } catch (error) {
      console.error("Error fetching team member:", error);
      toast.error("Failed to load team member data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Upload avatar if there's a file
      let avatarUrl = teamMember.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar() || teamMember.avatar;
      }
      
      // Update the team member with the new avatar URL
      const updatedTeamMember = {
        ...teamMember,
        avatar: avatarUrl,
      };
      
      const { success, error } = await updateTeamMember(params.id, updatedTeamMember);
      
      if (success) {
        toast.success("Team member updated successfully");
        // Exit edit mode
        router.push(`/dashboard/team/${params.id}`);
      } else {
        toast.error("Failed to update team member");
        console.error("Error updating team member:", error);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error updating team member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    setIsUploading(true);
    try {
      const { success, url, error } = await uploadTeamMemberAvatar(avatarFile);
      
      if (success && url) {
        return url;
      } else {
        console.error("Error uploading avatar:", error);
        toast.error("Failed to upload avatar");
        return null;
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("An error occurred while uploading avatar");
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setTeamMember({
        ...teamMember,
        skills: [...teamMember.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    setTeamMember({
      ...teamMember,
      skills: teamMember.skills.filter((_, i) => i !== index),
    });
  };
  
  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setTeamMember({
        ...teamMember,
        certifications: [...(teamMember.certifications || []), newCertification.trim()],
      });
      setNewCertification("");
    }
  };
  
  const handleRemoveCertification = (index: number) => {
    if (!teamMember.certifications) return;
    setTeamMember({
      ...teamMember,
      certifications: teamMember.certifications.filter((_, i) => i !== index),
    });
  };
  
  const handleAddProject = () => {
    if (newProject.trim()) {
      setTeamMember({
        ...teamMember,
        projects: [...(teamMember.projects || []), newProject.trim()],
      });
      setNewProject("");
    }
  };
  
  const handleRemoveProject = (index: number) => {
    if (!teamMember.projects) return;
    setTeamMember({
      ...teamMember,
      projects: teamMember.projects.filter((_, i) => i !== index),
    });
  };
  
  const handleAddEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setTeamMember({
        ...teamMember,
        education: [...(teamMember.education || []), { ...newEducation }],
      });
      setNewEducation({
        degree: "",
        institution: "",
        year: "",
      });
    }
  };
  
  const handleRemoveEducation = (index: number) => {
    if (!teamMember.education) return;
    setTeamMember({
      ...teamMember,
      education: teamMember.education.filter((_, i) => i !== index),
    });
  };
  
  const handleAddExperience = () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      setTeamMember({
        ...teamMember,
        experience: [...(teamMember.experience || []), { ...newExperience }],
      });
      setNewExperience({
        position: "",
        company: "",
        duration: "",
      });
    }
  };
  
  const handleRemoveExperience = (index: number) => {
    if (!teamMember.experience) return;
    setTeamMember({
      ...teamMember,
      experience: teamMember.experience.filter((_, i) => i !== index),
    });
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link href="/dashboard/team">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{teamMember.name}</h1>
          {!isEditMode && (
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => router.push(`/dashboard/team/${params.id}?edit=true`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
        
        {isEditMode && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/team/${params.id}`)}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    {isUploading ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                    ) : avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={teamMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={teamMember.avatar}
                        alt={teamMember.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {isEditMode && (
                    <div className="absolute bottom-0 right-0">
                      <label
                        htmlFor="avatar-upload"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                  )}
                </div>
                
                {isEditMode ? (
                  <div className="space-y-3 w-full">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={teamMember.name}
                        onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })}
                        placeholder="Full Name"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={teamMember.role}
                        onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })}
                        placeholder="Job Title"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{teamMember.name}</h2>
                    <p className="text-blue-600 font-medium">{teamMember.role}</p>
                  </>
                )}
                
                <div className="w-full border-t my-4"></div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditMode ? (
                      <Input
                        value={teamMember.email}
                        onChange={(e) => setTeamMember({ ...teamMember, email: e.target.value })}
                        placeholder="Email"
                        disabled={isSubmitting}
                      />
                    ) : (
                      <span>{teamMember.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditMode ? (
                      <Input
                        value={teamMember.phone}
                        onChange={(e) => setTeamMember({ ...teamMember, phone: e.target.value })}
                        placeholder="Phone Number"
                        disabled={isSubmitting}
                      />
                    ) : (
                      <span>{teamMember.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleAddSkill}
                      disabled={isSubmitting}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {teamMember.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-blue-700 hover:text-blue-900 focus:outline-none"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teamMember.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCertification();
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleAddCertification}
                      disabled={isSubmitting}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ul className="space-y-2">
                    {teamMember.certifications?.map((cert, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span>{cert}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(index)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="space-y-2">
                  {teamMember.certifications?.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Bio, Experience, Education, Projects */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Bio</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Textarea
                  value={teamMember.bio}
                  onChange={(e) => setTeamMember({ ...teamMember, bio: e.target.value })}
                  placeholder="Professional biography..."
                  rows={6}
                  disabled={isSubmitting}
                />
              ) : (
                <p className="whitespace-pre-line">{teamMember.bio}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              {isEditMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddExperience}
                  disabled={!newExperience.position || !newExperience.company || isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-muted/20">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newExperience.position}
                      onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                      placeholder="Job Title"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      placeholder="Company Name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newExperience.duration}
                      onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                      placeholder="e.g., 2018 - Present"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {teamMember.experience?.map((exp, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{exp.position}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      </div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!teamMember.experience || teamMember.experience.length === 0) && (
                  <p className="text-muted-foreground text-center py-2">No work experience added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              {isEditMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddEducation}
                  disabled={!newEducation.degree || !newEducation.institution || isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-muted/20">
                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      placeholder="Degree or Certificate"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      placeholder="School or University"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      placeholder="e.g., 2010"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {teamMember.education?.map((edu, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!teamMember.education || teamMember.education.length === 0) && (
                  <p className="text-muted-foreground text-center py-2">No education history added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notable Projects</CardTitle>
              {isEditMode && (
                <div className="flex gap-2">
                  <Input
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="Add a project"
                    className="max-w-[200px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddProject();
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddProject}
                    disabled={!newProject.trim() || isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teamMember.projects?.map((project, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{project}</span>
                    </div>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProject(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
                
                {(!teamMember.projects || teamMember.projects.length === 0) && (
                  <p className="text-muted-foreground text-center py-2">No projects added yet.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
