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
import {
  Palette,
  Type,
  Plus,
  Edit,
  Save,
  Copy,
  Download,
  Upload,
} from "lucide-react";

export default function AgencyBrandingPage() {
  // This would normally fetch real data from the database
  const brandingDetails = {
    colors: [
      { name: "Primary", color: "#0369a1", variable: "--primary" },
      { name: "Secondary", color: "#0e7490", variable: "--secondary" },
      { name: "Accent", color: "#0284c7", variable: "--accent" },
      { name: "Text", color: "#1e293b", variable: "--text" },
      { name: "Background", color: "#f8fafc", variable: "--background" },
    ],
    typography: {
      headings: {
        fontFamily: "Montserrat",
        weights: ["600", "700"],
        sizes: {
          h1: "2.5rem",
          h2: "2rem",
          h3: "1.5rem",
          h4: "1.25rem",
          h5: "1rem",
        },
      },
      body: {
        fontFamily: "Inter",
        weights: ["400", "500"],
        size: "1rem",
        lineHeight: "1.5",
      },
    },
    logoVariations: [
      {
        name: "Primary Logo",
        url: "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      },
      {
        name: "Inverse Logo",
        url: "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=ffffff&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=0369a1",
      },
      {
        name: "Icon Only",
        url: "https://api.dicebear.com/7.x/initials/svg?seed=C&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
      },
    ],
    brandGuidelines: "brand-guidelines.pdf",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's visual identity and brand guidelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit Branding</span>
          </Button>
          <Button className="gap-1">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Your agency's primary color palette
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  {brandingDetails.colors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-20 h-20 rounded-md mb-2 border"
                        style={{ backgroundColor: color.color }}
                      ></div>
                      <p className="text-sm font-medium">{color.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {color.color}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {color.variable}
                      </p>
                    </div>
                  ))}
                  <div className="text-center flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-20 w-20 rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">
                    Color Usage Guidelines
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Primary:</span> Use for main
                      buttons, links, and important UI elements.
                    </p>
                    <p>
                      <span className="font-medium">Secondary:</span> Use for
                      secondary actions, highlights, and accents.
                    </p>
                    <p>
                      <span className="font-medium">Accent:</span> Use sparingly
                      for emphasis and call-to-action elements.
                    </p>
                    <p>
                      <span className="font-medium">Text:</span> Use for body
                      text, headings, and general content.
                    </p>
                    <p>
                      <span className="font-medium">Background:</span> Use for
                      page backgrounds and content containers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Font families and styling for your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">
                        Headings:{" "}
                        {brandingDetails.typography.headings.fontFamily}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy CSS
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p
                        className="text-4xl font-bold"
                        style={{
                          fontFamily:
                            brandingDetails.typography.headings.fontFamily,
                        }}
                      >
                        Heading 1
                      </p>
                      <p
                        className="text-3xl font-bold"
                        style={{
                          fontFamily:
                            brandingDetails.typography.headings.fontFamily,
                        }}
                      >
                        Heading 2
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{
                          fontFamily:
                            brandingDetails.typography.headings.fontFamily,
                        }}
                      >
                        Heading 3
                      </p>
                      <p
                        className="text-xl font-bold"
                        style={{
                          fontFamily:
                            brandingDetails.typography.headings.fontFamily,
                        }}
                      >
                        Heading 4
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{
                          fontFamily:
                            brandingDetails.typography.headings.fontFamily,
                        }}
                      >
                        Heading 5
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">
                        Body: {brandingDetails.typography.body.fontFamily}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy CSS
                        </Button>
                      </div>
                    </div>
                    <p
                      className="text-base"
                      style={{
                        fontFamily: brandingDetails.typography.body.fontFamily,
                      }}
                    >
                      This is body text that would be used throughout your
                      proposals and marketing materials. It should be highly
                      readable and complement your heading font. The recommended
                      line height is{" "}
                      {brandingDetails.typography.body.lineHeight} for optimal
                      readability.
                    </p>
                    <p
                      className="text-base font-medium mt-2"
                      style={{
                        fontFamily: brandingDetails.typography.body.fontFamily,
                      }}
                    >
                      This is medium weight body text that can be used for
                      emphasis within paragraphs.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">
                    Typography Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heading-font">Heading Font</Label>
                      <Input
                        id="heading-font"
                        defaultValue={
                          brandingDetails.typography.headings.fontFamily
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body-font">Body Font</Label>
                      <Input
                        id="body-font"
                        defaultValue={
                          brandingDetails.typography.body.fontFamily
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo Variations</CardTitle>
              <CardDescription>
                Different versions of your agency logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brandingDetails.logoVariations.map((logo, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md flex flex-col items-center"
                  >
                    <div className="w-32 h-32 bg-white rounded-md flex items-center justify-center mb-2 border">
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium">{logo.name}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Replace
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="p-4 border rounded-md flex flex-col items-center border-dashed">
                  <div className="w-32 h-32 bg-white rounded-md flex items-center justify-center mb-2 border-dashed border-2 border-gray-300">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Add Variation</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs mt-2"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <CardDescription>
                Your comprehensive brand style guide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 flex flex-col items-center">
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center mb-3">
                  <FileIcon className="w-16 h-16 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Brand Guidelines.pdf</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Last updated: Oct 15, 2023
                </p>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">
                  Brand Guidelines Include:
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Logo Usage & Clear Space</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Color Palette & Applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Typography System</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Photography Style</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Iconography</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Brand Voice & Tone</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span>Application Examples</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Elements</CardTitle>
              <CardDescription>Additional visual components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Iconography Style</Label>
                <div className="p-3 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded">
                      <Palette className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Line Icons</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image Style</Label>
                <div className="p-3 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded">
                      <Type className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Modern Photography</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pattern & Textures</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded-md bg-blue-100 border"></div>
                  <div className="aspect-square rounded-md bg-gray-100 border"></div>
                  <div className="aspect-square rounded-md border flex items-center justify-center">
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple file icon component
function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
