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
} from "lucide-react";
import Link from "next/link";

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  // This would normally fetch real data from the database based on the ID
  const caseStudy = {
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
      "Our team conducted extensive user research and competitive analysis to identify pain points in the customer journey. We redesigned the entire e-commerce experience with a focus on mobile-first design, simplified navigation, and an optimized checkout process. Key improvements included:
      
      1. Streamlined product categorization and filtering
      2. Enhanced product pages with better imagery and clearer information
      3. Simplified 3-step checkout process
      4. Improved site performance with 40% faster loading times
      5. Personalized product recommendations
      6. Responsive design optimized for all devices",
    results:
      "Within three months of launching the redesigned e-commerce platform, the client experienced:
      
      • 45% increase in conversion rate (from 1.2% to 1.74%)
      • 32% reduction in cart abandonment
      • 28% increase in average order value
      • 52% increase in mobile conversions
      • 22% increase in time spent on site
      • 18% increase in returning customers
      
      The improvements resulted in an estimated $1.2 million in additional annual revenue.",
    testimonial: {
      quote:
        "The redesign completely transformed our online business. The team's strategic approach to understanding our customers' needs and translating that into an intuitive shopping experience has had a tremendous impact on our bottom line.",
      author: "Jane Smith",
      title: "E-commerce Director",
    },
    team: ["Sarah Johnson", "Michael Chen", "David Kim"],
    duration: "12 weeks",
    tools: ["Figma", "React", "Shopify", "Google Analytics", "Hotjar"],
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&q=80",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/case-studies">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Case Studies</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            <span>Add to Proposal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={caseStudy.image}
                alt={caseStudy.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{caseStudy.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>
                        {caseStudy.client} • {caseStudy.industry}
                      </span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(caseStudy.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {caseStudy.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Challenge</h3>
                <p className="whitespace-pre-line">{caseStudy.challenge}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Solution</h3>
                <p className="whitespace-pre-line">{caseStudy.solution}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <p className="whitespace-pre-line">{caseStudy.results}</p>
              </div>

              <div className="border-t pt-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="italic text-gray-700 mb-3">
                    "{caseStudy.testimonial.quote}"
                  </p>
                  <p className="font-medium">
                    {caseStudy.testimonial.author},{" "}
                    <span className="font-normal text-gray-600">
                      {caseStudy.testimonial.title}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Project Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {caseStudy.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-md overflow-hidden border"
                    >
                      <img
                        src={image}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Client
                </h4>
                <p>{caseStudy.client}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Industry
                </h4>
                <p>{caseStudy.industry}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Duration
                </h4>
                <p>{caseStudy.duration}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Completion Date
                </h4>
                <p>
                  {new Date(caseStudy.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {caseStudy.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                      {member.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools & Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {caseStudy.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "45% increase in conversion rate",
                  "32% reduction in cart abandonment",
                  "28% increase in average order value",
                  "$1.2M additional annual revenue",
                ].map((result, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{result}</span>
                  </div>
                ))}
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
                <Download className="h-4 w-4 mr-2" />
                <span>Download PDF</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                <span>View Live Project</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
