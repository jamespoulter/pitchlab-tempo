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
  Calendar,
  Building,
  FileText,
  Edit,
  Share,
  Download,
  ArrowUpRight,
  CheckCircle,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  
  // State for the case study data
  const [caseStudy, setCaseStudy] = useState({
    id: params.id,
    title: "E-commerce Redesign Boosts Conversion by 45%",
    client: "Fashion Retailer",
    industry: "E-commerce",
    date: "2023-09-15",
    image:
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
    tags: ["Web Design", "UX/UI", "Conversion Optimization"],
    challenge:
      "The client, a well-established fashion retailer, was experiencing a high cart abandonment rate of 78% and a conversion rate of only 1.2% on their e-commerce platform. Their existing website had an outdated design, slow loading times, and a complicated checkout process that frustrated users. Mobile users, who accounted for 65% of their traffic, had an even worse experience with a non-responsive design.",
    solution:
      "Our team conducted extensive user research and competitive analysis to identify pain points in the customer journey. We redesigned the entire e-commerce experience with a focus on mobile-first design, simplified navigation, and an optimized checkout process. Key improvements included:\n\n1. Streamlined product categorization and filtering\n2. Enhanced product pages with better imagery and clearer information\n3. Simplified 3-step checkout process\n4. Improved site performance with 40% faster loading times\n5. Personalized product recommendations\n6. Responsive design optimized for all devices",
    results:
      "Within three months of launching the redesigned e-commerce platform, the client experienced:\n\n• 45% increase in conversion rate (from 1.2% to 1.74%)\n• 32% reduction in cart abandonment\n• 28% increase in average order value\n• 52% increase in mobile conversions\n• 18% increase in time spent on site\n• 40% decrease in page load time",
    testimonial: {
      quote:
        "The redesign completely transformed our online business. Not only did we see immediate improvements in our conversion rates, but the enhanced user experience has led to increased customer satisfaction and loyalty.",
      author: "Sarah Johnson",
      title: "E-commerce Director, Fashion Retailer",
    },
    keyMetrics: [
      { label: "Conversion Rate Increase", value: "45%" },
      { label: "Cart Abandonment Reduction", value: "32%" },
      { label: "Mobile Conversion Increase", value: "52%" },
      { label: "Page Load Time Decrease", value: "40%" },
    ],
    teamMembers: [
      "Lead UX Designer: Alex Chen",
      "UI Designer: Maria Rodriguez",
      "Frontend Developer: James Wilson",
      "Backend Developer: Priya Patel",
      "Project Manager: David Kim",
    ],
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "AWS",
      "Figma",
      "Google Analytics",
      "Hotjar",
    ],
    timeline: "12 weeks (June - September 2023)",
  });
  
  // State for new tag input
  const [newTag, setNewTag] = useState("");
  
  const handleSave = () => {
    // Here you would normally save the data to your database
    console.log("Saving case study:", caseStudy);
    alert("Case study saved successfully!");
    
    // Exit edit mode
    router.push(`/dashboard/case-studies/${params.id}`);
  };
  
  const handleAddTag = () => {
    if (newTag.trim()) {
      setCaseStudy({
        ...caseStudy,
        tags: [...caseStudy.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setCaseStudy({
      ...caseStudy,
      tags: caseStudy.tags.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/case-studies">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            {isEditMode ? (
              <Input
                value={caseStudy.title}
                onChange={(e) => setCaseStudy({ ...caseStudy, title: e.target.value })}
                className="text-2xl font-bold h-auto py-1 px-2"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{caseStudy.title}</h1>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">Client:</span>
              {isEditMode ? (
                <Input
                  value={caseStudy.client}
                  onChange={(e) => setCaseStudy({ ...caseStudy, client: e.target.value })}
                  className="h-7 py-1 px-2"
                />
              ) : (
                <span>{caseStudy.client}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => router.push(`/dashboard/case-studies/${params.id}`)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="gap-1">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button 
                className="gap-1"
                onClick={() => router.push(`/dashboard/case-studies/${params.id}?edit=true`)}
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="aspect-[21/9] w-full overflow-hidden">
              {isEditMode ? (
                <div className="p-4 space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={caseStudy.image}
                    onChange={(e) => setCaseStudy({ ...caseStudy, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              ) : (
                <img
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Challenge</h2>
                  {isEditMode ? (
                    <Textarea
                      value={caseStudy.challenge}
                      onChange={(e) => setCaseStudy({ ...caseStudy, challenge: e.target.value })}
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{caseStudy.challenge}</p>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Solution</h2>
                  {isEditMode ? (
                    <Textarea
                      value={caseStudy.solution}
                      onChange={(e) => setCaseStudy({ ...caseStudy, solution: e.target.value })}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{caseStudy.solution}</p>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Results</h2>
                  {isEditMode ? (
                    <Textarea
                      value={caseStudy.results}
                      onChange={(e) => setCaseStudy({ ...caseStudy, results: e.target.value })}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{caseStudy.results}</p>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Testimonial</h2>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    {isEditMode ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="testimonialQuote">Quote</Label>
                          <Textarea
                            id="testimonialQuote"
                            value={caseStudy.testimonial.quote}
                            onChange={(e) => setCaseStudy({
                              ...caseStudy,
                              testimonial: {
                                ...caseStudy.testimonial,
                                quote: e.target.value
                              }
                            })}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="testimonialAuthor">Author</Label>
                          <Input
                            id="testimonialAuthor"
                            value={caseStudy.testimonial.author}
                            onChange={(e) => setCaseStudy({
                              ...caseStudy,
                              testimonial: {
                                ...caseStudy.testimonial,
                                author: e.target.value
                              }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="testimonialTitle">Title</Label>
                          <Input
                            id="testimonialTitle"
                            value={caseStudy.testimonial.title}
                            onChange={(e) => setCaseStudy({
                              ...caseStudy,
                              testimonial: {
                                ...caseStudy.testimonial,
                                title: e.target.value
                              }
                            })}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-lg italic text-blue-800 mb-4">
                          "{caseStudy.testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                            {caseStudy.testimonial.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{caseStudy.testimonial.author}</p>
                            <p className="text-sm text-blue-700">
                              {caseStudy.testimonial.title}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Study Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Industry
                </h3>
                {isEditMode ? (
                  <Input
                    value={caseStudy.industry}
                    onChange={(e) => setCaseStudy({ ...caseStudy, industry: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{caseStudy.industry}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Date
                </h3>
                {isEditMode ? (
                  <Input
                    type="date"
                    value={caseStudy.date}
                    onChange={(e) => setCaseStudy({ ...caseStudy, date: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">
                    {new Date(caseStudy.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <span>{tag}</span>
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <div className="flex items-center gap-2 w-full mt-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Key Metrics
                </h3>
                <div className="space-y-3">
                  {caseStudy.keyMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      {isEditMode ? (
                        <>
                          <Input
                            value={metric.label}
                            onChange={(e) => {
                              const updatedMetrics = [...caseStudy.keyMetrics];
                              updatedMetrics[index].label = e.target.value;
                              setCaseStudy({
                                ...caseStudy,
                                keyMetrics: updatedMetrics,
                              });
                            }}
                            className="w-2/3 mr-2"
                          />
                          <Input
                            value={metric.value}
                            onChange={(e) => {
                              const updatedMetrics = [...caseStudy.keyMetrics];
                              updatedMetrics[index].value = e.target.value;
                              setCaseStudy({
                                ...caseStudy,
                                keyMetrics: updatedMetrics,
                              });
                            }}
                            className="w-1/3"
                          />
                        </>
                      ) : (
                        <>
                          <span>{metric.label}</span>
                          <span className="font-bold text-blue-600">{metric.value}</span>
                        </>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setCaseStudy({
                          ...caseStudy,
                          keyMetrics: [
                            ...caseStudy.keyMetrics,
                            { label: "New Metric", value: "0%" },
                          ],
                        });
                      }}
                    >
                      Add Metric
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Timeline
                </h3>
                {isEditMode ? (
                  <Input
                    value={caseStudy.timeline}
                    onChange={(e) => setCaseStudy({ ...caseStudy, timeline: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{caseStudy.timeline}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team & Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Team Members
                </h3>
                <ul className="space-y-1">
                  {caseStudy.teamMembers.map((member, index) => (
                    <li key={index} className="flex items-center">
                      {isEditMode ? (
                        <Input
                          value={member}
                          onChange={(e) => {
                            const updatedMembers = [...caseStudy.teamMembers];
                            updatedMembers[index] = e.target.value;
                            setCaseStudy({
                              ...caseStudy,
                              teamMembers: updatedMembers,
                            });
                          }}
                          className="mb-2"
                        />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>{member}</span>
                        </>
                      )}
                    </li>
                  ))}
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setCaseStudy({
                          ...caseStudy,
                          teamMembers: [
                            ...caseStudy.teamMembers,
                            "New Team Member",
                          ],
                        });
                      }}
                    >
                      Add Team Member
                    </Button>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      {isEditMode ? (
                        <div className="flex items-center">
                          <Input
                            value={tech}
                            onChange={(e) => {
                              const updatedTech = [...caseStudy.technologies];
                              updatedTech[index] = e.target.value;
                              setCaseStudy({
                                ...caseStudy,
                                technologies: updatedTech,
                              });
                            }}
                            className="w-24 h-6 py-0 px-1 mr-1"
                          />
                          <button
                            onClick={() => {
                              setCaseStudy({
                                ...caseStudy,
                                technologies: caseStudy.technologies.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span>{tech}</span>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCaseStudy({
                          ...caseStudy,
                          technologies: [...caseStudy.technologies, "New Tech"],
                        });
                      }}
                    >
                      Add Tech
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
