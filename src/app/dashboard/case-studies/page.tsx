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
  FolderKanban,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  Edit,
  Copy,
  Trash,
  Eye,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCaseStudyModal } from "@/components/modals/add-case-study-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCaseStudies, deleteCaseStudy } from "@/utils/supabase-client";
import { CaseStudy } from "@/types/agency";
import { toast } from "@/components/ui/use-toast";

export default function CaseStudiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const router = useRouter();
  
  // Fetch case studies on component mount
  useEffect(() => {
    const fetchCaseStudies = async () => {
      setIsLoading(true);
      try {
        const data = await getCaseStudies();
        setCaseStudies(data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
        toast({
          title: "Error",
          description: "Failed to load case studies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCaseStudies();
  }, []);
  
  const handleViewCaseStudy = (id: string) => {
    router.push(`/dashboard/case-studies/${id}`);
  };

  const handleEditCaseStudy = (id: string) => {
    router.push(`/dashboard/case-studies/${id}?edit=true`);
  };
  
  const handleDeleteCaseStudy = async (id: string) => {
    if (confirm("Are you sure you want to delete this case study? This action cannot be undone.")) {
      try {
        const { success, error } = await deleteCaseStudy(id);
        if (success) {
          setCaseStudies(caseStudies.filter(study => study.id !== id));
          toast({
            title: "Success",
            description: "Case study deleted successfully.",
          });
        } else {
          throw error;
        }
      } catch (error) {
        console.error("Error deleting case study:", error);
        toast({
          title: "Error",
          description: "Failed to delete case study. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDuplicateCaseStudy = (caseStudy: CaseStudy) => {
    // Remove id and timestamps for duplication
    const { id, user_id, created_at, updated_at, ...caseStudyData } = caseStudy;
    router.push(`/dashboard/case-studies/add?duplicate=true&data=${encodeURIComponent(JSON.stringify(caseStudyData))}`);
  };
  
  // Filter and sort case studies
  const filteredAndSortedCaseStudies = caseStudies
    .filter(study => 
      searchQuery === "" || 
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground mt-1">
            Showcase your agency's successful client projects.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Case Study</span>
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
                  placeholder="Search case studies..."
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
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAndSortedCaseStudies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">No case studies found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search query" : "Add your first case study to showcase your work"}
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Case Study
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCaseStudies.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={caseStudy.image_url || "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80"}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleViewCaseStudy(caseStudy.id)}
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {caseStudy.industry}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCaseStudy(caseStudy.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCaseStudy(caseStudy.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateCaseStudy(caseStudy)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCaseStudy(caseStudy.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold mb-1 line-clamp-2">
                      {caseStudy.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {caseStudy.client}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {caseStudy.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(caseStudy.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Add New Case Study</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showcase your agency's work
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Case Study
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddCaseStudyModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={(newCaseStudy) => {
          setCaseStudies([newCaseStudy, ...caseStudies]);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
