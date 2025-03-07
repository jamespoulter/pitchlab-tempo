"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface AddCredentialModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (credential: any) => void;
}

export function AddCredentialModal({
  open,
  onOpenChange,
  onSave,
}: AddCredentialModalProps) {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [image, setImage] = useState("");

  const handleSave = () => {
    const newCredential = {
      title,
      issuer,
      issueDate,
      expiryDate,
      description,
      credentialId,
      credentialUrl,
      image:
        image ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${issuer.substring(0, 2)}&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff`,
    };
    
    if (onSave) {
      onSave(newCredential);
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Credential</h2>
          <button 
            onClick={() => onOpenChange && onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Add a new certification or qualification to showcase your agency's expertise.
        </p>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Credential Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Google Ads Certification"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input
              id="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Google"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Certified in creating and optimizing Google Ads campaigns across Search, Display, and Video networks."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="credentialId">Credential ID (if applicable)</Label>
            <Input
              id="credentialId"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="GA-12345-XYZ"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="credentialUrl">Credential URL (if applicable)</Label>
            <Input
              id="credentialUrl"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://example.com/credential/ga-12345"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Logo/Image URL (optional)</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to generate a logo automatically
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Credential</Button>
        </div>
      </div>
    </div>
  );
}
