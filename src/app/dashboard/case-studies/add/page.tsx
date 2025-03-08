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

export default function AddCaseStudyPage() {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [testimonial, setTestimonial] = useState({
    quote: "",
    author: "",
    title: "",
  });
  const [team, setTeam] = useState<string[]>([]);
  const [newTeamMember, setNewTeamMember] = useState("");
  const [duration, setDuration] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState("");

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addTeamMember = () => {
    if (newTeamMember.trim()) {
      setTeam([...team, newTeamMember.trim()]);
      setNewTeamMember("");
    }
  };

  const removeTeamMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const addTool = () => {
    if (newTool.trim()) {
      setTools([...tools, newTool.trim()]);
      setNewTool("");
    }
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the case study to your database
    console.log({
      title,
      client,
      industry,
      date,
      image,
      tags,
      challenge,
      solution,
      results,
      testimonial,
      team,
      duration,
      tools,
    });
    // Redirect to case studies list after saving
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/case-studies">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Case Studies</span>
          </Button>
        </Link>
        <Button type="submit" form="case-study-form" className="gap-1">
          <Save className="h-4 w-4" />
          <span>Save Case Study</span>
        </Button>
      </div>

      <form id="case-study-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Study Information</CardTitle>
                <CardDescription>
                  Add details about this project and its outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Case Study Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="E-commerce Redesign Boosts Conversion by 45%"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input
                      id="client"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="Fashion Retailer"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="E-commerce"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Completion Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., 'Web Design')"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
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
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Describe the challenge, solution, and results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="challenge">Challenge</Label>
                  <Textarea
                    id="challenge"
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="Describe the client's challenge or problem..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea
                    id="solution"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Describe your agency's solution..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">Results</Label>
                  <Textarea
                    id="results"
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    placeholder="Describe the measurable results achieved..."
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Testimonial</CardTitle>
                <CardDescription>
                  Add a quote from the client about this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testimonial-quote">Quote</Label>
                  <Textarea
                    id="testimonial-quote"
                    value={testimonial.quote}
                    onChange={(e) =>
                      setTestimonial({ ...testimonial, quote: e.target.value })
                    }
                    placeholder="What the client said about your work..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-author">Author Name</Label>
                    <Input
                      id="testimonial-author"
                      value={testimonial.author}
                      onChange={(e) =>
                        setTestimonial({ ...testimonial, author: e.target.value })
                      }
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-title">Author Title</Label>
                    <Input
                      id="testimonial-title"
                      value={testimonial.title}
                      onChange={(e) =>
                        setTestimonial({ ...testimonial, title: e.target.value })
                      }
                      placeholder="E-commerce Director"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Upload or link to a main image for this case study
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  {image ? (
                    <div className="w-full aspect-video rounded-md overflow-hidden mb-4">
                      <img
                        src={image}
                        alt="Case study preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400" />
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
                        setImage(
                          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80"
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
                    placeholder="https://example.com/case-study-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Metadata</CardTitle>
                <CardDescription>
                  Additional information about the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Project Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="12 weeks"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Team</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTeamMember}
                      onChange={(e) => setNewTeamMember(e.target.value)}
                      placeholder="Add team member"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTeamMember();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTeamMember}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {team.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <span className="text-sm">{member}</span>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tools & Technologies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="Add tool or technology"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTool();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTool}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tools.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => removeTool(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
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
                    Feature this case study
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
