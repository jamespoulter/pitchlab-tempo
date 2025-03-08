"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle,
  Edit,
  FileText,
  Users,
  FolderKanban,
  MessageSquareQuote,
  Save,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getServiceById, updateService } from "@/utils/supabase-client";
import { Service } from "@/types/agency";
import { toast } from "sonner";

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the service data
  const [service, setService] = useState<Service>({
    id: params.id,
    name: "",
    description: "",
    features: [],
    priceRange: "",
    timeline: "",
    category: "",
    icon: "🎨",
    deliverables: [],
    process: [],
    faq: [],
    testimonials: [],
  });
  
  // State for new feature input
  const [newFeature, setNewFeature] = useState("");
  const [newDeliverable, setNewDeliverable] = useState("");
  
  // State for new process step
  const [newProcess, setNewProcess] = useState({
    name: "",
    description: "",
  });
  
  // State for new FAQ
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
  });

  // Fetch service data on component mount
  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    setIsLoading(true);
    try {
      const data = await getServiceById(params.id);
      if (data) {
        setService({
          ...data,
          process: data.process || [],
          faq: data.faq || [],
          testimonials: data.testimonials || [],
        });
      } else {
        toast.error("Service not found");
        router.push("/dashboard/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const { success, error } = await updateService(params.id, service);
      
      if (success) {
        toast.success("Service updated successfully");
        // Exit edit mode
        router.push(`/dashboard/services/${params.id}`);
      } else {
        toast.error("Failed to update service");
        console.error("Error updating service:", error);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error updating service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setService({
        ...service,
        features: [...service.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setService({
      ...service,
      features: service.features.filter((_, i) => i !== index),
    });
  };
  
  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setService({
        ...service,
        deliverables: [...service.deliverables, newDeliverable.trim()],
      });
      setNewDeliverable("");
    }
  };
  
  const handleRemoveDeliverable = (index: number) => {
    setService({
      ...service,
      deliverables: service.deliverables.filter((_, i) => i !== index),
    });
  };
  
  const handleAddProcess = () => {
    if (newProcess.name.trim() && newProcess.description.trim()) {
      setService({
        ...service,
        process: [...(service.process || []), { ...newProcess }],
      });
      setNewProcess({
        name: "",
        description: "",
      });
    }
  };
  
  const handleRemoveProcess = (index: number) => {
    if (!service.process) return;
    setService({
      ...service,
      process: service.process.filter((_, i) => i !== index),
    });
  };
  
  const handleAddFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      setService({
        ...service,
        faq: [...(service.faq || []), { ...newFAQ }],
      });
      setNewFAQ({
        question: "",
        answer: "",
      });
    }
  };
  
  const handleRemoveFAQ = (index: number) => {
    if (!service.faq) return;
    setService({
      ...service,
      faq: service.faq.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            {isEditMode ? (
              <Input
                value={service.name}
                onChange={(e) => setService({ ...service, name: e.target.value })}
                className="text-2xl font-bold h-auto py-1 px-2"
                disabled={isSubmitting}
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">Category:</span>
              {isEditMode ? (
                <Input
                  value={service.category}
                  onChange={(e) => setService({ ...service, category: e.target.value })}
                  className="h-7 py-1 px-2"
                  disabled={isSubmitting}
                />
              ) : (
                <span className="text-blue-600 font-medium">{service.category}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/dashboard/services/${params.id}`)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button 
              className="gap-1"
              onClick={() => router.push(`/dashboard/services/${params.id}?edit=true`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Service</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Service Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{service.icon}</span>
                <span>Service Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Price Range</div>
                {isEditMode ? (
                  <Input
                    value={service.priceRange}
                    onChange={(e) => setService({ ...service, priceRange: e.target.value })}
                    className="h-9"
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{service.priceRange}</span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Timeline</div>
                {isEditMode ? (
                  <Input
                    value={service.timeline}
                    onChange={(e) => setService({ ...service, timeline: e.target.value })}
                    className="h-9"
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{service.timeline}</span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Key Features</div>
                {isEditMode ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
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
                        placeholder="Add feature"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        size="sm"
                        disabled={isSubmitting}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Deliverables</div>
                {isEditMode ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {service.deliverables.map((deliverable, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm"
                        >
                          {deliverable}
                          <button
                            type="button"
                            onClick={() => handleRemoveDeliverable(index)}
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
                        placeholder="Add deliverable"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDeliverable();
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        onClick={handleAddDeliverable}
                        size="sm"
                        disabled={isSubmitting}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {service.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Description, Process, FAQ */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Textarea
                  value={service.description}
                  onChange={(e) => setService({ ...service, description: e.target.value })}
                  className="min-h-[150px]"
                  disabled={isSubmitting}
                />
              ) : (
                <p className="whitespace-pre-line">{service.description}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                <span>Process</span>
              </CardTitle>
              {isEditMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddProcess}
                  disabled={!newProcess.name.trim() || !newProcess.description.trim() || isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditMode && (
                <div className="mb-6 p-4 border rounded-md bg-muted/20">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="processName">Step Name</Label>
                      <Input
                        id="processName"
                        value={newProcess.name}
                        onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                        placeholder="e.g. Discovery"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="processDescription">Description</Label>
                      <Textarea
                        id="processDescription"
                        value={newProcess.description}
                        onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
                        placeholder="Describe this step of the process..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {service.process?.map((step, index) => (
                  <div key={index} className="relative">
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProcess(index)}
                        className="absolute right-0 top-0 text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-medium">
                        {index + 1}
                      </div>
                      {isEditMode ? (
                        <Input
                          value={step.name}
                          onChange={(e) => {
                            const updatedProcess = [...(service.process || [])];
                            updatedProcess[index].name = e.target.value;
                            setService({
                              ...service,
                              process: updatedProcess,
                            });
                          }}
                          className="font-medium"
                          disabled={isSubmitting}
                        />
                      ) : (
                        <h3 className="font-medium">{step.name}</h3>
                      )}
                    </div>
                    {isEditMode ? (
                      <Textarea
                        value={step.description}
                        onChange={(e) => {
                          const updatedProcess = [...(service.process || [])];
                          updatedProcess[index].description = e.target.value;
                          setService({
                            ...service,
                            process: updatedProcess,
                          });
                        }}
                        className="ml-10"
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="ml-10 text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                ))}
                
                {(!service.process || service.process.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    {isEditMode ? "Add steps to describe your service process" : "No process steps defined yet"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Frequently Asked Questions</CardTitle>
              {isEditMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddFAQ}
                  disabled={!newFAQ.question.trim() || !newFAQ.answer.trim() || isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add FAQ
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditMode && (
                <div className="mb-6 p-4 border rounded-md bg-muted/20">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="faqQuestion">Question</Label>
                      <Input
                        id="faqQuestion"
                        value={newFAQ.question}
                        onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                        placeholder="e.g. How long does the process take?"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="faqAnswer">Answer</Label>
                      <Textarea
                        id="faqAnswer"
                        value={newFAQ.answer}
                        onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                        placeholder="Provide a detailed answer..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-6 divide-y">
                {service.faq?.map((faq, index) => (
                  <div key={index} className={index > 0 ? "pt-6" : ""}>
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            value={faq.question}
                            onChange={(e) => {
                              const updatedFAQ = [...(service.faq || [])];
                              updatedFAQ[index].question = e.target.value;
                              setService({
                                ...service,
                                faq: updatedFAQ,
                              });
                            }}
                            className="font-medium"
                            disabled={isSubmitting}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFAQ(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 ml-2"
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const updatedFAQ = [...(service.faq || [])];
                            updatedFAQ[index].answer = e.target.value;
                            setService({
                              ...service,
                              faq: updatedFAQ,
                            });
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </>
                    )}
                  </div>
                ))}
                
                {(!service.faq || service.faq.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    {isEditMode ? "Add frequently asked questions about your service" : "No FAQs defined yet"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
