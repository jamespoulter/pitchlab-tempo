"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddServiceModal } from "@/components/modals/add-service-modal";
import { useRouter } from "next/navigation";
import { getServices, deleteService, createService } from "@/utils/supabase-client";
import { Service } from "@/types/agency";
import { toast } from "sonner";

export default function ServicesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewService = (id: string) => {
    router.push(`/dashboard/services/${id}`);
  };

  const handleEditService = (id: string) => {
    router.push(`/dashboard/services/${id}?edit=true`);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const { success, error } = await deleteService(id);
        if (success) {
          toast.success("Service deleted successfully");
          // Refresh the services list
          fetchServices();
        } else {
          toast.error("Failed to delete service");
          console.error("Error deleting service:", error);
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleSaveService = async (serviceData: any) => {
    try {
      console.log("Services page received service data:", JSON.stringify(serviceData, null, 2));
      
      const { success, data, error } = await createService(serviceData);
      
      if (success && data) {
        toast.success("Service added successfully");
        // Refresh the services list
        fetchServices();
        return true;
      } else {
        console.error("Error adding service:", error);
        toast.error(error?.message || "Failed to add service");
        return false;
      }
    } catch (error) {
      console.error("Unexpected error adding service:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  // Filter services based on search query and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || 
      service.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for the filter dropdown
  const categories = ["all", ...Array.from(new Set(services.map(service => service.category.toLowerCase())))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's service offerings and packages.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search services..."
                  className="pl-8 h-9 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories
                  .filter(cat => cat !== "all")
                  .map((category, index) => (
                    <option key={index} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => handleViewService(service.id!)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{service.icon}</div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="space-y-3 mb-4">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <div className="text-sm text-blue-600">
                          +{service.features.length - 4} more features
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm border-t pt-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{service.priceRange}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.timeline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-3 flex justify-between items-center bg-gray-50">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewService(service.id!)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditService(service.id!)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewService(service.id!)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteService(service.id!)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              <div 
                className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full cursor-pointer hover:bg-gray-50"
                onClick={() => setIsAddModalOpen(true)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Add New Service</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showcase your agency's offerings
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Service
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Services Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add your first service to showcase your agency's offerings and expertise.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddServiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveService}
      />
    </div>
  );
}
