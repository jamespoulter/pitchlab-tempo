"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Star,
  Calendar,
  Building,
  Loader2,
<<<<<<< HEAD
=======
  User,
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTestimonialModal } from "@/components/modals/add-testimonial-modal";
<<<<<<< HEAD
import { Testimonial } from "@/types/agency";
import { getTestimonials, deleteTestimonial, createClient } from "@/utils/supabase-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
=======
import { useRouter } from "next/navigation";
import { getTestimonials, createTestimonial, deleteTestimonial } from "@/utils/supabase-client";
import { Testimonial, TestimonialFormData } from "@/types/agency";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa

export default function TestimonialsPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndTestimonials = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Error fetching user:", userError);
          toast.error("You must be logged in to view testimonials");
          return;
        }
        
        setUserId(user.id);
        
        setIsLoading(true);
        const data = await getTestimonials(user.id);
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        toast.error("Failed to load testimonials");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndTestimonials();
  }, []);

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      toast.success("Testimonial deleted successfully");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleSaveTestimonial = (newTestimonial: Testimonial) => {
    setTestimonials([newTestimonial, ...testimonials]);
    router.refresh();
=======
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(false);
  const router = useRouter();

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTestimonial = (id: string) => {
    router.push(`/dashboard/testimonials/${id}`);
  };

  const handleEditTestimonial = (id: string) => {
    router.push(`/dashboard/testimonials/${id}?edit=true`);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const { success, error } = await deleteTestimonial(id);
        if (success) {
          toast.success("Testimonial deleted successfully");
          // Refresh the testimonials list
          fetchTestimonials();
        } else {
          toast.error("Failed to delete testimonial");
          console.error("Error deleting testimonial:", error);
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  const handleSaveTestimonial = async (testimonialData: TestimonialFormData) => {
    try {
      const { success, data, error } = await createTestimonial(testimonialData);
      if (success && data) {
        toast.success("Testimonial added successfully");
        // Refresh the testimonials list
        fetchTestimonials();
      } else {
        toast.error("Failed to add testimonial");
        console.error("Error adding testimonial:", error);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error adding testimonial:", error);
    }
  };

  // Filter testimonials based on search query and featured filter
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = !searchQuery || 
      testimonial.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (testimonial.client_company && testimonial.client_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (testimonial.content && testimonial.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFeatured = !filterFeatured || testimonial.is_featured;
    
    return matchesSearch && matchesFeatured;
  });

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage client testimonials and reviews for your agency.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      <Card>
<<<<<<< HEAD
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Testimonials</CardTitle>
            <CardDescription>
              View and manage all your client testimonials.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search testimonials..."
                className="pl-8 h-9 w-[200px] md:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareQuote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No testimonials yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first client testimonial to showcase on your agency profile.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Your First Testimonial
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`border rounded-lg overflow-hidden group hover:shadow-md transition-all ${testimonial.featured ? "border-blue-500 shadow-sm" : ""}`}
                >
                  {testimonial.featured && (
                    <div className="bg-blue-500 text-white text-center py-1 text-xs font-medium">
                      FEATURED TESTIMONIAL
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={testimonial.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.client_name}`}
                          alt={testimonial.client_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {testimonial.client_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.client_position}, {testimonial.client_company}
                        </p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < (testimonial.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/testimonials/${testimonial.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/testimonials/${testimonial.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteTestimonial(testimonial.id!)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm italic">"{testimonial.content}"</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        <span>{testimonial.project_type}</span>
                      </div>
                      {testimonial.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(testimonial.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
=======
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search testimonials..."
                  className="pl-8 h-9 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-9 ${filterFeatured ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
                onClick={() => setFilterFeatured(!filterFeatured)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filterFeatured ? "Featured Only" : "All Testimonials"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`border rounded-lg overflow-hidden group hover:shadow-md transition-all ${
                    testimonial.is_featured ? "border-blue-200 bg-blue-50" : ""
                  }`}
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => handleViewTestimonial(testimonial.id!)}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {testimonial.client_image_url ? (
                        <img
                          src={testimonial.client_image_url}
                          alt={testimonial.client_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.client_name}</h3>
                        <div className="text-sm text-muted-foreground">
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
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {testimonial.rating && (
                        <div className="flex items-center mb-2">
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
                      <p className="text-sm text-gray-700 line-clamp-4">
                        "{testimonial.content}"
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {testimonial.project_name && (
                        <div className="flex items-center gap-1">
                          <MessageSquareQuote className="h-3.5 w-3.5" />
                          <span>{testimonial.project_name}</span>
                        </div>
                      )}
                      {testimonial.project_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(testimonial.project_date)}</span>
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t p-3 flex justify-between items-center bg-gray-50">
                    <div className="text-xs text-muted-foreground">
                      {testimonial.is_featured && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTestimonial(testimonial.id!)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTestimonial(testimonial.id!)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
=======
          ) : (
            <div className="text-center py-12">
              <MessageSquareQuote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No testimonials found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterFeatured
                  ? "Try adjusting your search or filters"
                  : "Add your first client testimonial to showcase on your agency profile"}
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
          )}
        </CardContent>
      </Card>

      <AddTestimonialModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveTestimonial}
<<<<<<< HEAD
        userId={userId}
=======
>>>>>>> b2150d5db3731a5110528e5d61736cb74f443aaa
      />
    </div>
  );
}
