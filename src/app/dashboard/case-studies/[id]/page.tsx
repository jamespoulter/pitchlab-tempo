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
  Calendar,
  Building,
  FileText,
  Edit,
  Share,
  Download,
  ArrowUpRight,
  CheckCircle,
  Save,
  X,
  Loader2,
  Award,
  DollarSign,
  Link2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCaseStudyById, updateCaseStudy, uploadCaseStudyImage } from "@/utils/supabase-client";
import { CaseStudy, CaseStudyFormData } from "@/types/agency";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  
  // State for the case study data
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: "",
    client: "",
    industry: "",
    date: "",
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
    start_date: "",
    end_date: "",
    awards: [],
    project_url: "",
    budget: "",
    client_logo_url: "",
    key_features: [],
    metrics: {},
    gallery_images: [],
    video_url: "",
  });
  
  // State for new tag input
  const [newTag, setNewTag] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Add these state variables after the existing ones
  const [newAward, setNewAward] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newMetricKey, setNewMetricKey] = useState("");
  const [newMetricValue, setNewMetricValue] = useState("");
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  
  // Fetch case study data on component mount
  useEffect(() => {
    const fetchCaseStudy = async () => {
      setIsLoading(true);
      try {
        const data = await getCaseStudyById(params.id);
        if (data) {
          setCaseStudy(data);
          setFormData({
            title: data.title,
            client: data.client,
            industry: data.industry,
            date: data.date,
            image_url: data.image_url,
            tags: data.tags || [],
            challenge: data.challenge,
            solution: data.solution,
            results: data.results,
            testimonial_quote: data.testimonial_quote,
            testimonial_author: data.testimonial_author,
            testimonial_title: data.testimonial_title,
            team_members: data.team_members || [],
            technologies: data.technologies || [],
            timeline: data.timeline,
            start_date: data.start_date,
            end_date: data.end_date,
            awards: data.awards || [],
            project_url: data.project_url,
            budget: data.budget,
            client_logo_url: data.client_logo_url,
            key_features: data.key_features || [],
            metrics: data.metrics || {},
            gallery_images: data.gallery_images || [],
            video_url: data.video_url,
          });
        } else {
          toast({
            title: "Error",
            description: "Case study not found.",
            variant: "destructive",
          });
          router.push("/dashboard/case-studies");
        }
      } catch (error) {
        console.error("Error fetching case study:", error);
        toast({
          title: "Error",
          description: "Failed to load case study. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCaseStudy();
  }, [params.id, router]);
  
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
  
  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };
  
  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) {
      setFormData({
        ...formData,
        team_members: [...formData.team_members, newTeamMember.trim()],
      });
      setNewTeamMember("");
    }
  };
  
  const handleRemoveTeamMember = (index: number) => {
    setFormData({
      ...formData,
      team_members: formData.team_members.filter((_, i) => i !== index),
    });
  };
  
  const handleAddTechnology = () => {
    if (newTechnology.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()],
      });
      setNewTechnology("");
    }
  };
  
  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let updatedData = { ...formData };
      
      // Ensure metrics is a valid object for JSONB storage
      if (updatedData.metrics && Object.keys(updatedData.metrics).length === 0) {
        updatedData.metrics = null;
      }
      
      // Ensure arrays are properly initialized
      updatedData.tags = updatedData.tags || [];
      updatedData.team_members = updatedData.team_members || [];
      updatedData.technologies = updatedData.technologies || [];
      updatedData.awards = updatedData.awards || [];
      updatedData.key_features = updatedData.key_features || [];
      updatedData.gallery_images = updatedData.gallery_images || [];
      
      // Handle empty date fields - convert empty strings to null
      if (updatedData.start_date === "") updatedData.start_date = null;
      if (updatedData.end_date === "") updatedData.end_date = null;
      
      // Ensure the required date field is valid
      if (updatedData.date === "") {
        updatedData.date = new Date().toISOString().split("T")[0]; // Use today's date as fallback
      }
      
      // Upload image if a new one was selected
      if (imageFile) {
        const { success, url, error } = await uploadCaseStudyImage(imageFile);
        if (success && url) {
          updatedData.image_url = url;
        } else {
          throw error || new Error("Failed to upload image");
        }
      }
      
      // Upload client logo if a new one was selected
      if (clientLogoFile) {
        const { success, url, error } = await uploadCaseStudyImage(clientLogoFile);
        if (success && url) {
          updatedData.client_logo_url = url;
        } else {
          throw error || new Error("Failed to upload client logo");
        }
      }
      
      // Update the case study
      const { success, data, error } = await updateCaseStudy(params.id, updatedData);
      
      if (success && data) {
        setCaseStudy(data);
        toast({
          title: "Success",
          description: "Case study updated successfully.",
        });
        
        // Exit edit mode
        router.push(`/dashboard/case-studies/${params.id}`);
      } else {
        throw error || new Error("Failed to update case study");
      }
    } catch (error) {
      console.error("Error saving case study:", error);
      toast({
        title: "Error",
        description: "Failed to save case study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
  
  const handleAddAward = () => {
    if (newAward.trim()) {
      setFormData({
        ...formData,
        awards: [...(formData.awards || []), newAward.trim()],
      });
      setNewAward("");
    }
  };
  
  const handleRemoveAward = (index: number) => {
    setFormData({
      ...formData,
      awards: (formData.awards || []).filter((_, i) => i !== index),
    });
  };
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        key_features: [...(formData.key_features || []), newFeature.trim()],
      });
      setNewFeature("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      key_features: (formData.key_features || []).filter((_, i) => i !== index),
    });
  };
  
  const handleAddMetric = () => {
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
  
  const handleRemoveMetric = (key: string) => {
    if (formData.metrics) {
      const newMetrics = { ...formData.metrics };
      delete newMetrics[key];
      setFormData({
        ...formData,
        metrics: newMetrics,
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!caseStudy) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Case Study Not Found</h2>
        <p className="text-muted-foreground mb-4">The case study you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/dashboard/case-studies">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Case Studies</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/case-studies">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Case Studies</span>
            </Button>
          </Link>
          {!isEditMode && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => router.push(`/dashboard/case-studies/${params.id}?edit=true`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
        {isEditMode ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => router.push(`/dashboard/case-studies/${params.id}`)}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Save Changes</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        )}
      </div>

      {isEditMode ? (
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
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={formData.start_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">Project End Date</Label>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          value={formData.end_date || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Project Budget</Label>
                      <Input
                        id="budget"
                        name="budget"
                        value={formData.budget || ""}
                        onChange={handleInputChange}
                        placeholder="E.g., $50,000 - $75,000"
                      />
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
                              onClick={() => handleRemoveTag(index)}
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
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
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
                              onClick={() => handleRemoveFeature(index)}
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
                              handleAddFeature();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddFeature}
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
                              onClick={() => handleRemoveMetric(key)}
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
                              handleAddMetric();
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handleAddMetric}
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
                          <div className="w-24 h-24 rounded-md overflow-hidden">
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
                      <Input
                        id="project_url"
                        name="project_url"
                        value={formData.project_url || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
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
                              onClick={() => handleRemoveAward(index)}
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
                              handleAddAward();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddAward}
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
                          onClick={() => handleRemoveTeamMember(index)}
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
                          handleAddTeamMember();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTeamMember}
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
                          onClick={() => handleRemoveTechnology(index)}
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
                          handleAddTechnology();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTechnology}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <img
                src={caseStudy.image_url || "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80"}
                alt={caseStudy.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{caseStudy.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {caseStudy.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">
                      {caseStudy.client}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Industry</p>
                    <p className="text-sm text-muted-foreground">
                      {caseStudy.industry}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(caseStudy.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{caseStudy.challenge}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{caseStudy.solution}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{caseStudy.results}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {caseStudy.testimonial_quote && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Testimonial</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic">
                    "{caseStudy.testimonial_quote}"
                  </blockquote>
                  {caseStudy.testimonial_author && (
                    <div className="mt-4">
                      <p className="font-medium">{caseStudy.testimonial_author}</p>
                      {caseStudy.testimonial_title && (
                        <p className="text-sm text-muted-foreground">
                          {caseStudy.testimonial_title}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {caseStudy.timeline && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{caseStudy.timeline}</p>
                </CardContent>
              </Card>
            )}

            {caseStudy.team_members && caseStudy.team_members.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {caseStudy.team_members.map((member, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{member}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {caseStudy.technologies && caseStudy.technologies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {caseStudy.awards && caseStudy.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Awards & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {caseStudy.awards.map((award, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>{award}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {(caseStudy.project_url || caseStudy.budget || caseStudy.start_date || caseStudy.end_date) && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {caseStudy.start_date && caseStudy.end_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Project Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(caseStudy.start_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })} - {new Date(caseStudy.end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {caseStudy.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Budget</p>
                        <p className="text-sm text-muted-foreground">{caseStudy.budget}</p>
                      </div>
                    </div>
                  )}
                  
                  {caseStudy.project_url && (
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Project URL</p>
                        <a 
                          href={caseStudy.project_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {caseStudy.project_url}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {caseStudy.key_features && caseStudy.key_features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {caseStudy.key_features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {caseStudy.metrics && Object.keys(caseStudy.metrics).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(caseStudy.metrics).map(([key, value], index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="font-medium">{key}</span>
                        <span className="text-blue-600 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {caseStudy.video_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full rounded-md overflow-hidden">
                    <iframe
                      src={caseStudy.video_url.replace('watch?v=', 'embed/')}
                      title="Project Video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
