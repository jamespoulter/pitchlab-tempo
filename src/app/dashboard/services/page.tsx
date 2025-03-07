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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddServiceModal } from "@/components/modals/add-service-modal";

export default function ServicesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // This would normally fetch real data from the database
  const services = [
    {
      id: 1,
      name: "Brand Strategy & Identity",
      description:
        "Comprehensive brand development including positioning, messaging, visual identity, and guidelines.",
      features: [
        "Brand Audit & Research",
        "Positioning & Messaging",
        "Visual Identity Design",
        "Brand Guidelines",
      ],
      priceRange: "$5,000 - $15,000",
      timeline: "4-6 weeks",
      category: "Branding",
      icon: "🎨",
    },
    {
      id: 2,
      name: "Website Design & Development",
      description:
        "Custom website design and development with a focus on user experience, performance, and conversion.",
      features: [
        "UX/UI Design",
        "Responsive Development",
        "CMS Integration",
        "Performance Optimization",
      ],
      priceRange: "$10,000 - $30,000",
      timeline: "8-12 weeks",
      category: "Web",
      icon: "💻",
    },
    {
      id: 3,
      name: "Digital Marketing Campaign",
      description:
        "Strategic digital marketing campaigns across multiple channels to drive awareness, engagement, and conversions.",
      features: [
        "Campaign Strategy",
        "Content Creation",
        "Channel Management",
        "Performance Analytics",
      ],
      priceRange: "$3,000 - $10,000/month",
      timeline: "Ongoing",
      category: "Marketing",
      icon: "📈",
    },
    {
      id: 4,
      name: "Search Engine Optimization",
      description:
        "Comprehensive SEO services to improve organic visibility, traffic, and rankings.",
      features: [
        "Technical SEO Audit",
        "Keyword Research",
        "On-page Optimization",
        "Link Building",
      ],
      priceRange: "$2,000 - $5,000/month",
      timeline: "Ongoing",
      category: "Marketing",
      icon: "🔍",
    },
    {
      id: 5,
      name: "Social Media Management",
      description:
        "Strategic social media management to build brand awareness, engagement, and community.",
      features: [
        "Channel Strategy",
        "Content Calendar",
        "Community Management",
        "Performance Reporting",
      ],
      priceRange: "$1,500 - $4,000/month",
      timeline: "Ongoing",
      category: "Marketing",
      icon: "📱",
    },
    {
      id: 6,
      name: "Content Marketing",
      description:
        "Strategic content creation and distribution to attract, engage, and convert your target audience.",
      features: [
        "Content Strategy",
        "Blog Writing",
        "Lead Magnets",
        "Email Newsletters",
      ],
      priceRange: "$2,000 - $6,000/month",
      timeline: "Ongoing",
      category: "Marketing",
      icon: "✍️",
    },
  ];

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
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option value="all">All Categories</option>
                <option value="branding">Branding</option>
                <option value="web">Web</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="p-6">
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
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
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
                  <Button variant="outline" size="sm">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    Add to Proposal
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            <div className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Add New Service</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Showcase your agency's offerings
                </p>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Packages</CardTitle>
          <CardDescription>
            Create bundled service packages for common client needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Startup Launch Package",
                description:
                  "Everything a new business needs to establish their brand and online presence.",
                services: [
                  "Brand Strategy & Identity",
                  "Website Design & Development",
                  "Social Media Setup",
                ],
                price: "$15,000",
                popular: false,
              },
              {
                name: "Growth Accelerator",
                description:
                  "Comprehensive marketing package to drive growth for established businesses.",
                services: [
                  "Digital Marketing Campaign",
                  "Search Engine Optimization",
                  "Content Marketing",
                ],
                price: "$5,000/month",
                popular: true,
              },
              {
                name: "Brand Refresh",
                description:
                  "Revitalize your existing brand with updated visuals and messaging.",
                services: [
                  "Brand Audit",
                  "Visual Identity Update",
                  "Messaging Refinement",
                ],
                price: "$8,000",
                popular: false,
              },
            ].map((pkg, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden ${pkg.popular ? "border-blue-500 shadow-md" : ""}`}
              >
                {pkg.popular && (
                  <div className="bg-blue-500 text-white text-center py-1 text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pkg.description}
                  </p>
                  <div className="space-y-3 mb-6">
                    {pkg.services.map((service, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-4">{pkg.price}</div>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Proposal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-1" />
              Create New Package
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddServiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={(service) => {
          console.log("New service:", service);
          // Here you would normally save the data to your database
        }}
      />
    </div>
  );
}
