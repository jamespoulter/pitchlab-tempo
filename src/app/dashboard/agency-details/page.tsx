"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit,
  Upload,
  Plus,
  Loader2,
} from "lucide-react";
import { AgencyProfile } from "@/types/agency";
import { getAgencyProfile } from "@/utils/supabase-client";
import { toast } from "sonner";

export default function AgencyDetailsPage() {
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <h1 className="text-3xl font-bold tracking-tight">Agency Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's profile information and branding assets.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Agency Profile</CardTitle>
                <CardDescription>
                  Your agency's core information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center">
                    <img
                      src={agencyProfile?.logo_url || "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff"}
                      alt={agencyProfile?.name || "Agency Logo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {agencyProfile?.name || "Your Agency Name"}
                    </h3>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{agencyProfile?.address || "No address provided"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{agencyProfile?.website || "No website provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm">
                    {agencyProfile?.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/agency-details/profile">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Profile
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Brand Assets</CardTitle>
                <CardDescription>
                  Your agency's visual identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-md p-3 flex flex-col items-center">
                    <div className="w-full h-20 bg-white rounded-md flex items-center justify-center mb-2">
                      <img
                        src={agencyProfile?.logo_url || "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff"}
                        alt="Logo"
                        className="max-h-16 max-w-full"
                      />
                    </div>
                    <p className="text-xs text-center">Primary Logo</p>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center bg-gray-800">
                    <div className="w-full h-20 bg-gray-800 rounded-md flex items-center justify-center mb-2">
                      <img
                        src={agencyProfile?.logo_url || "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff"}
                        alt="Logo (Dark)"
                        className="max-h-16 max-w-full"
                      />
                    </div>
                    <p className="text-xs text-center text-white">Dark Mode Logo</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
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
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/agency-details/branding">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Branding
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How clients can reach your agency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{agencyProfile?.email || "No email provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{agencyProfile?.phone || "No phone provided"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Founded</p>
                      <p className="text-sm">{agencyProfile?.founded || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Team Size</p>
                      <p className="text-sm">{agencyProfile?.employees || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <iframe 
            src="/dashboard/agency-details/profile" 
            className="w-full h-[calc(100vh-12rem)] border-none"
          />
        </TabsContent>
        
        <TabsContent value="branding">
          <iframe 
            src="/dashboard/agency-details/branding" 
            className="w-full h-[calc(100vh-12rem)] border-none"
          />
        </TabsContent>
        
        <TabsContent value="assets">
          <iframe 
            src="/dashboard/agency-details/assets" 
            className="w-full h-[calc(100vh-12rem)] border-none"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Social media icons would be implemented here in a real application
