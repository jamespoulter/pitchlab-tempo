"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface EditAgencyProfileModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (agencyProfile: any) => void;
  initialData?: any;
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

  const addIndustry = () => {
    if (newIndustry.trim()) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (index: number) => {
    setIndustries(industries.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedProfile = {
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
    
    if (onSave) {
      onSave(updatedProfile);
    }
    
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agency Profile</DialogTitle>
          <DialogDescription>
            Update your agency's profile information.
          </DialogDescription>
        </DialogHeader>
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