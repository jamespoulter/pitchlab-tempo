"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { AgencyProfile, AgencyProfileFormData } from "@/types/agency";
import { upsertAgencyProfile } from "@/utils/supabase-client";
import { toast } from "sonner";

interface EditAgencyProfileModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (agencyProfile: AgencyProfile) => void;
  initialData?: Partial<AgencyProfile>;
}

export function EditAgencyProfileModal({
  open,
  onOpenChange,
  onSave,
  initialData = {},
}: EditAgencyProfileModalProps) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [website, setWebsite] = useState(initialData.website || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [founded, setFounded] = useState(initialData.founded || "");
  const [employees, setEmployees] = useState(initialData.employees || "");
  const [industries, setIndustries] = useState<string[]>(initialData.industries || []);
  const [newIndustry, setNewIndustry] = useState("");
  const [mission, setMission] = useState(initialData.mission || "");
  const [vision, setVision] = useState(initialData.vision || "");
  const [isLoading, setIsLoading] = useState(false);

  const addIndustry = () => {
    if (newIndustry.trim()) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (index: number) => {
    setIndustries(industries.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const profileData: AgencyProfileFormData = {
        name,
        email,
        phone,
        website,
        address,
        description,
        founded,
        employees,
        industries,
        mission,
        vision,
      };
      
      const { success, data, error } = await upsertAgencyProfile(profileData);
      
      if (success && data) {
        toast.success("Agency profile saved successfully");
        
        if (onSave) {
          onSave(data);
        }
        
        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast.error("Failed to save agency profile");
        console.error("Error saving agency profile:", error);
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Agency Profile</h2>
          <button 
            onClick={() => onOpenChange && onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Update your agency's profile information.
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agency Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Creative Solutions Agency"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founded">Founded Year</Label>
              <Input
                id="founded"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="2015"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="www.example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Marketing Street, San Francisco, CA 94103"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employees">Team Size</Label>
            <select
              id="employees"
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            >
              <option value="">Select team size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-25">11-25 employees</option>
              <option value="25-50">25-50 employees</option>
              <option value="51-100">51-100 employees</option>
              <option value="100+">100+ employees</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Industries Served</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeIndustry(index)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Add industry (e.g., Technology)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIndustry();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addIndustry}
                size="sm"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Agency Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your agency's services and expertise..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Your agency's mission statement..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Your agency's vision for the future..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
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