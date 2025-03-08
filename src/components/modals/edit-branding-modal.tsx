"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload } from "lucide-react";
import { ColorItem, Typography, AgencyBranding } from "@/types/agency";
import { upsertAgencyBranding, uploadBrandingAsset } from "@/utils/supabase-client";
import { toast } from "sonner";

interface EditBrandingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (brandingDetails: AgencyBranding) => void;
  initialData?: Partial<AgencyBranding>;
}

export function EditBrandingModal({
  open,
  onOpenChange,
  onSave,
  initialData = {
    colors: [],
    typography: {
      headings: {
        fontFamily: "",
        weights: [],
        sizes: { h1: "", h2: "", h3: "", h4: "", h5: "" },
      },
      body: {
        fontFamily: "",
        weights: [],
      },
    },
  },
}: EditBrandingModalProps) {
  const [colors, setColors] = useState<ColorItem[]>(initialData.colors || []);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");
  const [newColorVariable, setNewColorVariable] = useState("");
  
  const [typography, setTypography] = useState<Typography>(initialData.typography || {
    headings: {
      fontFamily: "",
      weights: [],
      sizes: { h1: "", h2: "", h3: "", h4: "", h5: "" },
    },
    body: {
      fontFamily: "",
      weights: [],
    },
  });
  
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialData.logo_url);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | undefined>(initialData.logo_dark_url);
  const [iconUrl, setIconUrl] = useState<string | undefined>(initialData.icon_url);
  const [assets, setAssets] = useState<string[]>(initialData.assets || []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const addColor = () => {
    console.log("Adding color:", { newColorName, newColorValue, newColorVariable });
    console.log("Current colors before adding:", colors);
    
    if (newColorName.trim() && newColorValue.trim() && newColorVariable.trim()) {
      const newColor = {
        name: newColorName.trim(),
        color: newColorValue.trim(),
        variable: newColorVariable.trim(),
      };
      
      const updatedColors = [...colors, newColor];
      console.log("New color to add:", newColor);
      console.log("Updated colors array:", updatedColors);
      
      // Update the state with the new colors array
      setColors(updatedColors);
      
      // Clear the input fields
      setNewColorName("");
      setNewColorValue("#000000");
      setNewColorVariable("");
      
      // Show a toast notification
      toast.success(`Added ${newColor.name} color`);
    } else {
      console.log("Missing required color fields");
      toast.error("Please fill in all color fields");
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleTypographyChange = (
    section: "headings" | "body",
    field: string,
    value: any
  ) => {
    setTypography({
      ...typography,
      [section]: {
        ...typography[section],
        [field]: value,
      },
    });
  };

  const handleHeadingSizeChange = (level: string, value: string) => {
    setTypography({
      ...typography,
      headings: {
        ...typography.headings,
        sizes: {
          ...typography.headings.sizes,
          [level]: value,
        },
      },
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'logo_dark' | 'icon' | 'asset'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size exceeds 5MB limit");
      return;
    }
    
    try {
      setUploadingType(type);
      setIsLoading(true);
      
      const { success, url, error } = await uploadBrandingAsset(file, type);
      
      if (!success || error) {
        console.error(`Error uploading ${type}:`, error);
        toast.error(`Failed to upload ${type}`);
        return;
      }
      
      // Update the appropriate state based on the type
      if (type === 'logo') {
        setLogoUrl(url);
      } else if (type === 'logo_dark') {
        setLogoDarkUrl(url);
      } else if (type === 'icon') {
        setIconUrl(url);
      } else if (type === 'asset') {
        setAssets([...assets, url!]);
      }
      
      toast.success(`${type} uploaded successfully`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setUploadingType(null);
      setIsLoading(false);
    }
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      console.log("Current colors before save:", colors);
      console.log("Current typography before save:", typography);
      
      // Make sure colors is an array
      const colorsToSave = Array.isArray(colors) ? colors : [];
      
      const brandingData: Partial<AgencyBranding> = {
        colors: colorsToSave,
        typography,
        logo_url: logoUrl,
        logo_dark_url: logoDarkUrl,
        icon_url: iconUrl,
        assets,
      };
      
      console.log("Saving branding data:", brandingData);
      
      const { success, data, error } = await upsertAgencyBranding(brandingData);
      
      console.log("Save result:", { success, data, error });
      
      if (success && data) {
        toast.success("Agency branding saved successfully");
        
        if (onSave) {
          onSave(data);
        }
        
        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast.error("Failed to save agency branding");
        console.error("Error saving agency branding:", error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error in handleSave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Brand Assets</h2>
          <button 
            onClick={() => onOpenChange && onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Update your agency's branding assets and style guidelines.
        </p>
        
        <div className="grid gap-6 py-4">
          {/* Brand Colors Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {colors.map((color, index) => (
                  <div key={index} className="border rounded-md p-3 relative">
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div 
                      className="w-full h-12 rounded mb-2" 
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{color.name}</p>
                      <p className="text-xs text-gray-500">{color.color}</p>
                      <p className="text-xs text-gray-500">var({color.variable})</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Add New Color</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="colorName">Color Name</Label>
                    <Input
                      id="colorName"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Primary"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="colorValue">Color Value</Label>
                    <div className="flex mt-1">
                      <Input
                        id="colorValue"
                        type="color"
                        value={newColorValue}
                        onChange={(e) => setNewColorValue(e.target.value)}
                        className="w-12 p-1 mr-2"
                      />
                      <Input
                        value={newColorValue}
                        onChange={(e) => setNewColorValue(e.target.value)}
                        placeholder="#0369a1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="colorVariable">CSS Variable</Label>
                    <Input
                      id="colorVariable"
                      value={newColorVariable}
                      onChange={(e) => setNewColorVariable(e.target.value)}
                      placeholder="--primary"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={addColor}
                  size="sm"
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Color
                </Button>
              </div>
            </div>
          </div>
          
          {/* Typography Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Typography</h3>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Headings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headingFont">Font Family</Label>
                    <Input
                      id="headingFont"
                      value={typography.headings.fontFamily}
                      onChange={(e) => handleTypographyChange("headings", "fontFamily", e.target.value)}
                      placeholder="Montserrat"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headingWeights">Font Weights (comma separated)</Label>
                    <Input
                      id="headingWeights"
                      value={typography.headings.weights.join(", ")}
                      onChange={(e) => handleTypographyChange("headings", "weights", e.target.value.split(",").map(w => w.trim()))}
                      placeholder="600, 700"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <Label>Heading Sizes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-1">
                    {["h1", "h2", "h3", "h4", "h5"].map((level) => (
                      <div key={level}>
                        <Label htmlFor={`size-${level}`} className="text-xs">{level.toUpperCase()}</Label>
                        <Input
                          id={`size-${level}`}
                          value={typography.headings.sizes[level as keyof typeof typography.headings.sizes] || ""}
                          onChange={(e) => handleHeadingSizeChange(level, e.target.value)}
                          placeholder={level === "h1" ? "2.5rem" : level === "h2" ? "2rem" : level === "h3" ? "1.5rem" : level === "h4" ? "1.25rem" : "1rem"}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Body Text</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bodyFont">Font Family</Label>
                    <Input
                      id="bodyFont"
                      value={typography.body.fontFamily}
                      onChange={(e) => handleTypographyChange("body", "fontFamily", e.target.value)}
                      placeholder="Inter"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyWeights">Font Weights (comma separated)</Label>
                    <Input
                      id="bodyWeights"
                      value={typography.body.weights.join(", ")}
                      onChange={(e) => handleTypographyChange("body", "weights", e.target.value.split(",").map(w => w.trim()))}
                      placeholder="400, 500"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logo Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Logo & Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Primary Logo</h4>
                {logoUrl ? (
                  <div className="mb-3">
                    <img 
                      src={logoUrl} 
                      alt="Primary Logo" 
                      className="max-w-full h-auto max-h-32 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex items-center justify-center mb-3">
                    <p className="text-sm text-gray-400">No logo uploaded</p>
                  </div>
                )}
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isLoading || uploadingType === 'logo'}
                    asChild
                  >
                    <span>
                      {uploadingType === 'logo' ? (
                        "Uploading..."
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-1" />
                          {logoUrl ? "Change Logo" : "Upload Logo"}
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Dark Mode Logo</h4>
                {logoDarkUrl ? (
                  <div className="mb-3 bg-gray-800 p-2 rounded">
                    <img 
                      src={logoDarkUrl} 
                      alt="Dark Mode Logo" 
                      className="max-w-full h-auto max-h-32 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex items-center justify-center mb-3 bg-gray-800">
                    <p className="text-sm text-gray-400">No dark logo uploaded</p>
                  </div>
                )}
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'logo_dark')}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isLoading || uploadingType === 'logo_dark'}
                    asChild
                  >
                    <span>
                      {uploadingType === 'logo_dark' ? (
                        "Uploading..."
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-1" />
                          {logoDarkUrl ? "Change Logo" : "Upload Logo"}
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Icon / Favicon</h4>
                {iconUrl ? (
                  <div className="mb-3 flex items-center justify-center">
                    <img 
                      src={iconUrl} 
                      alt="Icon" 
                      className="max-w-full h-auto max-h-32 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex items-center justify-center mb-3">
                    <p className="text-sm text-gray-400">No icon uploaded</p>
                  </div>
                )}
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'icon')}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isLoading || uploadingType === 'icon'}
                    asChild
                  >
                    <span>
                      {uploadingType === 'icon' ? (
                        "Uploading..."
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-1" />
                          {iconUrl ? "Change Icon" : "Upload Icon"}
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
            
            <div className="mt-4 border rounded-md p-4">
              <h4 className="text-sm font-medium mb-3">Additional Brand Assets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {assets.map((asset, index) => (
                  <div key={index} className="border rounded-md p-2 relative">
                    <button
                      type="button"
                      onClick={() => removeAsset(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <img 
                      src={asset} 
                      alt={`Asset ${index + 1}`} 
                      className="max-w-full h-auto max-h-24 mx-auto"
                    />
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-200 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'asset')}
                    disabled={isLoading}
                  />
                  <Plus className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Asset</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
} 