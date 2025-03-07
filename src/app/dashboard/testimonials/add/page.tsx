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
import { ArrowLeft, Save, Star, Upload } from "lucide-react";
import Link from "next/link";

export default function AddTestimonialPage() {
  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [projectType, setProjectType] = useState("");
  const [avatar, setAvatar] = useState("");
  const [featured, setFeatured] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });
  const [projectDetails, setProjectDetails] = useState({
    startDate: "",
    endDate: "",
    services: "",
    results: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the testimonial to your database
    console.log({
      clientName,
      clientTitle,
      companyName,
      quote,
      rating,
      projectType,
      avatar,
      featured,
      contactInfo,
      projectDetails,
    });
    // Redirect to testimonials list after saving
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/testimonials">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Testimonials</span>
          </Button>
        </Link>
        <Button type="submit" form="testimonial-form" className="gap-1">
          <Save className="h-4 w-4" />
          <span>Save Testimonial</span>
        </Button>
      </div>

      <form id="testimonial-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Add details about the client who provided this testimonial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientTitle">Client Title</Label>
                    <Input
                      id="clientTitle"
                      value={clientTitle}
                      onChange={(e) => setClientTitle(e.target.value)}
                      placeholder="CEO"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Input
                      id="projectType"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      placeholder="Website Redesign"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      placeholder="john@acmeinc.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testimonial Content</CardTitle>
                <CardDescription>
                  The client's feedback about your work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quote">Testimonial Quote</Label>
                  <Textarea
                    id="quote"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="What the client said about your work..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Information about the project this testimonial relates to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Project Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={projectDetails.startDate}
                      onChange={(e) =>
                        setProjectDetails({
                          ...projectDetails,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Project End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={projectDetails.endDate}
                      onChange={(e) =>
                        setProjectDetails({
                          ...projectDetails,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Services Provided</Label>
                  <Input
                    id="services"
                    value={projectDetails.services}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        services: e.target.value,
                      })
                    }
                    placeholder="Website Redesign, SEO, Content Strategy (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">Project Results</Label>
                  <Textarea
                    id="results"
                    value={projectDetails.results}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        results: e.target.value,
                      })
                    }
                    placeholder="Key results achieved (e.g., 45% increase in qualified leads)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Avatar</CardTitle>
                <CardDescription>
                  Upload or link to a profile photo of the client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  {avatar ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img
                        src={avatar}
                        alt="Client avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium mb-2">
                    Drag & drop an image or
                  </p>
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
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientName || "Client"}`,
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
                    placeholder="https://example.com/client-photo.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to generate an avatar automatically
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Content</CardTitle>
                <CardDescription>
                  Link this testimonial to other content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caseStudy">Related Case Study</Label>
                  <select
                    id="caseStudy"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="">Select a case study</option>
                    <option value="1">E-commerce Redesign</option>
                    <option value="2">B2B Lead Generation</option>
                    <option value="3">Brand Refresh</option>
                  </select>
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
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Feature this testimonial
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="website"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <Label htmlFor="website" className="text-sm font-medium">
                    Show on website
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
