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
import {
  Upload,
  FileText,
  Image,
  Video,
  File,
  X,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Download,
  Loader2,
} from "lucide-react";
import { AgencyAsset } from "@/types/agency";
import { getAgencyAssets, uploadAgencyAssetFile, createAgencyAsset, deleteAgencyAsset } from "@/utils/supabase-client";
import { toast } from "sonner";

export default function AgencyAssetsPage() {
  const [assets, setAssets] = useState<AgencyAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  
  // Fetch agency assets
  useEffect(() => {
    const fetchAgencyAssets = async () => {
      setIsLoading(true);
      try {
        const data = await getAgencyAssets();
        console.log("Fetched agency assets:", data);
        setAssets(data);
      } catch (error) {
        console.error("Error fetching agency assets:", error);
        toast.error("Failed to load agency assets");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgencyAssets();
  }, []);
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size exceeds 10MB limit");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload the file to storage
      const { success, url, fileInfo, error } = await uploadAgencyAssetFile(file);
      
      if (!success || !url || !fileInfo) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
        return;
      }
      
      // Determine file type
      let fileType: 'image' | 'document' | 'video' | 'other' = 'other';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-powerpoint' ||
        file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        file.type === 'text/plain'
      ) {
        fileType = 'document';
      }
      
      // Create asset record in database
      const assetData = {
        name: file.name,
        file_url: url,
        file_type: fileType,
        file_size: fileInfo.size,
        mime_type: fileInfo.type,
        description: "",
        tags: []
      };
      
      const { success: createSuccess, data: newAsset, error: createError } = await createAgencyAsset(assetData);
      
      if (!createSuccess || !newAsset) {
        console.error("Error creating asset record:", createError);
        toast.error("Failed to create asset record");
        return;
      }
      
      // Update the assets list
      setAssets(prevAssets => [newAsset, ...prevAssets]);
      
      toast.success("Asset uploaded successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle asset deletion
  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) {
      return;
    }
    
    try {
      const { success, error } = await deleteAgencyAsset(assetId);
      
      if (!success) {
        console.error("Error deleting asset:", error);
        toast.error("Failed to delete asset");
        return;
      }
      
      // Update the assets list
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
      
      toast.success("Asset deleted successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };
  
  // Filter and search assets
  const filteredAssets = assets.filter(asset => {
    // Apply type filter
    if (filterType && asset.file_type !== filterType) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(query) ||
        (asset.description && asset.description.toLowerCase().includes(query)) ||
        (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });
  
  // Get icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's images, documents, and other files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button 
              variant="default" 
              className="gap-1"
              disabled={isUploading}
              asChild
            >
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Asset</span>
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(null)}
          >
            All
          </Button>
          <Button
            variant={filterType === "image" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("image")}
          >
            <Image className="h-4 w-4 mr-1" />
            Images
          </Button>
          <Button
            variant={filterType === "document" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("document")}
          >
            <FileText className="h-4 w-4 mr-1" />
            Documents
          </Button>
          <Button
            variant={filterType === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("video")}
          >
            <Video className="h-4 w-4 mr-1" />
            Videos
          </Button>
          <Button
            variant={filterType === "other" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("other")}
          >
            <File className="h-4 w-4 mr-1" />
            Other
          </Button>
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No assets found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {assets.length === 0
                ? "You haven't uploaded any assets yet. Upload your first asset to get started."
                : "No assets match your search criteria. Try adjusting your filters or search query."}
            </p>
            {assets.length === 0 && (
              <label>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Your First Asset
                  </span>
                </Button>
              </label>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                {asset.file_type === "image" ? (
                  <img
                    src={asset.file_url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 bg-white rounded-md shadow-sm">
                    {getFileIcon(asset.file_type)}
                    <p className="text-xs text-center font-medium mt-2">
                      {asset.mime_type?.split("/").pop()?.toUpperCase() || asset.file_type.toUpperCase()}
                    </p>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate" title={asset.name}>
                      {asset.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(asset.file_size)}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={asset.file_url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => asset.id && handleDeleteAsset(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
