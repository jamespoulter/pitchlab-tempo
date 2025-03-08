"use client";

import { useState } from "react";
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

export default function CaseStudiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();
  
  // This would normally fetch real data from the database
  const caseStudies = [
    {
      id: 1,
      title: "E-commerce Redesign Boosts Conversion by 45%",
      client: "Fashion Retailer",
      industry: "E-commerce",
      date: "2023-09-15",
      image:
        "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
      tags: ["Web Design", "UX/UI", "Conversion Optimization"],
    },
    {
      id: 2,
      title: "Social Media Campaign Increases Engagement by 78%",
      client: "Beverage Brand",
      industry: "Food & Beverage",
      date: "2023-08-22",
      image:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
      tags: ["Social Media", "Content Strategy", "Brand Awareness"],
    },
    {
      id: 3,
      title: "SEO Strategy Drives 112% Increase in Organic Traffic",
      client: "Legal Services Firm",
      industry: "Legal",
      date: "2023-07-10",
      image:
        "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80",
      tags: ["SEO", "Content Marketing", "Analytics"],
    },
    {
      id: 4,
      title: "Brand Refresh Leads to 30% Market Share Growth",
      client: "Tech Startup",
      industry: "Technology",
      date: "2023-06-05",
      image:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80",
      tags: ["Branding", "Design", "Strategy"],
    },
    {
      id: 5,
      title: "Video Marketing Campaign Achieves 2.5M Views",
      client: "Nonprofit Organization",
      industry: "Nonprofit",
      date: "2023-05-18",
      image:
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=80",
      tags: ["Video Production", "Social Media", "Campaign Management"],
    },
    {
      id: 6,
      title: "Email Automation Increases Customer Retention by 35%",
      client: "SaaS Company",
      industry: "Software",
      date: "2023-04-12",
      image:
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
      tags: ["Email Marketing", "Automation", "CRM"],
    },
  ];

  const handleViewCaseStudy = (id: number) => {
    router.push(`/dashboard/case-studies/${id}`);
  };

  const handleEditCaseStudy = (id: number) => {
    router.push(`/dashboard/case-studies/${id}?edit=true`);
  };

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
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={caseStudy.image}
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
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Case Study
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddCaseStudyModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={(caseStudy) => {
          console.log("New case study:", caseStudy);
          // Here you would normally save the data to your database
        }}
      />
    </div>
  );
}
