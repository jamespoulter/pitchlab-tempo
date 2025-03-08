"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
    // Then redirect or show a success message
  };

  return (
    <div className="container py-8 animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/credentials">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter">Add Credential</h1>
          </div>
          <Button type="submit" className="transition-all duration-200">
            <Save className="mr-2 h-4 w-4" />
            Save Credential
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Credential Information</CardTitle>
                <CardDescription>
                  Enter the details of your credential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-medium">
                      Credential Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Google Cloud Professional Architect"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer" className="font-medium">
                      Issuing Organization <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="issuer"
                      placeholder="e.g. Google"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      required
                      className="transition-shadow duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="font-medium">
                      Issue Date
                    </Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="font-medium">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="transition-shadow duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your credential and what you learned"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32 transition-shadow duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="credentialId" className="font-medium">
                      Credential ID
                    </Label>
                    <Input
                      id="credentialId"
                      placeholder="e.g. ABC123XYZ"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      className="transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credentialUrl" className="font-medium">
                      Credential URL
                    </Label>
                    <Input
                      id="credentialUrl"
                      type="url"
                      placeholder="https://example.com/credential"
                      value={credentialUrl}
                      onChange={(e) => setCredentialUrl(e.target.value)}
                      className="transition-shadow duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  Add skills that you gained from this credential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-1 rounded-full hover:bg-secondary/80 p-0.5 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a skill (e.g. Cloud Architecture)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="transition-shadow duration-200"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="secondary"
                    className="shrink-0 transition-colors duration-200"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Credential Image</CardTitle>
                <CardDescription>
                  Upload an image of your credential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative h-40 w-40 rounded-md border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt="Credential preview"
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-sm text-muted-foreground">
                          Drag & drop or click to upload
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setImage(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="transition-colors duration-200"
                  >
                    Upload Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Visibility Settings</CardTitle>
                <CardDescription>
                  Control how your credential is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Feature this credential
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="public" defaultChecked />
                  <Label htmlFor="public" className="text-sm font-medium">
                    Make visible in proposals
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Featured credentials will appear at the top of your profile
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
