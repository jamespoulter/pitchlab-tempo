"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  CheckCircle,
  Briefcase,
  Award,
  Users,
  MessageSquare,
  FileText,
  Filter,
} from "lucide-react";

interface ContentSelectionModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (selectedItems: any[]) => void;
  contentType:
    | "case-studies"
    | "team"
    | "services"
    | "testimonials"
    | "credentials";
  initialSelected?: any[];
}

export function ContentSelectionModal({
  open,
  onOpenChange,
  onSelect,
  contentType,
  initialSelected = [],
}: ContentSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>(initialSelected);

  // Mock data for different content types
  const mockData: Record<string, any[]> = {
    "case-studies": [
      {
        id: "1",
        title: "E-commerce Redesign",
        client: "Fashion Retailer",
        industry: "E-commerce",
        image:
          "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
      },
      {
        id: "2",
        title: "B2B Lead Generation",
        client: "Software Company",
        industry: "Technology",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      },
      {
        id: "3",
        title: "Brand Refresh",
        client: "Financial Services",
        industry: "Finance",
        image:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      },
    ],
    team: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Creative Director",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        id: "2",
        name: "Michael Chen",
        role: "Lead Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        id: "3",
        name: "Jessica Rivera",
        role: "Marketing Strategist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      },
    ],
    services: [
      {
        id: "1",
        name: "Brand Strategy & Identity",
        category: "Branding",
        icon: "🎨",
      },
      {
        id: "2",
        name: "Website Design & Development",
        category: "Web",
        icon: "💻",
      },
      {
        id: "3",
        name: "Digital Marketing Campaign",
        category: "Marketing",
        icon: "📊",
      },
    ],
    testimonials: [
      {
        id: "1",
        clientName: "John Smith",
        clientTitle: "CEO",
        companyName: "Acme Inc.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      },
      {
        id: "2",
        clientName: "Sarah Johnson",
        clientTitle: "Marketing Director",
        companyName: "Retail Chain Co.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        id: "3",
        clientName: "David Lee",
        clientTitle: "Founder",
        companyName: "Tech Startup",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
    ],
    credentials: [
      {
        id: "1",
        title: "Google Ads Certification",
        issuer: "Google",
        image:
          "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      },
      {
        id: "2",
        title: "Facebook Blueprint Certification",
        issuer: "Meta",
        image:
          "https://api.dicebear.com/7.x/initials/svg?seed=FB&backgroundColor=1877F2&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      },
      {
        id: "3",
        title: "HubSpot Inbound Marketing",
        issuer: "HubSpot Academy",
        image:
          "https://api.dicebear.com/7.x/initials/svg?seed=HS&backgroundColor=FF7A59&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      },
    ],
  };

  const items = mockData[contentType] || [];

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    const searchFields = {
      "case-studies": [item.title, item.client, item.industry],
      team: [item.name, item.role],
      services: [item.name, item.category],
      testimonials: [item.clientName, item.companyName],
      credentials: [item.title, item.issuer],
    };

    const fieldsToSearch = searchFields[contentType] || [];
    return fieldsToSearch.some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  const toggleItemSelection = (item: any) => {
    if (selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id),
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const isItemSelected = (item: any) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  const handleSave = () => {
    if (onSelect) {
      onSelect(selectedItems);
    }

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case "case-studies":
        return <Briefcase className="h-5 w-5" />;
      case "team":
        return <Users className="h-5 w-5" />;
      case "services":
        return <FileText className="h-5 w-5" />;
      case "testimonials":
        return <MessageSquare className="h-5 w-5" />;
      case "credentials":
        return <Award className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getContentTypeTitle = () => {
    switch (contentType) {
      case "case-studies":
        return "Case Studies";
      case "team":
        return "Team Members";
      case "services":
        return "Services";
      case "testimonials":
        return "Testimonials";
      case "credentials":
        return "Credentials";
      default:
        return "Content";
    }
  };

  const renderItem = (item: any) => {
    switch (contentType) {
      case "case-studies":
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.client} • {item.industry}
              </p>
            </div>
          </div>
        );
      case "team":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.role}</p>
            </div>
          </div>
        );
      case "services":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{item.icon}</span>
            </div>
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
          </div>
        );
      case "testimonials":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={item.avatar}
                alt={item.clientName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{item.clientName}</p>
              <p className="text-sm text-muted-foreground">
                {item.clientTitle}, {item.companyName}
              </p>
            </div>
          </div>
        );
      case "credentials":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.issuer}</p>
            </div>
          </div>
        );
      default:
        return <p>{JSON.stringify(item)}</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getContentTypeIcon()}
            <span>Select {getContentTypeTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            Choose items to include in your proposal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${getContentTypeTitle().toLowerCase()}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="border rounded-md divide-y max-h-[50vh] overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${isItemSelected(item) ? "bg-blue-50" : ""}`}
                  onClick={() => toggleItemSelection(item)}
                >
                  {renderItem(item)}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${isItemSelected(item) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                    >
                      {isItemSelected(item) && (
                        <CheckCircle className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  No items found matching your search.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedItems.length}{" "}
              {selectedItems.length === 1 ? "item" : "items"} selected
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setSelectedItems([])}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Add to Proposal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
