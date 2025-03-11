"use client";

import { useEffect, useState } from "react";
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
  Mail,
  Phone,
  Star,
  MessageSquare,
  Briefcase,
  Share,
  Copy,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Testimonial } from "@/types/agency";
import { getTestimonialById } from "@/utils/supabase-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TestimonialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setIsLoading(true);
        const data = await getTestimonialById(params.id);
        setTestimonial(data);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
        toast.error("Failed to load testimonial");
        router.push("/dashboard/testimonials");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonial();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Testimonial not found</h3>
        <p className="text-muted-foreground mb-4">
          The testimonial you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard/testimonials">Back to Testimonials</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/testimonials">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Testimonials</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Testimonial Details
          </h1>
          <p className="text-muted-foreground mt-1">
            {testimonial.client_company} • {testimonial.project_type}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button asChild className="gap-1">
            <Link href={`/dashboard/testimonials/${testimonial.id}/edit`}>
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Client Testimonial</CardTitle>
            <CardDescription>
              Detailed view of the client testimonial and feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {testimonial.featured && (
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                Featured Testimonial
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={testimonial.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.client_name}`}
                  alt={testimonial.client_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.client_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.client_position}, {testimonial.client_company}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (testimonial.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {testimonial.rating}/5
                  </span>
                </div>
              </div>
            </div>

            <blockquote className="border-l-4 border-gray-200 pl-4 italic">
              "{testimonial.content}"
            </blockquote>

            {testimonial.date && (
              <div className="text-sm text-muted-foreground">
                Testimonial received on{" "}
                {new Date(testimonial.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            {testimonial.project_details?.results && testimonial.project_details.results.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Project Results</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {testimonial.project_details.results.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonial.project_details?.services && testimonial.project_details.services.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Services Provided</h4>
                  <div className="flex flex-wrap gap-1">
                    {testimonial.project_details.services.map((service, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testimonial.related_case_studies && testimonial.related_case_studies.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Case studies related to this testimonial
                  </h4>
                  <ul className="space-y-2">
                    {testimonial.related_case_studies.map((caseStudy, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{caseStudy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{testimonial.client_company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{testimonial.project_type}</span>
              </div>
              {testimonial.contact_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{testimonial.contact_info.email}</span>
                </div>
              )}
              {testimonial.contact_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{testimonial.contact_info.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonial.project_details?.start_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Start Date
                  </span>
                  <span className="font-medium">
                    {new Date(
                      testimonial.project_details.start_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {testimonial.project_details?.end_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="font-medium">
                    {new Date(
                      testimonial.project_details.end_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Testimonial Date:</span>
                <span>{testimonial.date ? new Date(testimonial.date).toLocaleDateString() : "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
