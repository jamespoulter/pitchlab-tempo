"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  
  // State for the service data
  const [service, setService] = useState({
    id: params.id,
    name: "Brand Strategy & Identity",
    description:
      "Comprehensive brand development including positioning, messaging, visual identity, and guidelines. Our strategic approach ensures your brand stands out in the market and resonates with your target audience. We create cohesive brand experiences that build recognition and loyalty.",
    features: [
      "Brand Audit & Research",
      "Positioning & Messaging",
      "Visual Identity Design",
      "Brand Guidelines",
      "Logo Design & Variations",
      "Color Palette & Typography",
      "Brand Voice & Tone",
      "Brand Application Examples",
    ],
    priceRange: "$5,000 - $15,000",
    timeline: "4-6 weeks",
    category: "Branding",
    icon: "🎨",
    process: [
      {
        name: "Discovery",
        description:
          "We conduct in-depth research to understand your business, audience, competitors, and market position.",
      },
      {
        name: "Strategy",
        description:
          "We develop a comprehensive brand strategy that defines your positioning, messaging, and unique value proposition.",
      },
      {
        name: "Design",
        description:
          "We create visual identity elements that bring your brand to life, including logo, color palette, typography, and more.",
      },
      {
        name: "Implementation",
        description:
          "We provide guidelines and assets for consistent application of your brand across all touchpoints.",
      },
    ],
    deliverables: [
      "Brand Strategy Document",
      "Brand Guidelines PDF",
      "Logo Files (Vector & Raster)",
      "Brand Assets Package",
      "Implementation Recommendations",
    ],
    faq: [
      {
        question: "How long does the brand strategy process take?",
        answer:
          "The typical timeline is 4-6 weeks, depending on the complexity of your business and the scope of the project.",
      },
      {
        question: "Do you provide ongoing brand support?",
        answer:
          "Yes, we offer ongoing brand management and consultation services to ensure consistent application and evolution of your brand.",
      },
      {
        question: "What if I only need a logo design?",
        answer:
          "While we recommend a comprehensive approach to branding, we can provide standalone logo design services tailored to your needs.",
      },
    ],
    testimonials: [
      {
        quote:
          "The brand strategy process was incredibly thorough and insightful. The resulting brand identity perfectly captures our company's vision and has been instrumental in our growth.",
        author: "Sarah Johnson",
        title: "CEO, Tech Startup",
      },
    ],
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
  
  const handleSave = () => {
    // Here you would normally save the data to your database
    console.log("Saving service:", service);
    alert("Service saved successfully!");
    
    // Exit edit mode
    router.push(`/dashboard/services/${params.id}`);
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
        process: [...service.process, { ...newProcess }],
      });
      setNewProcess({
        name: "",
        description: "",
      });
    }
  };
  
  const handleRemoveProcess = (index: number) => {
    setService({
      ...service,
      process: service.process.filter((_, i) => i !== index),
    });
  };
  
  const handleAddFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      setService({
        ...service,
        faq: [...service.faq, { ...newFAQ }],
      });
      setNewFAQ({
        question: "",
        answer: "",
      });
    }
  };
  
  const handleRemoveFAQ = (index: number) => {
    setService({
      ...service,
      faq: service.faq.filter((_, i) => i !== index),
    });
  };

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
              <Button variant="outline" onClick={() => router.push(`/dashboard/services/${params.id}`)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
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
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {isEditMode ? (
                    <Input
                      value={service.icon}
                      onChange={(e) => setService({ ...service, icon: e.target.value })}
                      className="w-16 text-center text-2xl"
                    />
                  ) : (
                    service.icon
                  )}
                </div>
                <div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>
                    {service.category} • {service.timeline} • {service.priceRange}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                {isEditMode ? (
                  <Textarea
                    value={service.description}
                    onChange={(e) => setService({ ...service, description: e.target.value })}
                    className="min-h-[150px]"
                  />
                ) : (
                  <p className="text-gray-700">{service.description}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  {isEditMode && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add new feature"
                        className="w-64"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleAddFeature}
                        disabled={!newFeature.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        {isEditMode ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const updatedFeatures = [...service.features];
                                updatedFeatures[index] = e.target.value;
                                setService({
                                  ...service,
                                  features: updatedFeatures,
                                });
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFeature(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span>{feature}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Our Process</h3>
                  {isEditMode && (
                    <Button
                      size="sm"
                      onClick={handleAddProcess}
                      disabled={!newProcess.name.trim() || !newProcess.description.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  )}
                </div>
                {isEditMode && (
                  <div className="mb-4 p-4 border rounded-md space-y-3">
                    <div>
                      <Label htmlFor="processName">Step Name</Label>
                      <Input
                        id="processName"
                        value={newProcess.name}
                        onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                        placeholder="e.g., Discovery"
                      />
                    </div>
                    <div>
                      <Label htmlFor="processDescription">Description</Label>
                      <Textarea
                        id="processDescription"
                        value={newProcess.description}
                        onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
                        placeholder="Describe this step of the process..."
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-4 pb-4"
                    >
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Input
                              value={step.name}
                              onChange={(e) => {
                                const updatedProcess = [...service.process];
                                updatedProcess[index].name = e.target.value;
                                setService({
                                  ...service,
                                  process: updatedProcess,
                                });
                              }}
                              className="font-semibold"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveProcess(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={step.description}
                            onChange={(e) => {
                              const updatedProcess = [...service.process];
                              updatedProcess[index].description = e.target.value;
                              setService({
                                ...service,
                                process: updatedProcess,
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-lg">{step.name}</h4>
                          <p className="text-gray-700 mt-1">{step.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Deliverables</h3>
                  {isEditMode && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newDeliverable}
                        onChange={(e) => setNewDeliverable(e.target.value)}
                        placeholder="Add new deliverable"
                        className="w-64"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDeliverable();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleAddDeliverable}
                        disabled={!newDeliverable.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        {isEditMode ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={deliverable}
                              onChange={(e) => {
                                const updatedDeliverables = [...service.deliverables];
                                updatedDeliverables[index] = e.target.value;
                                setService({
                                  ...service,
                                  deliverables: updatedDeliverables,
                                });
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveDeliverable(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span>{deliverable}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                  {isEditMode && (
                    <Button
                      size="sm"
                      onClick={handleAddFAQ}
                      disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add FAQ
                    </Button>
                  )}
                </div>
                {isEditMode && (
                  <div className="mb-4 p-4 border rounded-md space-y-3">
                    <div>
                      <Label htmlFor="faqQuestion">Question</Label>
                      <Input
                        id="faqQuestion"
                        value={newFAQ.question}
                        onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                        placeholder="e.g., How long does the process take?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faqAnswer">Answer</Label>
                      <Textarea
                        id="faqAnswer"
                        value={newFAQ.answer}
                        onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                        placeholder="Provide a detailed answer..."
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {service.faq.map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Input
                              value={item.question}
                              onChange={(e) => {
                                const updatedFAQ = [...service.faq];
                                updatedFAQ[index].question = e.target.value;
                                setService({
                                  ...service,
                                  faq: updatedFAQ,
                                });
                              }}
                              className="font-semibold"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFAQ(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={item.answer}
                            onChange={(e) => {
                              const updatedFAQ = [...service.faq];
                              updatedFAQ[index].answer = e.target.value;
                              setService({
                                ...service,
                                faq: updatedFAQ,
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold">{item.question}</h4>
                          <p className="text-gray-700 mt-2">{item.answer}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Price Range
                </h3>
                {isEditMode ? (
                  <Input
                    value={service.priceRange}
                    onChange={(e) => setService({ ...service, priceRange: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <p className="font-medium">{service.priceRange}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Timeline
                </h3>
                {isEditMode ? (
                  <Input
                    value={service.timeline}
                    onChange={(e) => setService({ ...service, timeline: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{service.timeline}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Category
                </h3>
                {isEditMode ? (
                  <select
                    value={service.category}
                    onChange={(e) => setService({ ...service, category: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="Branding">Branding</option>
                    <option value="Web">Web</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Content">Content</option>
                    <option value="Social Media">Social Media</option>
                    <option value="SEO">SEO</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                ) : (
                  <p className="font-medium">{service.category}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                <span>Add to Proposal</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                <span>Assign Team</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FolderKanban className="h-4 w-4 mr-2" />
                <span>Create Project</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg">
                    <MessageSquareQuote className="h-5 w-5 text-blue-500 mb-2" />
                    <p className="italic text-gray-700 mb-2">
                      "{testimonial.quote}"
                    </p>
                    <p className="font-medium">
                      {testimonial.author},{" "}
                      <span className="font-normal text-gray-600">
                        {testimonial.title}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
