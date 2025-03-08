"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2, Calendar, Award, Link as LinkIcon, DollarSign } from "lucide-react";
import { createCaseStudy, uploadCaseStudyImage } from "@/utils/supabase-client";
import { CaseStudy, CaseStudyFormData } from "@/types/agency";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseStudy: CaseStudy) => void;
}

export function AddCaseStudyModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCaseStudyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  
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
    // New fields
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
  
  // Input states
  const [newTag, setNewTag] = useState("");
  const [newAward, setNewAward] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newMetricKey, setNewMetricKey] = useState("");
  const [newMetricValue, setNewMetricValue] = useState("");
  
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

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title || !formData.client || !formData.industry) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Starting case study submission...");
    console.log("Form data:", formData);
    
    setIsSubmitting(true);
    
    try {
      let dataToSubmit = { ...formData };
      
      // Ensure metrics is a valid object for JSONB storage
      if (dataToSubmit.metrics && Object.keys(dataToSubmit.metrics).length === 0) {
        dataToSubmit.metrics = null;
      }
      
      // Ensure arrays are properly initialized
      dataToSubmit.tags = dataToSubmit.tags || [];
      dataToSubmit.team_members = dataToSubmit.team_members || [];
      dataToSubmit.technologies = dataToSubmit.technologies || [];
      dataToSubmit.awards = dataToSubmit.awards || [];
      dataToSubmit.key_features = dataToSubmit.key_features || [];
      dataToSubmit.gallery_images = dataToSubmit.gallery_images || [];
      
      // Handle empty date fields - convert empty strings to null
      if (dataToSubmit.start_date === "") dataToSubmit.start_date = null;
      if (dataToSubmit.end_date === "") dataToSubmit.end_date = null;
      
      // Ensure the required date field is valid
      if (dataToSubmit.date === "") {
        dataToSubmit.date = new Date().toISOString().split("T")[0]; // Use today's date as fallback
      }
      
      // Upload image if one was selected
      if (imageFile) {
        console.log("Uploading case study image...");
        const { success, url, error } = await uploadCaseStudyImage(imageFile);
        console.log("Image upload result:", { success, url, error });
        if (success && url) {
          dataToSubmit.image_url = url;
        } else {
          throw error || new Error("Failed to upload image");
        }
      }
      
      // Upload client logo if one was selected
      if (clientLogoFile) {
        console.log("Uploading client logo...");
        const { success, url, error } = await uploadCaseStudyImage(clientLogoFile);
        console.log("Logo upload result:", { success, url, error });
        if (success && url) {
          dataToSubmit.client_logo_url = url;
        } else {
          throw error || new Error("Failed to upload client logo");
        }
      }
      
      console.log("Creating case study with data:", dataToSubmit);
      
      // Create the case study
      const { success, data, error } = await createCaseStudy(dataToSubmit);
      console.log("Create case study result:", { success, data, error });
      
      if (success && data) {
        toast({
          title: "Success",
          description: "Case study created successfully.",
        });
        
        // Reset form
        setFormData({
          title: "",
          client: "",
          industry: "",
          date: new Date().toISOString().split("T")[0],
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
        setImageFile(null);
        setClientLogoFile(null);
        
        // Call success callback
        onSuccess(data);
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

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Case Study</DialogTitle>
          <DialogDescription>
            Add a new case study to showcase your agency's successful client projects.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="team">Team & Tech</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-title">Case Study Title <span className="text-red-500">*</span></Label>
              <Input
                id="modal-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="E-commerce Redesign Boosts Conversion by 45%"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-client">Client <span className="text-red-500">*</span></Label>
                <Input
                  id="modal-client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  placeholder="Fashion Retailer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-industry">Industry <span className="text-red-500">*</span></Label>
                <Input
                  id="modal-industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="E-commerce"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-date">Completion Date <span className="text-red-500">*</span></Label>
                <Input
                  id="modal-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-image">Featured Image</Label>
                <Input
                  id="modal-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
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
                  placeholder="Add tag (e.g., Web Design)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-challenge">Challenge</Label>
              <Textarea
                id="modal-challenge"
                name="challenge"
                value={formData.challenge || ""}
                onChange={handleInputChange}
                placeholder="Describe the client's challenge or problem..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modal-solution">Solution</Label>
              <Textarea
                id="modal-solution"
                name="solution"
                value={formData.solution || ""}
                onChange={handleInputChange}
                placeholder="Explain your approach and solution..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modal-results">Results</Label>
              <Textarea
                id="modal-results"
                name="results"
                value={formData.results || ""}
                onChange={handleInputChange}
                placeholder="Describe the measurable outcomes and results..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modal-testimonial-quote">Testimonial Quote</Label>
              <Textarea
                id="modal-testimonial-quote"
                name="testimonial_quote"
                value={formData.testimonial_quote || ""}
                onChange={handleInputChange}
                placeholder="Client's testimonial quote..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-testimonial-author">Testimonial Author</Label>
                <Input
                  id="modal-testimonial-author"
                  name="testimonial_author"
                  value={formData.testimonial_author || ""}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-testimonial-title">Testimonial Title</Label>
                <Input
                  id="modal-testimonial-title"
                  name="testimonial_title"
                  value={formData.testimonial_title || ""}
                  onChange={handleInputChange}
                  placeholder="CEO, Client Company"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="space-y-2 mb-2">
                {formData.team_members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
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
                  placeholder="Add team member (e.g., John Smith - Project Manager)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTeamMember();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTeamMember}
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
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
                    className="flex items-center bg-gray-50 px-2 py-1 rounded-md text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
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
                  placeholder="Add technology (e.g., React)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechnology();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTechnology}
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modal-timeline">Project Timeline</Label>
              <Input
                id="modal-timeline"
                name="timeline"
                value={formData.timeline || ""}
                onChange={handleInputChange}
                placeholder="E.g., 12 weeks (June - September 2023)"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-start-date">Project Start Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="modal-start-date"
                    name="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-end-date">Project End Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="modal-end-date"
                    name="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Awards</Label>
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
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAward();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addAward}
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-project-url">Project URL</Label>
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="modal-project-url"
                    name="project_url"
                    value={formData.project_url || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-budget">Project Budget</Label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="modal-budget"
                    name="budget"
                    value={formData.budget || ""}
                    onChange={handleInputChange}
                    placeholder="E.g., $50,000 - $75,000"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modal-client-logo">Client Logo</Label>
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
                  id="modal-client-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleClientLogoChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Key Features</Label>
              <div className="space-y-2 mb-2">
                {(formData.key_features || []).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
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
                  placeholder="Add key feature (e.g., Responsive Design)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
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
                onClick={addMetric}
                size="sm"
                className="flex items-center mt-2"
                disabled={!newMetricKey.trim() || !newMetricValue.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Metric
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modal-video-url">Video URL</Label>
              <Input
                id="modal-video-url"
                name="video_url"
                value={formData.video_url || ""}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=example"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Case Study"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
