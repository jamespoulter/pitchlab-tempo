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
} from "lucide-react";
import Link from "next/link";

export default function TestimonialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // This would normally fetch real data from the database based on the ID
  const testimonial = {
    id: params.id,
    clientName: "John Smith",
    clientTitle: "CEO",
    companyName: "Acme Inc.",
    quote:
      "Working with this agency transformed our brand identity and online presence. Their strategic approach and creative solutions exceeded our expectations and delivered measurable results. The team was responsive, professional, and truly understood our business goals. We saw a 45% increase in qualified leads within the first three months of implementing their recommendations. I would highly recommend them to any business looking to elevate their digital marketing strategy.",
    rating: 5,
    date: "2023-08-15",
    projectType: "Website Redesign & Digital Marketing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    featured: true,
    contactInfo: {
      email: "john@acmeinc.com",
      phone: "+1 (555) 123-4567",
    },
    projectDetails: {
      startDate: "2023-01-10",
      endDate: "2023-06-30",
      services: [
        "Website Redesign",
        "SEO Optimization",
        "Content Strategy",
        "PPC Campaign",
      ],
      results: [
        "45% increase in qualified leads",
        "28% improvement in conversion rate",
        "65% increase in organic traffic",
      ],
    },
    relatedCaseStudies: [
      "Acme Inc. Website Redesign",
      "Acme Inc. Digital Marketing Campaign",
    ],
  };

  // Generate stars based on rating
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/testimonials">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Testimonials</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            <span>Add to Proposal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Client Testimonial</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>
                        {testimonial.companyName} • {testimonial.projectType}
                      </span>
                    </div>
                  </CardDescription>
                </div>
                {testimonial.featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.clientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.clientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.clientTitle}, {testimonial.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {stars}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {testimonial.rating}/5
                  </span>
                </div>
                <p className="italic text-gray-700 text-lg mb-3">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(testimonial.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Project Results</h3>
                <div className="space-y-3">
                  {testimonial.projectDetails.results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-md p-3"
                    >
                      <Star className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">
                  Services Provided
                </h3>
                <div className="flex flex-wrap gap-2">
                  {testimonial.projectDetails.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Case Studies</CardTitle>
              <CardDescription>
                Case studies related to this testimonial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testimonial.relatedCaseStudies.map((caseStudy, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{caseStudy}</span>
                    </div>
                    <Button variant="link" size="sm" className="mt-2 h-8 pl-0">
                      View Case Study
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Company:</span>
                  <span>{testimonial.companyName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Project Type:</span>
                  <span>{testimonial.projectType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{testimonial.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{testimonial.contactInfo.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Start Date:</span>
                  <span>
                    {new Date(
                      testimonial.projectDetails.startDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">End Date:</span>
                  <span>
                    {new Date(
                      testimonial.projectDetails.endDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Testimonial Date:</span>
                  <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                </div>
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
                <Share className="h-4 w-4 mr-2" />
                <span>Share Testimonial</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                <span>Copy Quote</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Request Follow-up</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
