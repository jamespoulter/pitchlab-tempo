"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddServiceModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (service: any) => void;
}

export function AddServiceModal({
  open,
  onOpenChange,
  onSave,
}: AddServiceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [category, setCategory] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [icon, setIcon] = useState("🎨");

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (!name || !description || !category || !priceRange || !timeline) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const newService = {
        name,
        description,
        features: Array.isArray(features) ? features : [],
        priceRange,
        timeline,
        category,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        icon: getIconForCategory(category) || "🎨", // Use category-based icon or default
        process: [], // Empty arrays for optional fields
        faq: [],
        testimonials: [],
      };
      
      console.log("Submitting service data:", JSON.stringify(newService, null, 2));
      
      if (onSave) {
        console.log("Calling onSave function");
        await onSave(newService);
        console.log("onSave function completed");
        
        // Reset form
        setName("");
        setDescription("");
        setFeatures([]);
        setNewFeature("");
        setPriceRange("");
        setTimeline("");
        setCategory("");
        setDeliverables([]);
        setNewDeliverable("");
        
        if (onOpenChange) {
          onOpenChange(false);
        }
        
        toast.success("Service added successfully");
      } else {
        console.error("onSave function is not defined");
        toast.error("Could not save service: Internal error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving the service");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get an appropriate icon based on category
  const getIconForCategory = (category: string): string => {
    const categoryIcons: Record<string, string> = {
      "Branding": "🎨",
      "Web Development": "💻",
      "Digital Marketing": "📈",
      "Content Creation": "✍️",
      "Social Media": "📱",
      "SEO": "🔍",
      "Consulting": "💼",
      "Design": "🎭",
      "Video": "🎬",
      "Photography": "📷",
      "Advertising": "📣",
      "Email": "📧",
      "Analytics": "📊",
    };
    
    return categoryIcons[category] || "";
  };

  // Update icon when category changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    const newIcon = getIconForCategory(newCategory);
    if (newIcon) {
      setIcon(newIcon);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Service</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange && onOpenChange(false)}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Brand Strategy & Identity"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                required
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                <option value="Branding">Branding</option>
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Social Media">Social Media</option>
                <option value="SEO">SEO</option>
                <option value="Consulting">Consulting</option>
                <option value="Design">Design</option>
                <option value="Video">Video Production</option>
                <option value="Photography">Photography</option>
                <option value="Advertising">Advertising</option>
                <option value="Email">Email Marketing</option>
                <option value="Analytics">Analytics & Reporting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive brand development including positioning, messaging, visual identity, and guidelines."
                className="min-h-[100px]"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="$5,000 - $15,000"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="4-6 weeks"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Key Features</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature (e.g., Brand Audit & Research)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Deliverables</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {deliverables.map((deliverable, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm"
                  >
                    {deliverable}
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="ml-1 text-green-500 hover:text-green-700"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  placeholder="Add deliverable (e.g., Brand Guidelines PDF)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDeliverable();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={addDeliverable}
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange && onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name || !description || !priceRange || !timeline || !category || features.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
