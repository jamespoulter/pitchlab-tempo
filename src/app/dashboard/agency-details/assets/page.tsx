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
  Upload,
  Search,
  Filter,
  Briefcase,
  Image as ImageIcon,
  FileText,
  Edit,
  Trash,
  Download,
  Plus,
  FolderOpen,
} from "lucide-react";

export default function AgencyAssetsPage() {
  // This would normally fetch real data from the database
  const assets = [
    {
      id: 1,
      name: "Office Exterior.jpg",
      type: "image",
      size: "2.4 MB",
      preview:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      category: "Office",
      uploadedAt: "2023-09-15",
    },
    {
      id: 2,
      name: "Team Photo.jpg",
      type: "image",
      size: "3.1 MB",
      preview:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      category: "Team",
      uploadedAt: "2023-09-10",
    },
    {
      id: 3,
      name: "Company Overview.pdf",
      type: "document",
      size: "1.8 MB",
      category: "Documents",
      uploadedAt: "2023-08-22",
    },
    {
      id: 4,
      name: "Agency Capabilities.pdf",
      type: "document",
      size: "2.2 MB",
      category: "Documents",
      uploadedAt: "2023-08-15",
    },
    {
      id: 5,
      name: "Office Interior.jpg",
      type: "image",
      size: "1.9 MB",
      preview:
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
      category: "Office",
      uploadedAt: "2023-07-30",
    },
    {
      id: 6,
      name: "Brand Guidelines.pdf",
      type: "document",
      size: "4.5 MB",
      category: "Branding",
      uploadedAt: "2023-07-15",
    },
    {
      id: 7,
      name: "Client Meeting.jpg",
      type: "image",
      size: "2.8 MB",
      preview:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      category: "Meetings",
      uploadedAt: "2023-06-28",
    },
    {
      id: 8,
      name: "Project Workflow.pdf",
      type: "document",
      size: "3.2 MB",
      category: "Processes",
      uploadedAt: "2023-06-15",
    },
    {
      id: 9,
      name: "Design Process.jpg",
      type: "image",
      size: "2.1 MB",
      preview:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80",
      category: "Processes",
      uploadedAt: "2023-05-20",
    },
  ];

  const categories = [
    { name: "All Assets", count: assets.length },
    {
      name: "Office",
      count: assets.filter((a) => a.category === "Office").length,
    },
    { name: "Team", count: assets.filter((a) => a.category === "Team").length },
    {
      name: "Documents",
      count: assets.filter((a) => a.category === "Documents").length,
    },
    {
      name: "Branding",
      count: assets.filter((a) => a.category === "Branding").length,
    },
    {
      name: "Meetings",
      count: assets.filter((a) => a.category === "Meetings").length,
    },
    {
      name: "Processes",
      count: assets.filter((a) => a.category === "Processes").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage images, documents, and other files to use in proposals.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>Upload Assets</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${index === 0 ? "bg-blue-50 text-blue-700" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload New Asset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Or click to browse your files
                </p>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Browse Files
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset-category">Category</Label>
                <select
                  id="asset-category"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.slice(1).map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new">+ Create New Category</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search assets..."
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
                    <option value="size">Size</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="border rounded-md overflow-hidden group hover:shadow-sm transition-all"
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
                          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs text-center font-medium">
                            {asset.name.split(".").pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate text-sm">
                          {asset.name}
                        </p>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                          {asset.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {asset.size} •{" "}
                          {new Date(asset.uploadedAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border rounded-md overflow-hidden border-dashed flex items-center justify-center p-8 h-full aspect-video">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload New Asset</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      Drag & drop or click to browse
                    </p>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Asset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently Used Assets</CardTitle>
              <CardDescription>
                Assets you've recently included in proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {assets.slice(0, 4).map((asset) => (
                  <div
                    key={asset.id}
                    className="border rounded-md overflow-hidden group hover:shadow-sm transition-all"
                  >
                    {asset.type === "image" ? (
                      <div className="aspect-square w-full overflow-hidden bg-gray-100">
                        <img
                          src={asset.preview}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full flex items-center justify-center bg-gray-100">
                        <div className="p-4 bg-white rounded-md shadow-sm">
                          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs text-center font-medium">
                            {asset.name.split(".").pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="font-medium truncate text-xs">
                        {asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Used 3 days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
