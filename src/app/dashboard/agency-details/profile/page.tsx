"use client";

import { useState } from "react";
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
} from "lucide-react";
import { EditAgencyProfileModal } from "@/components/modals/edit-agency-profile-modal";

export default function AgencyProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // This would normally fetch real data from the database
  const agencyDetails = {
    name: "Creative Solutions Agency",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=0369a1&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
    address: "123 Marketing Street, San Francisco, CA 94103",
    website: "www.creativesolutions.com",
    email: "info@creativesolutions.com",
    phone: "+1 (555) 123-4567",
    description:
      "Creative Solutions is a full-service digital marketing agency specializing in brand strategy, web design, content creation, and digital advertising. We help businesses of all sizes establish a strong online presence and connect with their target audience.",
    founded: "2015",
    employees: "25-50",
    industries: ["Technology", "E-commerce", "Healthcare", "Education"],
    socialMedia: {
      linkedin: "creativesolutions",
      twitter: "@creativesolutions",
      instagram: "@creativesolutions",
      facebook: "creativesolutionsagency",
    },
    mission:
      "To empower businesses with creative digital solutions that drive growth and foster meaningful connections with their audience.",
    vision:
      "To be the leading digital agency known for innovative strategies and measurable results that transform businesses in the digital landscape.",
    values: [
      "Innovation - We embrace new ideas and technologies to stay ahead of digital trends.",
      "Quality - We deliver excellence in every project, no matter the size.",
      "Collaboration - We work closely with our clients to ensure their vision is realized.",
      "Integrity - We operate with honesty and transparency in all our dealings.",
      "Results - We focus on delivering measurable outcomes that impact our clients' bottom line.",
    ],
  };

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
          <Button className="gap-1">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
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
                  src={agencyDetails.logo}
                  alt={agencyDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 mt-2"
              >
                <Upload className="h-4 w-4" />
                <span>Change Logo</span>
              </Button>
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
                  <span>{agencyDetails.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{agencyDetails.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Address:</span>
                  <span>{agencyDetails.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <span>{agencyDetails.website}</span>
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
                  <span>{agencyDetails.founded}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Team Size:</span>
                  <span>{agencyDetails.employees}</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Industries Served:</p>
                <div className="flex flex-wrap gap-2">
                  {agencyDetails.industries.map((industry, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {industry}
                    </span>
                  ))}
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
                {agencyDetails.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-2">Mission</h3>
                  <p className="text-sm">{agencyDetails.mission}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Vision</h3>
                  <p className="text-sm">{agencyDetails.vision}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Core Values</h3>
                  <ul className="space-y-2">
                    {agencyDetails.values.map((value, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">
                          {value.split(" - ")[0]}:
                        </span>{" "}
                        {value.split(" - ")[1]}
                      </li>
                    ))}
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
                {Object.entries(agencyDetails.socialMedia).map(
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
                      src={agencyDetails.logo}
                      alt={agencyDetails.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{agencyDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Established {agencyDetails.founded}
                    </p>
                  </div>
                </div>
                <p className="text-sm mb-4">{agencyDetails.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {agencyDetails.industries.map((industry, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>{agencyDetails.website}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>San Francisco, CA</span>
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
        initialData={agencyDetails}
        onSave={(updatedProfile) => {
          console.log("Updated profile:", updatedProfile);
          // Here you would normally save the data to your database
        }}
      />
    </div>
  );
}
