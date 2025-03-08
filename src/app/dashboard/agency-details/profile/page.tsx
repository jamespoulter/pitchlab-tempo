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
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit,
  Upload,
  Save,
  Building,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { EditAgencyProfileModal } from "@/components/modals/edit-agency-profile-modal";
import { AgencyProfile } from "@/types/agency";
import { getAgencyProfile, uploadAgencyLogo, updateAgencyLogo } from "@/utils/supabase-client";
import { toast } from "sonner";

export default function AgencyProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default placeholder logo
  const defaultLogo = "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff";
  
  // Default values for social media
  const defaultSocialMedia = {
    linkedin: "creativesolutions",
    twitter: "@creativesolutions",
    instagram: "@creativesolutions",
    facebook: "creativesolutionsagency",
  };
  
  // Default values for core values
  const defaultValues = [
    "Innovation - We embrace new ideas and technologies to stay ahead of digital trends.",
    "Quality - We deliver excellence in every project, no matter the size.",
    "Collaboration - We work closely with our clients to ensure their vision is realized.",
    "Integrity - We operate with honesty and transparency in all our dealings.",
    "Results - We focus on delivering measurable outcomes that impact our clients' bottom line.",
  ];

  // Fetch agency profile data
  useEffect(() => {
    const fetchAgencyProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getAgencyProfile();
        
        if (profile) {
          setAgencyProfile(profile);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgencyProfile();
  }, []);

  // Handle saving the agency profile
  const handleSaveAgencyProfile = (updatedProfile: AgencyProfile) => {
    setAgencyProfile(updatedProfile);
  };

  // Handle logo upload
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("File size exceeds 2MB limit");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { success, url, error } = await uploadAgencyLogo(file);
      
      if (!success || error) {
        console.error("Error uploading logo:", error);
        toast.error("Failed to upload logo");
        return;
      }
      
      // Update the agency profile with the new logo URL
      const updateResult = await updateAgencyLogo(url!);
      
      if (!updateResult.success) {
        console.error("Error updating logo URL:", updateResult.error);
        toast.error("Failed to update logo URL");
        return;
      }
      
      // Update the local state
      setAgencyProfile(prev => prev ? { ...prev, logo_url: url } : null);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold tracking-tight">Agency Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's core information and brand identity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Logo</CardTitle>
              <CardDescription>
                Your agency's primary visual identifier
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center mb-4">
                <img
                  src={agencyProfile?.logo_url || defaultLogo}
                  alt={agencyProfile?.name || "Agency Logo"}
                  className="w-full h-full object-cover"
                />
              </div>
              <label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 mt-2 cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    <span>Change Logo</span>
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Recommended size: 400x400px. <br />
                Max file size: 2MB. PNG or JPG format.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How clients can reach your agency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{agencyProfile?.email || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{agencyProfile?.phone || "Not set"}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Address:</span>
                  <span>{agencyProfile?.address || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <span>{agencyProfile?.website || "Not set"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agency Details</CardTitle>
              <CardDescription>
                Key information about your agency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Founded:</span>
                  <span>{agencyProfile?.founded || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Team Size:</span>
                  <span>{agencyProfile?.employees || "Not set"}</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Industries Served:</p>
                <div className="flex flex-wrap gap-2">
                  {agencyProfile?.industries && agencyProfile.industries.length > 0 ? (
                    agencyProfile.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                      >
                        {industry}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No industries added</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Description</CardTitle>
              <CardDescription>
                A comprehensive overview of your agency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 mb-6">
                {agencyProfile?.description || "No description provided."}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-2">Mission</h3>
                  <p className="text-sm">{agencyProfile?.mission || "No mission statement provided."}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Vision</h3>
                  <p className="text-sm">{agencyProfile?.vision || "No vision statement provided."}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Core Values</h3>
                  <ul className="space-y-2">
                    {(agencyProfile?.values && agencyProfile.values.length > 0) ? (
                      agencyProfile.values.map((value, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">
                            {value.split(" - ")[0]}:
                          </span>{" "}
                          {value.split(" - ")[1]}
                        </li>
                      ))
                    ) : (
                      defaultValues.map((value, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          <span className="font-medium">
                            {value.split(" - ")[0]}:
                          </span>{" "}
                          {value.split(" - ")[1]}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Profiles</CardTitle>
              <CardDescription>
                Your agency's presence across social platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(agencyProfile?.social_media || defaultSocialMedia).map(
                  ([platform, handle]) => (
                    <div
                      key={platform}
                      className="flex items-center gap-3 p-3 border rounded-md"
                    >
                      <div className="bg-blue-50 p-2 rounded-md">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {platform}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {handle}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your agency profile appears in proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center">
                    <img
                      src={agencyProfile?.logo_url || defaultLogo}
                      alt={agencyProfile?.name || "Agency Logo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{agencyProfile?.name || "Your Agency Name"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {agencyProfile?.founded ? `Established ${agencyProfile.founded}` : "Established year not set"}
                    </p>
                  </div>
                </div>
                <p className="text-sm mb-4">{agencyProfile?.description || "No description provided."}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {agencyProfile?.industries && agencyProfile.industries.length > 0 ? (
                    agencyProfile.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {industry}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Add industries</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyProfile?.email || "email@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyProfile?.phone || "Phone number"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyProfile?.website || "Website URL"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyProfile?.address ? agencyProfile.address.split(",").pop()?.trim() : "Location"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditAgencyProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={agencyProfile || {}}
        onSave={handleSaveAgencyProfile}
      />
    </div>
  );
}
