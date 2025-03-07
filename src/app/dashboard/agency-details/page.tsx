import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit,
  Upload,
  Plus,
} from "lucide-react";

export default function AgencyDetailsPage() {
  // This would normally fetch real data from the database
  const agencyDetails = {
    name: "Creative Solutions Agency",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
    address: "123 Marketing Street, San Francisco, CA 94103",
    website: "www.creativesolutions.com",
    email: "info@creativesolutions.com",
    phone: "+1 (555) 123-4567",
    description:
      "Creative Solutions is a full-service digital marketing agency specializing in brand strategy, web design, content creation, and digital advertising. We help businesses of all sizes establish a strong online presence and connect with their target audience.",
    founded: "2015",
    employees: "25-50",
    industries: ["Technology", "E-commerce", "Healthcare", "Education"],
    socialMedia: {
      linkedin: "creativesolutions",
      twitter: "@creativesolutions",
      instagram: "@creativesolutions",
      facebook: "creativesolutionsagency",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's profile information and branding assets.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          <span>Edit Details</span>
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Agency Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Agency Profile</CardTitle>
              <CardDescription>Your agency's basic information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center mb-4">
                    <img
                      src={agencyDetails.logo}
                      alt={agencyDetails.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 mt-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Change Logo</span>
                  </Button>
                </div>

                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Agency Name
                      </p>
                      <p className="font-medium">{agencyDetails.name}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Founded
                      </p>
                      <p>{agencyDetails.founded}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Address
                      </p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p>{agencyDetails.address}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Team Size
                      </p>
                      <p>{agencyDetails.employees}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Website
                      </p>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <p>{agencyDetails.website}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p>{agencyDetails.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p>{agencyDetails.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Agency Description</CardTitle>
              <CardDescription>
                A detailed description of your agency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6">{agencyDetails.description}</p>
            </CardContent>
          </Card>

          {/* Industries Card */}
          <Card>
            <CardHeader>
              <CardTitle>Industries Served</CardTitle>
              <CardDescription>
                The main industries your agency specializes in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {agencyDetails.industries.map((industry, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {industry}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Industry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Card */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Your agency's social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(agencyDetails.socialMedia).map(
                  ([platform, handle]) => (
                    <div
                      key={platform}
                      className="flex items-center gap-3 p-3 border rounded-md"
                    >
                      <div className="bg-blue-50 p-2 rounded-md">
                        <getSocialIcon platform={platform} />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {platform}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {handle}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>
                Your agency's brand colors, typography, and guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Brand Colors */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Brand Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { name: "Primary", color: "#0369a1" },
                      { name: "Secondary", color: "#0e7490" },
                      { name: "Accent", color: "#0284c7" },
                      { name: "Text", color: "#1e293b" },
                      { name: "Background", color: "#f8fafc" },
                    ].map((color, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-16 h-16 rounded-md mb-2"
                          style={{ backgroundColor: color.color }}
                        ></div>
                        <p className="text-xs font-medium">{color.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {color.color}
                        </p>
                      </div>
                    ))}
                    <div className="text-center flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-16 w-16 rounded-md"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Typography</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground mb-2">
                        Headings: Montserrat
                      </p>
                      <p className="text-3xl font-bold">This is a heading</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground mb-2">
                        Body: Inter
                      </p>
                      <p className="text-base">
                        This is body text that would be used throughout your
                        proposals and marketing materials. It should be highly
                        readable and complement your heading font.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logo Variations */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Logo Variations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <div className="w-32 h-32 bg-white rounded-md flex items-center justify-center mb-2">
                        <img
                          src={agencyDetails.logo}
                          alt="Primary Logo"
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                      <p className="text-sm font-medium">Primary Logo</p>
                    </div>
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-900 rounded-md flex items-center justify-center mb-2">
                        <img
                          src={agencyDetails.logo}
                          alt="Inverse Logo"
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                      <p className="text-sm font-medium">Inverse Logo</p>
                    </div>
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <div className="w-32 h-32 bg-white rounded-md flex items-center justify-center mb-2 border-dashed border-2 border-gray-300">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">Add Variation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <CardTitle>Agency Assets</CardTitle>
                  <CardDescription>
                    Images, documents, and other files to use in proposals
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Assets</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Office Exterior.jpg",
                    type: "image",
                    size: "2.4 MB",
                    preview:
                      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
                  },
                  {
                    name: "Team Photo.jpg",
                    type: "image",
                    size: "3.1 MB",
                    preview:
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
                  },
                  {
                    name: "Company Overview.pdf",
                    type: "document",
                    size: "1.8 MB",
                  },
                  {
                    name: "Agency Capabilities.pdf",
                    type: "document",
                    size: "2.2 MB",
                  },
                  {
                    name: "Office Interior.jpg",
                    type: "image",
                    size: "1.9 MB",
                    preview:
                      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
                  },
                  {
                    name: "Brand Guidelines.pdf",
                    type: "document",
                    size: "4.5 MB",
                  },
                ].map((asset, index) => (
                  <div
                    key={index}
                    className="border rounded-md overflow-hidden"
                  >
                    {asset.type === "image" ? (
                      <div className="aspect-video w-full overflow-hidden bg-gray-100">
                        <img
                          src={asset.preview}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
                        <div className="p-4 bg-white rounded-md shadow-sm">
                          <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs text-center font-medium">
                            {asset.name.split(".").pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-medium truncate">{asset.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {asset.size}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border rounded-md overflow-hidden border-dashed">
                  <div className="aspect-video w-full flex items-center justify-center bg-gray-50">
                    <div className="text-center p-4">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload New Asset</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getSocialIcon({ platform }: { platform: string }) {
  // This would normally use proper social media icons
  return <Globe className="h-4 w-4 text-blue-600" />;
}
