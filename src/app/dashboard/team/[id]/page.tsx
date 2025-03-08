"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  
  // State for the team member data
  const [teamMember, setTeamMember] = useState({
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
  
  const handleSave = () => {
    // Here you would normally save the data to your database
    console.log("Saving team member:", teamMember);
    alert("Team member saved successfully!");
    
    // Exit edit mode
    router.push(`/dashboard/team/${params.id}`);
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
        certifications: [...teamMember.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };
  
  const handleRemoveCertification = (index: number) => {
    setTeamMember({
      ...teamMember,
      certifications: teamMember.certifications.filter((_, i) => i !== index),
    });
  };
  
  const handleAddProject = () => {
    if (newProject.trim()) {
      setTeamMember({
        ...teamMember,
        projects: [...teamMember.projects, newProject.trim()],
      });
      setNewProject("");
    }
  };
  
  const handleRemoveProject = (index: number) => {
    setTeamMember({
      ...teamMember,
      projects: teamMember.projects.filter((_, i) => i !== index),
    });
  };
  
  const handleAddEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setTeamMember({
        ...teamMember,
        education: [...teamMember.education, { ...newEducation }],
      });
      setNewEducation({
        degree: "",
        institution: "",
        year: "",
      });
    }
  };
  
  const handleRemoveEducation = (index: number) => {
    setTeamMember({
      ...teamMember,
      education: teamMember.education.filter((_, i) => i !== index),
    });
  };
  
  const handleAddExperience = () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      setTeamMember({
        ...teamMember,
        experience: [...teamMember.experience, { ...newExperience }],
      });
      setNewExperience({
        position: "",
        company: "",
        duration: "",
      });
    }
  };
  
  const handleRemoveExperience = (index: number) => {
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
  
  // Handle avatar upload
  const handleAvatarUpload = () => {
    if (avatarFile) {
      // In a real app, you would upload the file to your server or cloud storage
      // and get back a URL to store in the database
      console.log("Uploading avatar:", avatarFile);
      
      // For now, we'll just use the preview URL as if it were the uploaded URL
      if (avatarPreview) {
        setTeamMember({
          ...teamMember,
          avatar: avatarPreview,
        });
        
        // Reset the file input
        setAvatarFile(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/team">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            {isEditMode ? (
              <Input
                value={teamMember.name}
                onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })}
                className="text-2xl font-bold h-auto py-1 px-2"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{teamMember.name}</h1>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">Role:</span>
              {isEditMode ? (
                <Input
                  value={teamMember.role}
                  onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })}
                  className="h-7 py-1 px-2"
                />
              ) : (
                <span className="text-blue-600 font-medium">{teamMember.role}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => router.push(`/dashboard/team/${params.id}`)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              className="gap-1"
              onClick={() => router.push(`/dashboard/team/${params.id}?edit=true`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group">
                  {isEditMode ? (
                    <>
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={teamMember.avatar}
                          alt={teamMember.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center">
                          <Camera className="h-8 w-8 text-white mb-1" />
                          <span className="text-white text-xs">Change Photo</span>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      {avatarFile && (
                        <div className="mt-2 flex justify-center">
                          <Button 
                            size="sm" 
                            onClick={handleAvatarUpload}
                            className="flex items-center gap-1"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Apply</span>
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <img
                      src={teamMember.avatar}
                      alt={teamMember.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {!isEditMode && (
                  <>
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
                  </>
                )}
                <div className="w-full space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditMode ? (
                      <Input
                        value={teamMember.email}
                        onChange={(e) => setTeamMember({ ...teamMember, email: e.target.value })}
                        className="h-7 py-1 px-2"
                      />
                    ) : (
                      <span>{teamMember.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditMode ? (
                      <Input
                        value={teamMember.phone}
                        onChange={(e) => setTeamMember({ ...teamMember, phone: e.target.value })}
                        className="h-7 py-1 px-2"
                      />
                    ) : (
                      <span>{teamMember.phone}</span>
                    )}
                  </div>
                </div>
                {!isEditMode && (
                  <div className="mt-6 w-full">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Add to Proposal
                    </Button>
                  </div>
                )}
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
                  <div
                    key={index}
                    className="flex items-center text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    <span>{skill}</span>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditMode && (
                  <div className="flex items-center gap-2 w-full mt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}
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
                    {isEditMode ? (
                      <div className="flex-1 flex items-center">
                        <Input
                          value={cert}
                          onChange={(e) => {
                            const updatedCerts = [...teamMember.certifications];
                            updatedCerts[index] = e.target.value;
                            setTeamMember({
                              ...teamMember,
                              certifications: updatedCerts,
                            });
                          }}
                          className="flex-1 mr-2"
                        />
                        <button
                          onClick={() => handleRemoveCertification(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span>{cert}</span>
                    )}
                  </div>
                ))}
                {isEditMode && (
                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add certification"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCertification();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddCertification}
                      disabled={!newCertification.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}
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
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Textarea
                  value={teamMember.bio}
                  onChange={(e) => setTeamMember({ ...teamMember, bio: e.target.value })}
                  className="min-h-[150px]"
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
                  disabled={!newExperience.position.trim() || !newExperience.company.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditMode && (
                <div className="mb-6 p-4 border rounded-md">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                        placeholder="e.g. Senior Designer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        placeholder="e.g. Design Agency"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                        placeholder="e.g. 2018 - Present"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {teamMember.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-200 pl-4 pb-4"
                  >
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            value={exp.position}
                            onChange={(e) => {
                              const updatedExp = [...teamMember.experience];
                              updatedExp[index].position = e.target.value;
                              setTeamMember({
                                ...teamMember,
                                experience: updatedExp,
                              });
                            }}
                            className="font-semibold"
                          />
                          <button
                            onClick={() => handleRemoveExperience(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const updatedExp = [...teamMember.experience];
                            updatedExp[index].company = e.target.value;
                            setTeamMember({
                              ...teamMember,
                              experience: updatedExp,
                            });
                          }}
                        />
                        <Input
                          value={exp.duration}
                          onChange={(e) => {
                            const updatedExp = [...teamMember.experience];
                            updatedExp[index].duration = e.target.value;
                            setTeamMember({
                              ...teamMember,
                              experience: updatedExp,
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <h3 className="font-semibold">{exp.position}</h3>
                        </div>
                        <p className="text-sm">{exp.company}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{exp.duration}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
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
                  disabled={!newEducation.degree.trim() || !newEducation.institution.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditMode && (
                <div className="mb-6 p-4 border rounded-md">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        placeholder="e.g. Bachelor of Arts in Design"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        placeholder="e.g. University of Design"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                        placeholder="e.g. 2015"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {teamMember.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-200 pl-4 pb-4"
                  >
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updatedEdu = [...teamMember.education];
                              updatedEdu[index].degree = e.target.value;
                              setTeamMember({
                                ...teamMember,
                                education: updatedEdu,
                              });
                            }}
                            className="font-semibold"
                          />
                          <button
                            onClick={() => handleRemoveEducation(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const updatedEdu = [...teamMember.education];
                            updatedEdu[index].institution = e.target.value;
                            setTeamMember({
                              ...teamMember,
                              education: updatedEdu,
                            });
                          }}
                        />
                        <Input
                          value={edu.year}
                          onChange={(e) => {
                            const updatedEdu = [...teamMember.education];
                            updatedEdu[index].year = e.target.value;
                            setTeamMember({
                              ...teamMember,
                              education: updatedEdu,
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm">{edu.institution}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{edu.year}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notable Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teamMember.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        {isEditMode ? (
                          <Input
                            value={project}
                            onChange={(e) => {
                              const updatedProjects = [...teamMember.projects];
                              updatedProjects[index] = e.target.value;
                              setTeamMember({
                                ...teamMember,
                                projects: updatedProjects,
                              });
                            }}
                          />
                        ) : (
                          <span>{project}</span>
                        )}
                      </div>
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveProject(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isEditMode && (
                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      placeholder="Add project"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddProject();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddProject}
                      disabled={!newProject.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
