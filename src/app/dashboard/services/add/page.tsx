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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X, Upload } from "lucide-react";
import Link from "next/link";

export default function AddServicePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [icon, setIcon] = useState("📊");
  const [process, setProcess] = useState<{name: string; description: string}[]>([]);
  const [newProcess, setNewProcess] = useState({name: "", description: ""});
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");
  const [faq, setFaq] = useState<{question: string; answer: string}[]>([]);
  const [newFaq, setNewFaq] = useState({question: "", answer: ""});

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addProcess = () => {
    if (newProcess.name.trim() && newProcess.description.trim()) {
      setProcess([...process, { ...newProcess }]);
      setNewProcess({name: "", description: ""});
    }
  };

  const removeProcess = (index: number) => {
    setProcess(process.filter((_, i) => i !== index));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaq([...faq, { ...newFaq }]);
      setNewFaq({question: "", answer: ""});
    }
  };

  const removeFaq = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the service to your database
    console.log({
      name,
      description,
      features,
      priceRange,
      timeline,
      category,
      icon,
      process,
      deliverables,
      faq,
    });
    // Redirect to services list after saving
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/services">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Button>
        </Link>
        <Button type="submit" form="service-form" className="gap-1">
          <Save className="h-4 w-4" />
          <span>Save Service</span>
        </Button>
      </div>

      <form id="service-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
                <CardDescription>
                  Add details about this service offering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Brand Strategy & Identity"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                      >
                        <option value="Marketing">Marketing</option>
                        <option value="Branding">Branding</option>
                        <option value="Web">Web</option>
                        <option value="Design">Design</option>
                        <option value="Content">Content</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <select
                        id="icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                      >
                        <option value="📊">📊 Chart</option>
                        <option value="🎨">🎨 Paint</option>
                        <option value="💻">💻 Computer</option>
                        <option value="📱">📱 Mobile</option>
                        <option value="🔍">🔍 Search</option>
                        <option value="✍️">✍️ Writing</option>
                        <option value="📈">📈 Growth</option>
                        <option value="🎯">🎯 Target</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Comprehensive description of the service..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Input
                      id="priceRange"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="$5,000 - $15,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="4-6 weeks"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  What's included in this service?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature (e.g., 'Brand Audit & Research')"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mt-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process</CardTitle>
                <CardDescription>
                  Describe your service delivery process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="processName">Step Name</Label>
                      <Input
                        id="processName"
                        value={newProcess.name}
                        onChange={(e) => setNewProcess({...newProcess, name: e.target.value})}
                        placeholder="Discovery"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="processDescription">Description</Label>
                      <Input
                        id="processDescription"
                        value={newProcess.description}
                        onChange={(e) => setNewProcess({...newProcess, description: e.target.value})}
                        placeholder="We conduct in-depth research to understand your business..."
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addProcess}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Process Step
                  </Button>
                </div>

                <div className="space-y-2 mt-4">
                  {process.map((step, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{index + 1}. {step.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeProcess(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
                <CardDescription>
                  What will clients receive?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      placeholder="Add a deliverable (e.g., 'Brand Guidelines (Digital PDF)')"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addDeliverable();
                        }
                      }}
                    />
                    <Button type="button" onClick={addDeliverable}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mt-2">
                    {deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <span className="text-sm">{deliverable}</span>
                        <button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Icon</CardTitle>
                <CardDescription>
                  Upload a custom icon (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-md bg-blue-50 flex items-center justify-center mb-4">
                    <span className="text-4xl">{icon}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">Drag & drop an image or</p>
                  <Input
                    id="customIcon"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      // In a real app, you would upload the file and get a URL
                      // This is just a placeholder
                      if (e.target.files && e.target.files[0]) {
                        console.log("Custom icon would be uploaded here");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("customIcon")?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>
                  Common questions about this service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faqQuestion">Question</Label>
                  <Input
                    id="faqQuestion"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                    placeholder="How long does the process take?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faqAnswer">Answer</Label>
                  <Textarea
                    id="faqAnswer"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                    placeholder="Typically, our process takes 4-6 weeks..."
                    rows={2}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add FAQ
                </Button>

                <div className="space-y-3 mt-4">
                  {faq.map((item, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.question}</h4>
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Content</CardTitle>
                <CardDescription>
                  Link this service to other content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="relatedCaseStudies">Related Case Studies</Label>
                  <select
                    id="relatedCaseStudies"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    multiple
                  >
                    <option value="1">E-commerce Redesign</option>
                    <option value="2">B2B Lead Generation</option>
                    <option value="3">Brand Refresh</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relatedServices">Related Services</Label>
                  <select
                    id="relatedServices"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    multiple
                  >
                    <option value="1">Website Design & Development</option>
                    <option value="2">Digital Marketing Campaign</option>
                    <option value="3">Content Strategy</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Feature this service
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="public"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <Label htmlFor="public" className="text-sm font-medium">
                    Make visible in proposals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="website"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <Label htmlFor="website" className="text-sm font-medium">
                    Show on website
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
