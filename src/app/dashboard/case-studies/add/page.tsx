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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createCaseStudy, uploadCaseStudyImage } from "@/utils/supabase-client";
import { CaseStudyFormData } from "@/types/agency";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Calendar,
  DollarSign,
  Link2
} from "lucide-react";

export default function AddCaseStudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDuplicate = searchParams.get("duplicate") === "true";
  const duplicateData = searchParams.get("data");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: "",
    client: "",
    industry: "",
    date: new Date().toISOString().split("T")[0], // Today's date as default
    image_url: "",
    tags: [],
    challenge: "",
    solution: "",
    results: "",
    testimonial_quote: "",
    testimonial_author: "",
    testimonial_title: "",
    team_members: [],
    technologies: [],
    timeline: "",
  });
  
  // Input states for tags, team members, and technologies
  const [newTag, setNewTag] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  
  // Add these state variables after the existing ones
  const [newAward, setNewAward] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newMetricKey, setNewMetricKey] = useState("");
  const [newMetricValue, setNewMetricValue] = useState("");
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  
  // If duplicating, load the data from the URL
  useEffect(() => {
    if (isDuplicate && duplicateData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(duplicateData));
        setFormData({
          ...formData,
          ...parsedData,
          title: `${parsedData.title} (Copy)`,
        });
      } catch (error) {
        console.error("Error parsing duplicate data:", error);
        toast({
          title: "Error",
          description: "Failed to load duplicate data. Starting with a blank form.",
          variant: "destructive",
        });
      }
    }
  }, [isDuplicate, duplicateData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({
        ...formData,
        image_url: previewUrl,
      });
    }
  };
  
  const addTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const addTeamMember = () => {
    if (newTeamMember.trim()) {
      setFormData({
        ...formData,
        team_members: [...formData.team_members, newTeamMember.trim()],
      });
      setNewTeamMember("");
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      team_members: formData.team_members.filter((_, i) => i !== index),
    });
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()],
      });
      setNewTechnology("");
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const handleClientLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setClientLogoFile(e.target.files[0]);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({
        ...formData,
        client_logo_url: previewUrl,
      });
    }
  };

  const addAward = () => {
    if (newAward.trim()) {
      setFormData({
        ...formData,
        awards: [...(formData.awards || []), newAward.trim()],
      });
      setNewAward("");
    }
  };

  const removeAward = (index: number) => {
    setFormData({
      ...formData,
      awards: (formData.awards || []).filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        key_features: [...(formData.key_features || []), newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      key_features: (formData.key_features || []).filter((_, i) => i !== index),
    });
  };

  const addMetric = () => {
    if (newMetricKey.trim() && newMetricValue.trim()) {
      setFormData({
        ...formData,
        metrics: {
          ...(formData.metrics || {}),
          [newMetricKey.trim()]: newMetricValue.trim(),
        },
      });
      setNewMetricKey("");
      setNewMetricValue("");
    }
  };

  const removeMetric = (key: string) => {
    if (formData.metrics) {
      const newMetrics = { ...formData.metrics };
      delete newMetrics[key];
      setFormData({
        ...formData,
        metrics: newMetrics,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = { ...formData };
      
      // Upload image if one was selected
      if (imageFile) {
        const { success, url, error } = await uploadCaseStudyImage(imageFile);
        if (success && url) {
          dataToSubmit.image_url = url;
        } else {
          throw error || new Error("Failed to upload image");
        }
      }
      
      // Upload client logo if one was selected
      if (clientLogoFile) {
        const { success, url, error } = await uploadCaseStudyImage(clientLogoFile);
        if (success && url) {
          dataToSubmit.client_logo_url = url;
        } else {
          throw error || new Error("Failed to upload client logo");
        }
      }
      
      // Create the case study
      const { success, data, error } = await createCaseStudy(dataToSubmit);
      
      if (success && data) {
        toast({
          title: "Success",
          description: "Case study created successfully.",
        });
        
        // Redirect to the case study detail page
        router.push(`/dashboard/case-studies/${data.id}`);
      } else {
        throw error || new Error("Failed to create case study");
      }
    } catch (error) {
      console.error("Error creating case study:", error);
      toast({
        title: "Error",
        description: "Failed to create case study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <Button 
          type="submit" 
          className="gap-1" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Case Study</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media & Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Study Details</CardTitle>
                  <CardDescription>
                    Basic information about your case study
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., E-commerce Redesign Boosts Conversion by 45%"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Input
                        id="client"
                        name="client"
                        value={formData.client}
                        onChange={handleInputChange}
                        placeholder="E.g., Fashion Retailer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="E.g., E-commerce"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Completion Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        name="timeline"
                        value={formData.timeline || ""}
                        onChange={handleInputChange}
                        placeholder="E.g., 12 weeks (June - September 2023)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Project Start Date</Label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={formData.start_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">Project End Date</Label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          value={formData.end_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Project Budget</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="budget"
                        name="budget"
                        value={formData.budget || ""}
                        onChange={handleInputChange}
                        placeholder="E.g., $50,000 - $75,000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-blue-800 hover:text-blue-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTag}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Study Content</CardTitle>
                  <CardDescription>
                    Describe the challenge, solution, and results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="challenge">Challenge</Label>
                    <Textarea
                      id="challenge"
                      name="challenge"
                      value={formData.challenge || ""}
                      onChange={handleInputChange}
                      placeholder="Describe the client's challenge or problem"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution</Label>
                    <Textarea
                      id="solution"
                      name="solution"
                      value={formData.solution || ""}
                      onChange={handleInputChange}
                      placeholder="Describe your approach and solution"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="results">Results</Label>
                    <Textarea
                      id="results"
                      name="results"
                      value={formData.results || ""}
                      onChange={handleInputChange}
                      placeholder="Describe the outcomes and results achieved"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Features & Metrics</CardTitle>
                  <CardDescription>
                    Highlight the main features and metrics of the project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Key Features</Label>
                    <div className="space-y-2 mb-2">
                      {(formData.key_features || []).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add key feature"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeature}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Key Metrics</Label>
                    <div className="space-y-2 mb-2">
                      {formData.metrics && Object.entries(formData.metrics).map(([key, value], index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-md"
                        >
                          <div>
                            <span className="font-medium">{key}: </span>
                            <span>{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMetric(key)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={newMetricKey}
                        onChange={(e) => setNewMetricKey(e.target.value)}
                        placeholder="Metric name (e.g., Conversion Rate)"
                      />
                      <Input
                        value={newMetricValue}
                        onChange={(e) => setNewMetricValue(e.target.value)}
                        placeholder="Value (e.g., 45% increase)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addMetric();
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addMetric}
                      disabled={!newMetricKey.trim() || !newMetricValue.trim()}
                    >
                      Add Metric
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Add images and videos to showcase the project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Featured Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.image_url && (
                        <div className="w-24 h-24 rounded-md overflow-hidden">
                          <img
                            src={formData.image_url}
                            alt="Case study preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client_logo_url">Client Logo</Label>
                    <div className="flex items-center gap-4">
                      {formData.client_logo_url && (
                        <div className="w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={formData.client_logo_url}
                            alt="Client logo preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <Input
                        id="client_logo_url"
                        type="file"
                        accept="image/*"
                        onChange={handleClientLogoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      name="video_url"
                      value={formData.video_url || ""}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=example"
                    />
                    {formData.video_url && (
                      <div className="mt-2 aspect-video w-full rounded-md overflow-hidden">
                        <iframe
                          src={formData.video_url.replace('watch?v=', 'embed/')}
                          title="Project Video"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="project_url">Project URL</Label>
                    <div className="flex items-center">
                      <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="project_url"
                        name="project_url"
                        value={formData.project_url || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Awards & Recognition</CardTitle>
                  <CardDescription>
                    Add any awards or recognition received for this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="space-y-2 mb-2">
                      {(formData.awards || []).map((award, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-md"
                        >
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-yellow-600" />
                            <span>{award}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAward(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newAward}
                        onChange={(e) => setNewAward(e.target.value)}
                        placeholder="Add award (e.g., Best E-commerce Design 2023)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAward();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAward}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonial</CardTitle>
              <CardDescription>
                Add a client testimonial for this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testimonial_quote">Quote</Label>
                <Textarea
                  id="testimonial_quote"
                  name="testimonial_quote"
                  value={formData.testimonial_quote || ""}
                  onChange={handleInputChange}
                  placeholder="Client's testimonial quote"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial_author">Author</Label>
                <Input
                  id="testimonial_author"
                  name="testimonial_author"
                  value={formData.testimonial_author || ""}
                  onChange={handleInputChange}
                  placeholder="E.g., Sarah Johnson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial_title">Title</Label>
                <Input
                  id="testimonial_title"
                  name="testimonial_title"
                  value={formData.testimonial_title || ""}
                  onChange={handleInputChange}
                  placeholder="E.g., E-commerce Director, Fashion Retailer"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team & Technologies</CardTitle>
              <CardDescription>
                Add team members and technologies used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="space-y-2 mb-2">
                  {formData.team_members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                    >
                      <span>{member}</span>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeamMember}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add technology"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTechnology}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
