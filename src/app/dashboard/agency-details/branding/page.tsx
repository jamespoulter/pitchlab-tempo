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
  Palette,
  Type,
  Plus,
  Edit,
  Save,
  Copy,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import { EditBrandingModal } from "@/components/modals/edit-branding-modal";
import { AgencyBranding } from "@/types/agency";
import { getAgencyBranding, uploadBrandingAsset } from "@/utils/supabase-client";
import { toast } from "sonner";

export default function AgencyBrandingPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [branding, setBranding] = useState<AgencyBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch agency branding data
  useEffect(() => {
    const fetchAgencyBranding = async () => {
      setIsLoading(true);
      try {
        const data = await getAgencyBranding();
        
        console.log("Fetched branding data:", data);
        
        if (data) {
          // Ensure colors is an array
          const processedData = {
            ...data,
            colors: Array.isArray(data.colors) ? data.colors : [],
          };
          console.log("Processed branding data:", processedData);
          setBranding(processedData);
        } else {
          // Set default branding if none exists
          const defaultBranding = {
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
              },
            },
          };
          console.log("Using default branding:", defaultBranding);
          setBranding(defaultBranding);
        }
      } catch (error) {
        console.error("Error fetching agency branding:", error);
        toast.error("Failed to load agency branding");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgencyBranding();
  }, []);

  const handleSaveBranding = (updatedBranding: AgencyBranding) => {
    console.log("Saving updated branding:", updatedBranding);
    setBranding(updatedBranding);
  };

  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success("Color copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  console.log("Rendering with branding:", branding);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's visual identity and brand assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit Brand Assets</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Your agency's color palette
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {branding?.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{color.name}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">{color.color}</p>
                      <button 
                        onClick={() => copyColorToClipboard(color.color)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Your agency's font styles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Headings</h3>
                <p className="text-sm">
                  <span className="font-medium">Font:</span> {branding?.typography.headings.fontFamily}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Weights:</span> {branding?.typography.headings.weights.join(", ")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Body Text</h3>
                <p className="text-sm">
                  <span className="font-medium">Font:</span> {branding?.typography.body.fontFamily}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Weights:</span> {branding?.typography.body.weights.join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Variations</CardTitle>
              <CardDescription>
                Your agency's logo in different formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Primary Logo</h3>
                  {branding?.logo_url ? (
                    <div className="bg-white p-4 rounded-md flex items-center justify-center mb-3">
                      <img 
                        src={branding.logo_url} 
                        alt="Primary Logo" 
                        className="max-w-full h-auto max-h-32"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-6 rounded-md flex items-center justify-center mb-3">
                      <p className="text-sm text-gray-400">No logo uploaded</p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Dark Mode Logo</h3>
                  {branding?.logo_dark_url ? (
                    <div className="bg-gray-800 p-4 rounded-md flex items-center justify-center mb-3">
                      <img 
                        src={branding.logo_dark_url} 
                        alt="Dark Mode Logo" 
                        className="max-w-full h-auto max-h-32"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-6 rounded-md flex items-center justify-center mb-3">
                      <p className="text-sm text-gray-400">No dark logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Icon / Favicon</h3>
                {branding?.icon_url ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-4 rounded-md flex items-center justify-center">
                      <img 
                        src={branding.icon_url} 
                        alt="Icon" 
                        className="max-w-full h-auto max-h-16"
                      />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-md flex items-center justify-center">
                      <img 
                        src={branding.icon_url} 
                        alt="Icon (Dark)" 
                        className="max-w-full h-auto max-h-16"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-6 rounded-md flex items-center justify-center">
                    <p className="text-sm text-gray-400">No icon uploaded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Assets</CardTitle>
              <CardDescription>
                Other brand assets and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {branding?.assets && branding.assets.length > 0 ? (
                  branding.assets.map((asset, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <img 
                        src={asset} 
                        alt={`Asset ${index + 1}`} 
                        className="max-w-full h-auto max-h-24 mx-auto"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-gray-100 p-6 rounded-md flex items-center justify-center">
                    <p className="text-sm text-gray-400">No additional assets uploaded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditBrandingModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={branding || undefined}
        onSave={handleSaveBranding}
      />
    </div>
  );
}
