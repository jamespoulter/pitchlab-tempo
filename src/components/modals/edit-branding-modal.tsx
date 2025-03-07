"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload } from "lucide-react";

interface BrandColor {
  name: string;
  color: string;
  variable: string;
}

interface Typography {
  headings: {
    fontFamily: string;
    weights: string[];
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
    };
  };
  body: {
    fontFamily: string;
    weights: string[];
    size: string;
    lineHeight: string;
  };
}

interface LogoVariation {
  name: string;
  url: string;
}

interface BrandingDetails {
  colors: BrandColor[];
  typography: Typography;
  logoVariations: LogoVariation[];
  brandGuidelines: string;
}

interface EditBrandingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (brandingDetails: BrandingDetails) => void;
  initialData?: BrandingDetails;
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
        size: "",
        lineHeight: "",
      },
    },
    logoVariations: [],
    brandGuidelines: "",
  },
}: EditBrandingModalProps) {
  const [colors, setColors] = useState<BrandColor[]>(initialData.colors || []);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");
  const [newColorVariable, setNewColorVariable] = useState("");
  
  const [headingsFontFamily, setHeadingsFontFamily] = useState(
    initialData.typography?.headings?.fontFamily || ""
  );
  const [headingsWeights, setHeadingsWeights] = useState<string[]>(
    initialData.typography?.headings?.weights || []
  );
  const [headingsSizes, setHeadingsSizes] = useState(
    initialData.typography?.headings?.sizes || {
      h1: "",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
    }
  );
  
  const [bodyFontFamily, setBodyFontFamily] = useState(
    initialData.typography?.body?.fontFamily || ""
  );
  const [bodyWeights, setBodyWeights] = useState<string[]>(
    initialData.typography?.body?.weights || []
  );
  const [bodySize, setBodySize] = useState(
    initialData.typography?.body?.size || ""
  );
  const [bodyLineHeight, setBodyLineHeight] = useState(
    initialData.typography?.body?.lineHeight || ""
  );
  
  const [logoVariations, setLogoVariations] = useState<LogoVariation[]>(
    initialData.logoVariations || []
  );
  const [newLogoName, setNewLogoName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  
  const [brandGuidelines, setBrandGuidelines] = useState(
    initialData.brandGuidelines || ""
  );

  const addColor = () => {
    if (newColorName.trim() && newColorValue.trim() && newColorVariable.trim()) {
      setColors([
        ...colors,
        {
          name: newColorName.trim(),
          color: newColorValue.trim(),
          variable: newColorVariable.trim().startsWith("--")
            ? newColorVariable.trim()
            : `--${newColorVariable.trim()}`,
        },
      ]);
      setNewColorName("");
      setNewColorValue("#000000");
      setNewColorVariable("");
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addLogoVariation = () => {
    if (newLogoName.trim() && newLogoUrl.trim()) {
      setLogoVariations([
        ...logoVariations,
        {
          name: newLogoName.trim(),
          url: newLogoUrl.trim(),
        },
      ]);
      setNewLogoName("");
      setNewLogoUrl("");
    }
  };

  const removeLogoVariation = (index: number) => {
    setLogoVariations(logoVariations.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedBranding: BrandingDetails = {
      colors,
      typography: {
        headings: {
          fontFamily: headingsFontFamily,
          weights: headingsWeights,
          sizes: headingsSizes,
        },
        body: {
          fontFamily: bodyFontFamily,
          weights: bodyWeights,
          size: bodySize,
          lineHeight: bodyLineHeight,
        },
      },
      logoVariations,
      brandGuidelines,
    };
    
    if (onSave) {
      onSave(updatedBranding);
    }
    
    if (onOpenChange) {
      onOpenChange(false);
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
          Update your agency's visual identity and brand guidelines.
        </p>
        
        <div className="space-y-6">
          {/* Brand Colors Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Brand Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 border rounded-md p-4">
                <h4 className="text-sm font-medium">Current Colors</h4>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color, index) => (
                    <div key={index} className="relative group">
                      <div
                        className="w-16 h-16 rounded-md border"
                        style={{ backgroundColor: color.color }}
                      ></div>
                      <div className="mt-1 text-xs">
                        <p className="font-medium">{color.name}</p>
                        <p>{color.color}</p>
                        <p>{color.variable}</p>
                      </div>
                      <button
                        onClick={() => removeColor(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 border rounded-md p-4">
                <h4 className="text-sm font-medium">Add New Color</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="colorName">Color Name</Label>
                    <Input
                      id="colorName"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="colorValue">Color Value</Label>
                    <div className="flex gap-2">
                      <Input
                        id="colorValue"
                        value={newColorValue}
                        onChange={(e) => setNewColorValue(e.target.value)}
                        placeholder="#0369a1"
                      />
                      <input
                        type="color"
                        value={newColorValue}
                        onChange={(e) => setNewColorValue(e.target.value)}
                        className="w-10 h-10 p-1 rounded border"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="colorVariable">CSS Variable</Label>
                    <Input
                      id="colorVariable"
                      value={newColorVariable}
                      onChange={(e) => setNewColorVariable(e.target.value)}
                      placeholder="primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Will be prefixed with -- if not included
                    </p>
                  </div>
                  <Button
                    onClick={addColor}
                    className="w-full mt-2"
                    disabled={!newColorName || !newColorValue || !newColorVariable}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Typography Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 border rounded-md p-4">
                <h4 className="text-sm font-medium">Headings</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="headingsFontFamily">Font Family</Label>
                    <Input
                      id="headingsFontFamily"
                      value={headingsFontFamily}
                      onChange={(e) => setHeadingsFontFamily(e.target.value)}
                      placeholder="Montserrat"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="headingsWeights">Font Weights (comma-separated)</Label>
                    <Input
                      id="headingsWeights"
                      value={headingsWeights.join(", ")}
                      onChange={(e) => 
                        setHeadingsWeights(
                          e.target.value.split(",").map(w => w.trim()).filter(Boolean)
                        )
                      }
                      placeholder="600, 700"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Font Sizes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="h1Size" className="text-xs">H1</Label>
                        <Input
                          id="h1Size"
                          value={headingsSizes.h1}
                          onChange={(e) => 
                            setHeadingsSizes({...headingsSizes, h1: e.target.value})
                          }
                          placeholder="2.5rem"
                        />
                      </div>
                      <div>
                        <Label htmlFor="h2Size" className="text-xs">H2</Label>
                        <Input
                          id="h2Size"
                          value={headingsSizes.h2}
                          onChange={(e) => 
                            setHeadingsSizes({...headingsSizes, h2: e.target.value})
                          }
                          placeholder="2rem"
                        />
                      </div>
                      <div>
                        <Label htmlFor="h3Size" className="text-xs">H3</Label>
                        <Input
                          id="h3Size"
                          value={headingsSizes.h3}
                          onChange={(e) => 
                            setHeadingsSizes({...headingsSizes, h3: e.target.value})
                          }
                          placeholder="1.5rem"
                        />
                      </div>
                      <div>
                        <Label htmlFor="h4Size" className="text-xs">H4</Label>
                        <Input
                          id="h4Size"
                          value={headingsSizes.h4}
                          onChange={(e) => 
                            setHeadingsSizes({...headingsSizes, h4: e.target.value})
                          }
                          placeholder="1.25rem"
                        />
                      </div>
                      <div>
                        <Label htmlFor="h5Size" className="text-xs">H5</Label>
                        <Input
                          id="h5Size"
                          value={headingsSizes.h5}
                          onChange={(e) => 
                            setHeadingsSizes({...headingsSizes, h5: e.target.value})
                          }
                          placeholder="1rem"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 border rounded-md p-4">
                <h4 className="text-sm font-medium">Body Text</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="bodyFontFamily">Font Family</Label>
                    <Input
                      id="bodyFontFamily"
                      value={bodyFontFamily}
                      onChange={(e) => setBodyFontFamily(e.target.value)}
                      placeholder="Inter"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bodyWeights">Font Weights (comma-separated)</Label>
                    <Input
                      id="bodyWeights"
                      value={bodyWeights.join(", ")}
                      onChange={(e) => 
                        setBodyWeights(
                          e.target.value.split(",").map(w => w.trim()).filter(Boolean)
                        )
                      }
                      placeholder="400, 500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="bodySize">Font Size</Label>
                      <Input
                        id="bodySize"
                        value={bodySize}
                        onChange={(e) => setBodySize(e.target.value)}
                        placeholder="1rem"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bodyLineHeight">Line Height</Label>
                      <Input
                        id="bodyLineHeight"
                        value={bodyLineHeight}
                        onChange={(e) => setBodyLineHeight(e.target.value)}
                        placeholder="1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logo Variations Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Logo Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 border rounded-md p-4">
                <h4 className="text-sm font-medium">Current Logos</h4>
                <div className="space-y-3">
                  {logoVariations.map((logo, index) => (
                    <div key={index} className="flex items-center gap-3 group relative">
                      <img 
                        src={logo.url} 
                        alt={logo.name} 
                        className="w-12 h-12 object-contain border rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{logo.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {logo.url}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLogoVariation(index)}
                        className="absolute right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 border rounded-md p-4">
                <h4 className="text-sm font-medium">Add New Logo</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="logoName">Logo Name</Label>
                    <Input
                      id="logoName"
                      value={newLogoName}
                      onChange={(e) => setNewLogoName(e.target.value)}
                      placeholder="Primary Logo"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={newLogoUrl}
                      onChange={(e) => setNewLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <Button
                    onClick={addLogoVariation}
                    className="w-full mt-2"
                    disabled={!newLogoName || !newLogoUrl}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Logo
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Brand Guidelines Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Brand Guidelines</h3>
            <div className="border rounded-md p-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="brandGuidelines">Brand Guidelines PDF</Label>
                  <Input
                    id="brandGuidelines"
                    value={brandGuidelines}
                    onChange={(e) => setBrandGuidelines(e.target.value)}
                    placeholder="brand-guidelines.pdf"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Guidelines PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
} 