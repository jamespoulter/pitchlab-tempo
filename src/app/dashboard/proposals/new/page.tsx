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
  DragDropIcon,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function NewProposalPage() {
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
          <Button className="gap-1">
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input id="client" placeholder="E.g., Acme Corporation" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Proposal Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid-until">Valid Until</Label>
                  <Input id="valid-until" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Executive Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Briefly describe the purpose and goals of this proposal..."
                  rows={4}
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
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-700">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Agency Overview</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DragDropIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Introduction to your agency and its core values
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-700">
                        <Award className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Credentials & Experience</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DragDropIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showcase your agency's qualifications and experience
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-700">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Relevant Case Studies</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DragDropIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Examples of similar successful projects
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-700">
                        <Users className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Team Members</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DragDropIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Key team members who will work on the project
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded text-blue-700">
                        <MessageSquareQuote className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Client Testimonials</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DragDropIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Feedback from satisfied clients
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full py-6 border-dashed flex items-center gap-2"
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
                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Agency Profile</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Basic information about your agency
                    </p>
                  </div>

                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Agency Credentials</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Certifications and qualifications
                    </p>
                  </div>

                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Services Overview</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Description of services offered
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="case-studies" className="space-y-4">
                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <FolderKanban className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">E-commerce Redesign</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fashion Retailer
                    </p>
                  </div>

                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <FolderKanban className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Social Media Campaign</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Beverage Brand
                    </p>
                  </div>

                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <FolderKanban className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">SEO Strategy</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Legal Services Firm
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Sarah Johnson</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Creative Director
                    </p>
                  </div>

                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Michael Chen</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lead Developer
                    </p>
                  </div>

                  <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Jessica Rivera</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Marketing Strategist
                    </p>
                  </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
