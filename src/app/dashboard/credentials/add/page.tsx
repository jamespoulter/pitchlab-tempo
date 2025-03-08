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
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";

export default function AddCredentialPage() {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [image, setImage] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the credential to your database
    console.log({
      title,
      issuer,
      issueDate,
      expiryDate,
      description,
      credentialId,
      credentialUrl,
      image,
      skills,
    });
    // Redirect to credentials list after saving
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
        <Button type="submit" form="credential-form" className="gap-1">
          <Save className="h-4 w-4" />
          <span>Save Credential</span>
        </Button>
      </div>

      <form id="credential-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Credential Information</CardTitle>
                <CardDescription>
                  Add details about this certification or qualification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Credential Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Google Ads Certification"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer">Issuing Organization</Label>
                    <Input
                      id="issuer"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      placeholder="Google"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this credential certifies and its importance..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="credentialId">Credential ID</Label>
                    <Input
                      id="credentialId"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      placeholder="GA-12345-XYZ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credentialUrl">Verification URL</Label>
                    <Input
                      id="credentialUrl"
                      value={credentialUrl}
                      onChange={(e) => setCredentialUrl(e.target.value)}
                      placeholder="https://example.com/verify/123"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  What skills does this credential validate?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., 'Search Campaign Management')"
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
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Credential Image</CardTitle>
                <CardDescription>
                  Upload or link to a logo or badge image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  {image ? (
                    <div className="w-32 h-32 mb-4 bg-blue-600 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt="Credential preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-4xl font-bold">
                        {issuer ? issuer.substring(0, 2).toUpperCase() : "CR"}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-medium mb-2">Drag & drop an image or</p>
                  <Input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      // In a real app, you would upload the file and get a URL
                      // For now, we'll just simulate with a placeholder
                      if (e.target.files && e.target.files[0]) {
                        // This would be replaced with actual file upload logic
                        setImage(
                          `https://api.dicebear.com/7.x/initials/svg?seed=${issuer || "CR"}&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff`
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    Choose File
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Or enter image URL</Label>
                  <Input
                    id="imageUrl"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/credential-logo.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to generate a logo automatically
                  </p>
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
                    Feature this credential
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
