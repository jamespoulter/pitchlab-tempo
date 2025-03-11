"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { TestimonialFormData } from "@/types/agency";
import { createTestimonial } from "@/utils/supabase-client";
import { toast } from "sonner";

interface AddTestimonialModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (testimonial: any) => void;
  userId?: string | null;
}

export function AddTestimonialModal({
  open,
  onOpenChange,
  onSave,
  userId,
}: AddTestimonialModalProps) {
  const [clientName, setClientName] = useState("");
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
      return;
    }

    setIsLoading(true);
    
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
      }
      
      // Reset form
      setClientName("");
      setClientTitle("");
      setCompanyName("");
      setQuote("");
      setRating(5);
      setProjectType("");
      setAvatar("");
      setFeatured(false);
      
      toast.success("Testimonial added successfully");
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error("Failed to add testimonial");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Testimonial</h2>
          <button 
            onClick={() => onOpenChange && onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Add a client testimonial to showcase on your agency profile.
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientTitle">Client Title</Label>
              <Input
                id="clientTitle"
                value={clientTitle}
                onChange={(e) => setClientTitle(e.target.value)}
                placeholder="CEO"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="TechStart Inc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quote">Testimonial Quote</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Working with this agency transformed our brand identity and online presence..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="Brand Strategy & Website Redesign"
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
                      className={`h-5 w-5 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL (optional)</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to generate an avatar automatically
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="featured" className="text-sm">
              Feature this testimonial
            </Label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Testimonial"}
          </Button>
        </div>
      </div>
    </div>
  );
}
