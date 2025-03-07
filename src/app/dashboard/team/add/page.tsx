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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X, Upload } from "lucide-react";
import Link from "next/link";

export default function AddTeamMemberPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [avatar, setAvatar] = useState("");
  const [education, setEducation] = useState<{degree: string; institution: string; year: string}[]>([]);
  const [newEducation, setNewEducation] = useState({degree: "", institution: "", year: ""});
  const [experience, setExperience] = useState<{position: string; company: string; duration: string}[]>([]);
  const [newExperience, setNewExperience] = useState({position: "", company: "", duration: ""});
  const [projects, setProjects] = useState<string[]>([]);
  const [newProject, setNewProject] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setEducation([...education, { ...newEducation }]);
      setNewEducation({degree: "", institution: "", year: ""});
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      setExperience([...experience, { ...newExperience }]);
      setNewExperience({position: "", company: "", duration: ""});
    }
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, newProject.trim()]);
      setNewProject("");
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the team member to your database
    console.log({
      name,
      role,
      email,
      phone,
      bio,
      skills,
      avatar,
      education,
      experience,
      projects,
    });
    // Redirect to team list after saving
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/team">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Team</span>
          </Button>
        </Link>
        <Button type="submit" form="team-member-form" className="gap-1">
          <Save className="h-4 w-4" />
          <span>Save Team Member</span>
        </Button>
      </div>

      <form id="team-member-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Add basic details about this team member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Johnson"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Creative Director"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief professional biography..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  What skills does this team member have?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., "Brand Strategy")"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-blue-700 hover:text-blue-900 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Add previous work experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                        placeholder="Senior Art Director"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        placeholder="Previous Agency"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                        placeholder="2018 - 2022"
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-2 mt-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{exp.position}</h3>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add educational background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                        placeholder="MFA in Graphic Design"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                        placeholder="Rhode Island School of Design"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                        placeholder="2010"
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-2 mt-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
                <CardDescription>
                  Upload or link to a profile photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  {avatar ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img
                        src={avatar}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium mb-2">Drag & drop an image or</p>
                  <Input
                    id="avatar"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      // In a real app, you would upload the file and get a URL
                      // For now, we'll just simulate with a placeholder
                      if (e.target.files && e.target.files[0]) {
                        setAvatar(
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "User"}`
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("avatar")?.click()}
                  >
                    Choose File
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Or enter image URL</Label>
                  <Input
                    id="avatarUrl"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/profile-photo.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to generate an avatar automatically
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notable Projects</CardTitle>
                <CardDescription>
                  Add projects this team member has worked on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="Add a project"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addProject();
                      }
                    }}
                  />
                  <Button type="button" onClick={addProject}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mt-2">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm">{project}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Feature this team member
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="public"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <Label htmlFor="public" className="text-sm font-medium">
                    Make visible in proposals
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
