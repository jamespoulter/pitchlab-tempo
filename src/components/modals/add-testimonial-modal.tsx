"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
<<<<<<< HEAD
import { Star, X } from "lucide-react";
import { TestimonialFormData } from "@/types/agency";
import { createTestimonial } from "@/utils/supabase-client";
=======
import { Star, X, Upload, Loader2 } from "lucide-react";
import { TestimonialFormData } from "@/types/agency";
import { uploadTestimonialClientImage } from "@/utils/supabase-client";
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
import { toast } from "sonner";

interface AddTestimonialModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
<<<<<<< HEAD
  onSave?: (testimonial: any) => void;
  userId?: string | null;
=======
  onSave?: (testimonial: TestimonialFormData) => void;
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
}

export function AddTestimonialModal({
  open,
  onOpenChange,
  onSave,
  userId,
}: AddTestimonialModalProps) {
  const [clientName, setClientName] = useState("");
<<<<<<< HEAD
  const [clientTitle, setClientTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [projectType, setProjectType] = useState("");
  const [avatar, setAvatar] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      toast.error("You must be logged in to add a testimonial");
=======
  const [clientRole, setClientRole] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | undefined>(5);
  const [projectName, setProjectName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [clientImageUrl, setClientImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const { success, url, error } = await uploadTestimonialClientImage(file);
      
      if (success && url) {
        setClientImageUrl(url);
        toast.success("Image uploaded successfully");
      } else {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!clientName || !content) {
      toast.error("Client name and testimonial content are required");
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
      return;
    }

    setIsLoading(true);
    
<<<<<<< HEAD
    try {
      const date = new Date().toISOString().split("T")[0];
      
      const testimonialData: TestimonialFormData = {
        client_name: clientName,
        client_position: clientTitle,
        client_company: companyName,
        content: quote,
        rating,
        date,
        project_type: projectType,
        image_url: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientName}`,
        featured,
        contact_info: {
          email: "",
          phone: "",
        },
        project_details: {
          services: [],
          results: [],
        },
        related_case_studies: [],
      };
      
      const newTestimonial = await createTestimonial(userId, testimonialData);
      
      if (onSave) {
        onSave(newTestimonial);
=======
    setIsSubmitting(true);
    
    try {
      const newTestimonial: TestimonialFormData = {
        client_name: clientName,
        client_role: clientRole,
        client_company: clientCompany,
        content,
        rating,
        project_name: projectName,
        project_date: projectDate,
        client_image_url: clientImageUrl,
        is_featured: isFeatured,
        display_order: 0, // Default to 0, can be updated later
      };
      
      if (onSave) {
        await onSave(newTestimonial);
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
      }
      
      // Reset form
      setClientName("");
<<<<<<< HEAD
      setClientTitle("");
      setCompanyName("");
      setQuote("");
      setRating(5);
      setProjectType("");
      setAvatar("");
      setFeatured(false);
      
      toast.success("Testimonial added successfully");
=======
      setClientRole("");
      setClientCompany("");
      setContent("");
      setRating(5);
      setProjectName("");
      setProjectDate("");
      setClientImageUrl("");
      setIsFeatured(false);
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Error adding testimonial:", error);
      toast.error("Failed to add testimonial");
    } finally {
      setIsLoading(false);
=======
      console.error("Error saving testimonial:", error);
      toast.error("An error occurred while saving the testimonial");
    } finally {
      setIsSubmitting(false);
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Testimonial</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange && onOpenChange(false)}
            disabled={isSubmitting || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Smith"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientRole">Client Title/Role</Label>
              <Input
                id="clientRole"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                placeholder="CEO"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientCompany">Company Name</Label>
            <Input
              id="clientCompany"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              placeholder="TechStart Inc."
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content <span className="text-red-500">*</span></Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Working with this agency transformed our brand identity and online presence..."
              className="min-h-[100px]"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Brand Strategy & Website Redesign"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDate">Project Date</Label>
              <Input
                id="projectDate"
                type="date"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
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
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= (rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientImage">Client Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="clientImage"
                value={clientImageUrl}
                onChange={(e) => setClientImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                disabled={isSubmitting || isUploading}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                disabled={isSubmitting || isUploading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
            {clientImageUrl && (
              <div className="mt-2">
                <img
                  src={clientImageUrl}
                  alt="Client"
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <Label htmlFor="isFeatured" className="text-sm">
              Feature this testimonial
            </Label>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
<<<<<<< HEAD
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Testimonial"}
=======
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!clientName || !content || isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Testimonial"
            )}
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
          </Button>
        </div>
      </div>
    </div>
  );
}
