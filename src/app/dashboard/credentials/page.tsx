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
  Award,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Edit,
  Trash,
  ExternalLink,
  FileText,
  Loader2,
  AlertTriangle,
  Clock,
  Bell,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddCredentialModal } from "@/components/modals/add-credential-modal";
import { EditCredentialModal } from "@/components/modals/edit-credential-modal";
import { AgencyCredential } from "@/types/agency";
import { getAgencyCredentials, createAgencyCredential, updateAgencyCredential, deleteAgencyCredential } from "@/utils/supabase-client";
import { toast } from "sonner";

export default function CredentialsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<AgencyCredential | null>(null);
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<AgencyCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  
  useEffect(() => {
    fetchCredentials();
  }, []);
  
  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
      const data = await getAgencyCredentials();
      setCredentials(data);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      toast.error("Failed to load credentials");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveCredential = async (credentialData: any) => {
    try {
      // Format dates to ISO string if they exist
      const formattedData = {
        ...credentialData,
        issue_date: credentialData.issueDate || credentialData.issue_date,
        expiry_date: credentialData.expiryDate || credentialData.expiry_date || null,
        credential_id: credentialData.credentialId || credentialData.credential_id,
        credential_url: credentialData.credentialUrl || credentialData.credential_url,
        image_url: credentialData.image || credentialData.image_url,
      };
      
      const { success, data, error } = await createAgencyCredential(formattedData);
      
      if (success && data) {
        setCredentials([data, ...credentials]);
        toast.success("Credential added successfully");
      } else {
        console.error("Error adding credential:", error);
        toast.error("Failed to add credential");
      }
    } catch (error) {
      console.error("Error in handleSaveCredential:", error);
      toast.error("An error occurred while saving the credential");
    }
  };
  
  const handleUpdateCredential = async (credentialId: string, credentialData: any) => {
    try {
      const { success, data, error } = await updateAgencyCredential(credentialId, credentialData);
      
      if (success && data) {
        // Update the credential in the state
        setCredentials(credentials.map(cred => 
          cred.id === credentialId ? data : cred
        ));
        toast.success("Credential updated successfully");
      } else {
        console.error("Error updating credential:", error);
        toast.error("Failed to update credential");
      }
    } catch (error) {
      console.error("Error in handleUpdateCredential:", error);
      toast.error("An error occurred while updating the credential");
    }
  };
  
  const confirmDeleteCredential = (credentialId: string) => {
    setCredentialToDelete(credentialId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCredential = async () => {
    if (!credentialToDelete) return;
    
    setIsDeleting(true);
    try {
      const { success, error } = await deleteAgencyCredential(credentialToDelete);
      
      if (success) {
        setCredentials(credentials.filter(cred => cred.id !== credentialToDelete));
        toast.success("Credential deleted successfully");
      } else {
        console.error("Error deleting credential:", error);
        toast.error("Failed to delete credential");
      }
    } catch (error) {
      console.error("Error in handleDeleteCredential:", error);
      toast.error("An error occurred while deleting the credential");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setCredentialToDelete(null);
    }
  };
  
  const handleEditCredential = (credential: AgencyCredential) => {
    setSelectedCredential(credential);
    setIsEditModalOpen(true);
  };
  
  // Get credentials that are expiring soon or expired
  const getExpiringCredentials = () => {
    const today = new Date();
    return credentials.filter(credential => {
      if (!credential.expiry_date) return false;
      
      const expiryDate = new Date(credential.expiry_date);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return daysUntilExpiry < 90; // Show credentials expiring in the next 90 days
    });
  };
  
  // Get credential status based on expiry date
  const getCredentialStatus = (expiryDateStr?: string) => {
    if (!expiryDateStr) return { status: "No Expiry", statusClass: "bg-gray-100 text-gray-800" };
    
    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilExpiry < 0) {
      return { status: "Expired", statusClass: "bg-red-100 text-red-800" };
    } else if (daysUntilExpiry < 30) {
      return { status: "Expiring Soon", statusClass: "bg-amber-100 text-amber-800" };
    } else if (daysUntilExpiry < 90) {
      return { status: "Expiring Soon", statusClass: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "Active", statusClass: "bg-green-100 text-green-800" };
    }
  };
  
  const expiringCredentials = getExpiringCredentials();
  
  const filteredCredentials = credentials
    .filter(credential => {
      // Apply search filter
      const matchesSearch = 
        credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credential.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (credential.description && credential.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply expiring filter if enabled
      if (showExpiringOnly) {
        if (!credential.expiry_date) return false;
        
        const expiryDate = new Date(credential.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return matchesSearch && daysUntilExpiry < 90;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime();
      } else if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agency's certifications and qualifications.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Credential</span>
        </Button>
      </div>

      {expiringCredentials.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Credentials Requiring Attention
            </CardTitle>
            <CardDescription>
              The following credentials are expiring soon or have already expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-12 bg-white p-3 text-sm font-medium">
                <div className="col-span-4">Credential</div>
                <div className="col-span-2">Issuer</div>
                <div className="col-span-2">Issue Date</div>
                <div className="col-span-2">Expiry Date</div>
                <div className="col-span-2">Status</div>
              </div>
              <div className="divide-y bg-white">
                {expiringCredentials.map((credential) => {
                  const { status, statusClass } = getCredentialStatus(credential.expiry_date);
                  
                  return (
                    <div
                      key={credential.id}
                      className="grid grid-cols-12 p-3 items-center hover:bg-muted/50 transition-colors"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md overflow-hidden">
                          <img
                            src={credential.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${credential.issuer.substring(0, 2)}&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff`}
                            alt={credential.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{credential.title}</p>
                        </div>
                      </div>
                      <div className="col-span-2">{credential.issuer}</div>
                      <div className="col-span-2">
                        {new Date(credential.issue_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <div className="col-span-2">
                        {credential.expiry_date && new Date(credential.expiry_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusClass}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search credentials..."
                  className="pl-8 h-9 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant={showExpiringOnly ? "default" : "outline"} 
                size="sm" 
                className="h-9"
                onClick={() => setShowExpiringOnly(!showExpiringOnly)}
              >
                <Clock className="h-4 w-4 mr-2" />
                {showExpiringOnly ? "Show All" : "Expiring Soon"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCredentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCredentials.map((credential) => {
                const { status, statusClass } = getCredentialStatus(credential.expiry_date);
                
                return (
                  <div
                    key={credential.id}
                    className="border rounded-lg overflow-hidden group hover:shadow-md transition-all"
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={credential.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${credential.issuer.substring(0, 2)}&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff`}
                          alt={credential.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {credential.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {credential.issuer}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCredential(credential)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {credential.credential_url && (
                            <DropdownMenuItem onClick={() => window.open(credential.credential_url, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Certificate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => confirmDeleteCredential(credential.id!)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(credential.issue_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                            {credential.expiry_date && (
                              <>
                                {" - "}
                                {new Date(credential.expiry_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </>
                            )}
                          </span>
                        </div>
                        {credential.expiry_date && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>
                            {status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2 mb-3">
                        {credential.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {credential.credential_id && (
                          <div className="text-xs text-muted-foreground">
                            ID: {credential.credential_id}
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Add to Proposal
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Add New Credential</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Showcase your agency's certifications and qualifications.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credential
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddCredentialModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveCredential}
      />
      
      <EditCredentialModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleUpdateCredential}
        credential={selectedCredential}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Credential
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the credential
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCredential();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
