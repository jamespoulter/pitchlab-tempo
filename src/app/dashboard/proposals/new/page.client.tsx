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
} from "lucide-react";
import Link from "next/link";

type ProposalSection = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
};

type ContentItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  type: string;
};

export default function NewProposalPageClient() {
  // State for proposal details
  const [proposalTitle, setProposalTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [proposalDate, setProposalDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [summary, setSummary] = useState("");

  // State for proposal sections
  const [sections, setSections] = useState<ProposalSection[]>([
    {
      id: "1",
      icon: <Briefcase className="h-4 w-4" />,
      title: "Agency Overview",
      description: "Introduction to your agency and its core values",
      isActive: true,
    },
    {
      id: "2",
      icon: <Award className="h-4 w-4" />,
      title: "Credentials & Experience",
      description: "Showcase your agency's qualifications and experience",
      isActive: false,
    },
    {
      id: "3",
      icon: <FolderKanban className="h-4 w-4" />,
      title: "Relevant Case Studies",
      description: "Examples of similar successful projects",
      isActive: false,
    },
    {
      id: "4",
      icon: <Users className="h-4 w-4" />,
      title: "Team Members",
      description: "Key team members who will work on the project",
      isActive: false,
    },
    {
      id: "5",
      icon: <MessageSquareQuote className="h-4 w-4" />,
      title: "Client Testimonials",
      description: "Feedback from satisfied clients",
      isActive: false,
    },
  ]);

  // Content library items
  const contentLibrary = {
    agency: [
      {
        id: "a1",
        icon: <Briefcase className="h-4 w-4 text-blue-600" />,
        title: "Agency Profile",
        description: "Basic information about your agency",
        type: "agency",
      },
      {
        id: "a2",
        icon: <Award className="h-4 w-4 text-blue-600" />,
        title: "Agency Credentials",
        description: "Certifications and qualifications",
        type: "agency",
      },
      {
        id: "a3",
        icon: <Briefcase className="h-4 w-4 text-blue-600" />,
        title: "Services Overview",
        description: "Description of services offered",
        type: "agency",
      },
    ],
    caseStudies: [
      {
        id: "c1",
        icon: <FolderKanban className="h-4 w-4 text-blue-600" />,
        title: "E-commerce Redesign",
        description: "Fashion Retailer",
        type: "case-study",
      },
      {
        id: "c2",
        icon: <FolderKanban className="h-4 w-4 text-blue-600" />,
        title: "Social Media Campaign",
        description: "Beverage Brand",
        type: "case-study",
      },
      {
        id: "c3",
        icon: <FolderKanban className="h-4 w-4 text-blue-600" />,
        title: "SEO Strategy",
        description: "Legal Services Firm",
        type: "case-study",
      },
    ],
    team: [
      {
        id: "t1",
        icon: <Users className="h-4 w-4 text-blue-600" />,
        title: "Sarah Johnson",
        description: "Creative Director",
        type: "team",
      },
      {
        id: "t2",
        icon: <Users className="h-4 w-4 text-blue-600" />,
        title: "Michael Chen",
        description: "Lead Developer",
        type: "team",
      },
      {
        id: "t3",
        icon: <Users className="h-4 w-4 text-blue-600" />,
        title: "Jessica Rivera",
        description: "Marketing Strategist",
        type: "team",
      },
    ],
  };

  // State for selected content items
  const [selectedContent, setSelectedContent] = useState<ContentItem[]>([]);

  // Function to toggle section active state
  const toggleSectionActive = (id: string) => {
    setSections(
      sections.map((section) =>
        section.id === id
          ? { ...section, isActive: !section.isActive }
          : section,
      ),
    );
  };

  // Function to add a new section
  const addSection = () => {
    const newId = String(sections.length + 1);
    setSections([
      ...sections,
      {
        id: newId,
        icon: <FileText className="h-4 w-4" />,
        title: "New Section",
        description: "Click to edit this section",
        isActive: false,
      },
    ]);
  };

  // Function to remove a section
  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  // Function to move a section up or down
  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((section) => section.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return; // Can't move further
    }

    const newSections = [...sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];
    setSections(newSections);
  };

  // Function to add content to proposal
  const addContentToProposal = (item: ContentItem) => {
    setSelectedContent([...selectedContent, item]);
  };

  // Function to save the proposal
  const saveProposal = () => {
    const proposal = {
      title: proposalTitle,
      client: clientName,
      date: proposalDate,
      validUntil,
      summary,
      sections: sections.filter((section) => section.isActive),
      content: selectedContent,
    };

    console.log("Saving proposal:", proposal);
    alert("Proposal saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/proposals">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Proposal
            </h1>
            <p className="text-muted-foreground mt-1">
              Build a professional proposal by selecting content from your
              directories.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
          <Button className="gap-1" onClick={saveProposal}>
            <Save className="h-4 w-4" />
            <span>Save Proposal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
              <CardDescription>
                Basic information about your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g., Digital Marketing Strategy"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    placeholder="E.g., Acme Corporation"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Proposal Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid-until">Valid Until</Label>
                  <Input
                    id="valid-until"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Executive Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Briefly describe the purpose and goals of this proposal..."
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Builder</CardTitle>
              <CardDescription>
                Drag and drop sections to organize your proposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`border rounded-md p-4 ${section.isActive ? "bg-gray-50" : ""}`}
                    onClick={() => toggleSectionActive(section.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded text-blue-700">
                          {section.icon}
                        </div>
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(section.id, "up");
                          }}
                        >
                          <ArrowLeft className="h-4 w-4 rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(section.id, "down");
                          }}
                        >
                          <ArrowLeft className="h-4 w-4 -rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSection(section.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                    {section.isActive &&
                      selectedContent.filter((item) =>
                        item.id.startsWith(section.id.charAt(0)),
                      ).length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-medium mb-2">
                            Selected Content:
                          </p>
                          <div className="space-y-2">
                            {selectedContent
                              .filter((item) =>
                                item.id.startsWith(section.id.charAt(0)),
                              )
                              .map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between bg-white p-2 rounded border text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span>{item.title}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      setSelectedContent(
                                        selectedContent.filter(
                                          (i) => i !== item,
                                        ),
                                      )
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full py-6 border-dashed flex items-center gap-2"
                  onClick={addSection}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Section</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                Select content from your directories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="agency">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="agency">Agency</TabsTrigger>
                  <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                <TabsContent value="agency" className="space-y-4">
                  {contentLibrary.agency.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => addContentToProposal(item)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {item.icon}
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="case-studies" className="space-y-4">
                  {contentLibrary.caseStudies.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => addContentToProposal(item)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {item.icon}
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  {contentLibrary.team.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => addContentToProposal(item)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {item.icon}
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Settings</CardTitle>
              <CardDescription>Configure your proposal options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <select
                  id="template"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <select
                  id="color-scheme"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-method">Delivery Method</Label>
                <select
                  id="delivery-method"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  <option value="email">Email</option>
                  <option value="link">Shareable Link</option>
                  <option value="pdf">PDF Download</option>
                </select>
              </div>

              <div className="pt-4 border-t mt-4">
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/dashboard/proposals/pricing")
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
