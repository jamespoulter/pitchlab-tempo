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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Save,
  ArrowLeft,
  Plus,
  Briefcase,
  Award,
  FolderKanban,
  Users,
  MessageSquareQuote,
  GripVertical,
  Eye,
  X,
  Calendar,
  Building,
  CheckCircle,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProposalSection = {
  id: string;
  title: string;
  content: Array<{
    type: string;
    value?: string;
    items?: Array<{ label: string; value: string }>;
  }>;
};

interface ProposalData {
  id: number;
  title: string;
  client: string;
  date: string;
  validUntil: string;
  summary: string;
  sections: ProposalSection[];
  status: string;
}

export default function ProposalEditPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [proposal, setProposal] = useState<ProposalData | null>(null);

  // Fetch proposal data
  useEffect(() => {
    // This would normally fetch data from the database
    // For now, we'll use mock data
    const mockProposal: ProposalData = {
      id: parseInt(id),
      title: "Digital Marketing Strategy Proposal",
      client: "Acme Corporation",
      date: "2023-11-15",
      validUntil: "2023-12-15",
      summary:
        "This proposal outlines a comprehensive digital marketing strategy designed to increase Acme Corporation's online visibility, drive qualified traffic, and generate leads. Our approach combines SEO, content marketing, paid advertising, and social media to create a cohesive marketing ecosystem that delivers measurable results.",
      sections: [
        {
          id: "1",
          title: "Agency Overview",
          content: [
            {
              type: "text",
              value:
                "Creative Solutions is a full-service digital marketing agency specializing in brand strategy, web design, content creation, and digital advertising. We help businesses of all sizes establish a strong online presence and connect with their target audience.",
            },
            {
              type: "stats",
              items: [
                { label: "Years of Experience", value: "10+" },
                { label: "Successful Projects", value: "250+" },
                { label: "Client Retention Rate", value: "92%" },
              ],
            },
          ],
        },
        {
          id: "2",
          title: "Project Scope",
          content: [
            {
              type: "text",
              value:
                "Based on our analysis of your current digital presence and business goals, we've developed a comprehensive strategy that addresses your key challenges and leverages opportunities for growth.",
            },
            {
              type: "text",
              value:
                "Our proposed digital marketing strategy includes the following components:",
            },
            {
              type: "list",
              items: [
                { label: "Search Engine Optimization (SEO)", value: "" },
                { label: "Content Marketing", value: "" },
                { label: "Paid Advertising (PPC)", value: "" },
                { label: "Social Media Marketing", value: "" },
                { label: "Email Marketing", value: "" },
                { label: "Analytics & Reporting", value: "" },
              ],
            },
          ],
        },
        {
          id: "3",
          title: "Timeline & Deliverables",
          content: [
            {
              type: "text",
              value:
                "Our proposed timeline for implementation is structured in phases to ensure a strategic rollout of your digital marketing campaign.",
            },
            {
              type: "timeline",
              items: [
                { label: "Phase 1: Discovery & Strategy (2 weeks)", value: "" },
                { label: "Phase 2: Implementation (4 weeks)", value: "" },
                { label: "Phase 3: Optimization (Ongoing)", value: "" },
              ],
            },
          ],
        },
        {
          id: "4",
          title: "Investment",
          content: [
            {
              type: "text",
              value:
                "Our pricing is structured to provide you with a comprehensive digital marketing solution that delivers measurable results.",
            },
            {
              type: "pricing",
              items: [
                { label: "Strategy Development", value: "$3,000" },
                { label: "SEO & Content Marketing", value: "$2,500/month" },
                { label: "Paid Advertising Management", value: "$1,500/month" },
                { label: "Social Media Marketing", value: "$1,800/month" },
                { label: "Analytics & Reporting", value: "$800/month" },
              ],
            },
            {
              type: "text",
              value:
                "Total Investment: $3,000 one-time fee + $6,600/month",
            },
          ],
        },
        {
          id: "5",
          title: "Next Steps",
          content: [
            {
              type: "text",
              value:
                "To proceed with this proposal, please follow these steps:",
            },
            {
              type: "steps",
              items: [
                { label: "Review this proposal thoroughly", value: "" },
                { label: "Schedule a follow-up call to discuss any questions", value: "" },
                { label: "Sign the agreement", value: "" },
                { label: "Submit initial payment", value: "" },
                { label: "Begin the discovery phase", value: "" },
              ],
            },
            {
              type: "text",
              value:
                "We're excited about the opportunity to work with Acme Corporation and help you achieve your digital marketing goals. This proposal is valid for 30 days from the date issued.",
            },
          ],
        },
      ],
      status: "Draft",
    };

    setProposal(mockProposal);
    setIsLoading(false);
  }, [id]);

  const handleSave = () => {
    // This would normally save the data to the database
    console.log("Saving proposal:", proposal);
    alert("Proposal saved successfully!");
  };

  const handlePreview = () => {
    router.push(`/dashboard/proposals/preview?id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-xl font-semibold">Proposal not found</p>
          <p className="mt-2 text-gray-600">The proposal you're looking for doesn't exist or has been deleted.</p>
          <Link href="/dashboard/proposals">
            <Button className="mt-4">Back to Proposals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/proposals">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Proposal</h1>
            <p className="text-muted-foreground mt-1">
              Make changes to your proposal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Proposal Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Edit the basic details of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title</Label>
                  <Input
                    id="title"
                    value={proposal.title}
                    onChange={(e) => setProposal({...proposal, title: e.target.value})}
                    placeholder="Digital Marketing Strategy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={proposal.client}
                    onChange={(e) => setProposal({...proposal, client: e.target.value})}
                    placeholder="Acme Corporation"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={proposal.date}
                    onChange={(e) => setProposal({...proposal, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={proposal.validUntil}
                    onChange={(e) => setProposal({...proposal, validUntil: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Proposal Summary</Label>
                <Textarea
                  id="summary"
                  value={proposal.summary}
                  onChange={(e) => setProposal({...proposal, summary: e.target.value})}
                  placeholder="Briefly describe what this proposal is about..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={proposal.status}
                  onChange={(e) => setProposal({...proposal, status: e.target.value})}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Content</CardTitle>
              <CardDescription>
                Edit the sections and content of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {proposal.sections.map((section, index) => (
                <div key={section.id} className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <h3 className="text-lg font-medium">{section.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Content
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`section-${section.id}-title`}>Section Title</Label>
                    <Input
                      id={`section-${section.id}-title`}
                      value={section.title}
                      onChange={(e) => {
                        const updatedSections = [...proposal.sections];
                        updatedSections[index].title = e.target.value;
                        setProposal({...proposal, sections: updatedSections});
                      }}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {section.content.map((content, contentIndex) => (
                      <div key={contentIndex} className="border-t pt-4">
                        {content.type === "text" && (
                          <div className="space-y-2">
                            <Label>Text Content</Label>
                            <Textarea
                              value={content.value}
                              onChange={(e) => {
                                const updatedSections = [...proposal.sections];
                                updatedSections[index].content[contentIndex].value = e.target.value;
                                setProposal({...proposal, sections: updatedSections});
                              }}
                              rows={3}
                            />
                          </div>
                        )}
                        
                        {(content.type === "stats" || content.type === "list" || 
                          content.type === "timeline" || content.type === "pricing" || 
                          content.type === "steps") && content.items && (
                          <div className="space-y-2">
                            <Label>{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</Label>
                            <div className="space-y-2">
                              {content.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-2">
                                  <Input
                                    value={item.label}
                                    onChange={(e) => {
                                      const updatedSections = [...proposal.sections];
                                      updatedSections[index].content[contentIndex].items![itemIndex].label = e.target.value;
                                      setProposal({...proposal, sections: updatedSections});
                                    }}
                                    placeholder="Label"
                                    className="flex-1"
                                  />
                                  {content.type === "pricing" && (
                                    <Input
                                      value={item.value}
                                      onChange={(e) => {
                                        const updatedSections = [...proposal.sections];
                                        updatedSections[index].content[contentIndex].items![itemIndex].value = e.target.value;
                                        setProposal({...proposal, sections: updatedSections});
                                      }}
                                      placeholder="Value"
                                      className="w-32"
                                    />
                                  )}
                                  <Button variant="ghost" size="sm" className="text-red-500 h-9 w-9 p-0">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button variant="outline" size="sm" className="mt-2">
                                <Plus className="h-3 w-3 mr-1" />
                                Add Item
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="w-full h-20 bg-blue-600 rounded-md"></div>
                      <span className="text-sm">Modern Blue</span>
                    </div>
                    <div className="border rounded-md p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="w-full h-20 bg-emerald-600 rounded-md"></div>
                      <span className="text-sm">Professional Green</span>
                    </div>
                    <div className="border rounded-md p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="w-full h-20 bg-purple-600 rounded-md"></div>
                      <span className="text-sm">Creative Purple</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="rounded-full bg-muted p-2">
                        <Upload className="h-4 w-4" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Recommended size: 1200 x 600px
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Font</Label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                    <option value="inter">Inter</option>
                    <option value="montserrat">Montserrat</option>
                    <option value="roboto">Roboto</option>
                    <option value="opensans">Open Sans</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Settings</CardTitle>
              <CardDescription>
                Configure additional settings for your proposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableTracking"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="enableTracking">Enable view tracking</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableSignature"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="enableSignature">Enable digital signature</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enablePayment"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="enablePayment">Enable online payment</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDays">Proposal Expiry (days)</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    defaultValue="30"
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reminderDays">Send reminder after (days)</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    defaultValue="7"
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 