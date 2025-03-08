"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadCredentialImage } from "@/utils/supabase-client";
import { toast } from "sonner";
import { AgencyCredential, AgencyCredentialFormData } from "@/types/agency";

interface EditCredentialModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (credentialId: string, credential: Partial<AgencyCredentialFormData>) => void;
  credential?: AgencyCredential | null;
}

export function EditCredentialModal({
  open,
  onOpenChange,
  onSave,
  credential,
}: EditCredentialModalProps) {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load credential data when the modal opens or credential changes
  useEffect(() => {
    if (credential && open) {
      setTitle(credential.title || "");
      setIssuer(credential.issuer || "");
      setIssueDate(credential.issue_date ? credential.issue_date.split('T')[0] : "");
      setExpiryDate(credential.expiry_date ? credential.expiry_date.split('T')[0] : "");
      setDescription(credential.description || "");
      setCredentialId(credential.credential_id || "");
      setCredentialUrl(credential.credential_url || "");
      setImage(credential.image_url || "");
    }
  }, [credential, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { success, url, error } = await uploadCredentialImage(file);
      
      if (success && url) {
        setImage(url);
        toast.success("Image uploaded successfully");
      } else {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      toast.error("An error occurred while uploading the image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !issuer || !issueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!credential?.id) {
      toast.error("Credential ID is missing");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedCredential: Partial<AgencyCredentialFormData> = {
        title,
        issuer,
        issue_date: issueDate,
        expiry_date: expiryDate || undefined,
        description,
        credential_id: credentialId || undefined,
        credential_url: credentialUrl || undefined,
        image_url: image || undefined,
      };
      
      if (onSave) {
        onSave(credential.id, updatedCredential);
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("An error occurred while saving the credential");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
          <h2 className="text-lg font-semibold">Edit Credential</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Update certification or qualification details.
        </p>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Credential Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Google Ads Certification"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization <span className="text-red-500">*</span></Label>
            <Input
              id="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Google"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date <span className="text-red-500">*</span></Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
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
            <Label htmlFor="image">Logo/Image</Label>
            <div className="flex items-center gap-4">
              {image ? (
                <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                  <img 
                    src={image} 
                    alt="Credential Logo" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setImage("")}
                    className="absolute top-0 right-0 bg-white rounded-bl-md p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-md border border-dashed flex items-center justify-center bg-gray-50">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a logo or image for this credential (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || isUploading || !title || !issuer || !issueDate}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Credential"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 