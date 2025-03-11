"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState, useEffect, useRef } from "react";
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
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
  Mail,
  Phone,
  Star,
  MessageSquare,
  Briefcase,
  Share,
  Copy,
<<<<<<< HEAD
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Testimonial } from "@/types/agency";
import { getTestimonialById } from "@/utils/supabase-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
=======
  Trash,
  Save,
  User,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getTestimonialById, updateTestimonial, deleteTestimonial, uploadTestimonialClientImage } from "@/utils/supabase-client";
import { Testimonial, TestimonialFormData } from "@/types/agency";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa

export default function TestimonialDetailPage({
  params,
}: {
  params: { id: string };
}) {
<<<<<<< HEAD
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setIsLoading(true);
        const data = await getTestimonialById(params.id);
        setTestimonial(data);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
        toast.error("Failed to load testimonial");
        router.push("/dashboard/testimonials");
=======
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | undefined>(5);
  const [projectName, setProjectName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [clientImageUrl, setClientImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if we should start in edit mode
  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);
  
  // Fetch testimonial data
  useEffect(() => {
    const fetchTestimonial = async () => {
      setIsLoading(true);
      try {
        const data = await getTestimonialById(params.id);
        setTestimonial(data);
        
        // Set form values
        if (data) {
          setClientName(data.client_name);
          setClientRole(data.client_role || "");
          setClientCompany(data.client_company || "");
          setContent(data.content);
          setRating(data.rating);
          setProjectName(data.project_name || "");
          setProjectDate(data.project_date || "");
          setClientImageUrl(data.client_image_url || "");
          setIsFeatured(data.is_featured || false);
        }
      } catch (error) {
        console.error("Error fetching testimonial:", error);
        toast.error("Failed to load testimonial");
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
      } finally {
        setIsLoading(false);
      }
    };
<<<<<<< HEAD

    fetchTestimonial();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
=======
    
    fetchTestimonial();
  }, [params.id]);
  
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
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedData: Partial<TestimonialFormData> = {
        client_name: clientName,
        client_role: clientRole,
        client_company: clientCompany,
        content,
        rating,
        project_name: projectName,
        project_date: projectDate,
        client_image_url: clientImageUrl,
        is_featured: isFeatured,
      };
      
      const { success, data, error } = await updateTestimonial(params.id, updatedData);
      
      if (success && data) {
        setTestimonial(data);
        setIsEditing(false);
        toast.success("Testimonial updated successfully");
      } else {
        console.error("Error updating testimonial:", error);
        toast.error("Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("An error occurred while updating the testimonial");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
      setIsDeleting(true);
      
      try {
        const { success, error } = await deleteTestimonial(params.id);
        
        if (success) {
          toast.success("Testimonial deleted successfully");
          router.push("/dashboard/testimonials");
        } else {
          console.error("Error deleting testimonial:", error);
          toast.error("Failed to delete testimonial");
        }
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        toast.error("An error occurred while deleting the testimonial");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
<<<<<<< HEAD

  if (!testimonial) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Testimonial not found</h3>
        <p className="text-muted-foreground mb-4">
          The testimonial you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard/testimonials">Back to Testimonials</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/testimonials">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Testimonials</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Testimonial Details
          </h1>
          <p className="text-muted-foreground mt-1">
            {testimonial.client_company} • {testimonial.project_type}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button asChild className="gap-1">
            <Link href={`/dashboard/testimonials/${testimonial.id}/edit`}>
              <Edit className="h-4 w-4" />
              <span>Edit</span>
=======
  
  if (!testimonial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/testimonials">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Testimonials
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Testimonial Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The testimonial you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link href="/dashboard/testimonials">
                Return to Testimonials
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/testimonials">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Testimonials
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Client Testimonial</CardTitle>
            <CardDescription>
              Detailed view of the client testimonial and feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {testimonial.featured && (
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                Featured Testimonial
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={testimonial.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.client_name}`}
                  alt={testimonial.client_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.client_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.client_position}, {testimonial.client_company}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (testimonial.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {testimonial.rating}/5
                  </span>
                </div>
              </div>
            </div>

            <blockquote className="border-l-4 border-gray-200 pl-4 italic">
              "{testimonial.content}"
            </blockquote>

            {testimonial.date && (
              <div className="text-sm text-muted-foreground">
                Testimonial received on{" "}
                {new Date(testimonial.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            {testimonial.project_details?.results && testimonial.project_details.results.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Project Results</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {testimonial.project_details.results.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonial.project_details?.services && testimonial.project_details.services.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Services Provided</h4>
                  <div className="flex flex-wrap gap-1">
                    {testimonial.project_details.services.map((service, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testimonial.related_case_studies && testimonial.related_case_studies.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Case studies related to this testimonial
                  </h4>
                  <ul className="space-y-2">
                    {testimonial.related_case_studies.map((caseStudy, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{caseStudy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{testimonial.client_company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{testimonial.project_type}</span>
              </div>
              {testimonial.contact_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{testimonial.contact_info.email}</span>
                </div>
              )}
              {testimonial.contact_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{testimonial.contact_info.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonial.project_details?.start_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Start Date
                  </span>
                  <span className="font-medium">
                    {new Date(
                      testimonial.project_details.start_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {testimonial.project_details?.end_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="font-medium">
                    {new Date(
                      testimonial.project_details.end_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Testimonial Date:</span>
                <span>{testimonial.date ? new Date(testimonial.date).toLocaleDateString() : "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
=======
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Testimonial" : "Testimonial Details"}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Update the client testimonial information" 
              : "View detailed information about this client testimonial"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="John Smith"
                    required
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientRole">Client Title/Role</Label>
                  <Input
                    id="clientRole"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="CEO"
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientCompany">Company Name</Label>
                <Input
                  id="clientCompany"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Acme Inc."
                  disabled={isSaving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Working with this agency transformed our brand identity..."
                  className="min-h-[150px]"
                  required
                  disabled={isSaving}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Website Redesign"
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDate">Project Date</Label>
                  <Input
                    id="projectDate"
                    type="date"
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    disabled={isSaving}
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
                      disabled={isSaving}
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
                    disabled={isSaving || isUploading}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                    disabled={isSaving || isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving || isUploading}
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
                  disabled={isSaving}
                />
                <Label htmlFor="isFeatured" className="text-sm">
                  Feature this testimonial
                </Label>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {testimonial.client_image_url ? (
                  <img
                    src={testimonial.client_image_url}
                    alt={testimonial.client_name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold">{testimonial.client_name}</h2>
                  <div className="text-muted-foreground">
                    {testimonial.client_role && (
                      <span>{testimonial.client_role}</span>
                    )}
                    {testimonial.client_role && testimonial.client_company && (
                      <span> • </span>
                    )}
                    {testimonial.client_company && (
                      <span>{testimonial.client_company}</span>
                    )}
                  </div>
                  {testimonial.rating && (
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {testimonial.is_featured && (
                  <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="italic text-gray-700">"{testimonial.content}"</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Project</p>
                  <p>{testimonial.project_name || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{testimonial.project_date ? formatDate(testimonial.project_date) : "Not specified"}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p>{formatDate(testimonial.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>{formatDate(testimonial.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
    </div>
  );
}
