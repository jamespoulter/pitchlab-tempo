"use client";

import { useState, useRef } from "react";
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
import { ArrowLeft, Save, Star, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTestimonial, uploadTestimonialClientImage } from "@/utils/supabase-client";
import { TestimonialFormData } from "@/types/agency";
import { toast } from "sonner";

export default function AddTestimonialPage() {
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | undefined>(5);
  const [projectName, setProjectName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [clientImageUrl, setClientImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !content) {
      toast.error("Client name and testimonial content are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const testimonialData: TestimonialFormData = {
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
      
      const { success, data, error } = await createTestimonial(testimonialData);
      
      if (success && data) {
        toast.success("Testimonial added successfully");
        router.push("/dashboard/testimonials");
      } else {
        console.error("Error adding testimonial:", error);
        toast.error("Failed to add testimonial");
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error("An error occurred while adding the testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/testimonials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Testimonials
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Testimonial</CardTitle>
          <CardDescription>
            Add a client testimonial to showcase on your agency profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
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
                
                <div className="space-y-2">
                  <Label htmlFor="clientCompany">Company Name</Label>
                  <Input
                    id="clientCompany"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="Acme Inc."
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Website Redesign"
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
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content">Testimonial Content <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Working with this agency transformed our brand identity and online presence..."
                    className="min-h-[150px]"
                    required
                    disabled={isSubmitting}
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
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/testimonials")}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!clientName || !content || isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Testimonial
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
