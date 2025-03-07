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
} from "lucide-react";
import Link from "next/link";

export default function ServicePage({ params }: { params: { id: string } }) {
  // This would normally fetch real data from the database based on the ID
  const service = {
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
          "Based on our findings, we develop a comprehensive brand strategy including positioning, messaging, and value proposition.",
      },
      {
        name: "Design",
        description:
          "Our creative team develops visual identity elements that bring your brand to life, including logo, color palette, typography, and more.",
      },
      {
        name: "Implementation",
        description:
          "We create comprehensive brand guidelines and application examples to ensure consistent implementation across all touchpoints.",
      },
      {
        name: "Refinement",
        description:
          "Based on your feedback, we refine and finalize all brand elements to ensure they perfectly represent your vision.",
      },
    ],
    deliverables: [
      "Brand Strategy Document",
      "Brand Positioning Statement",
      "Messaging Framework",
      "Logo Suite (Primary, Secondary, Favicon)",
      "Color Palette",
      "Typography System",
      "Brand Guidelines (Digital PDF)",
      "Brand Application Examples",
    ],
    relatedServices: [
      "Website Design & Development",
      "Marketing Collateral Design",
      "Social Media Strategy",
    ],
    caseStudies: [
      {
        title: "Brand Refresh for Tech Startup",
        client: "InnovateTech",
        result: "35% increase in brand recognition",
      },
      {
        title: "New Brand Identity for Financial Services",
        client: "Secure Capital",
        result: "28% improvement in customer trust metrics",
      },
    ],
    testimonials: [
      {
        quote:
          "The brand strategy process was incredibly thorough and resulted in a brand identity that perfectly captures our company's vision and values.",
        author: "Sarah Johnson",
        title: "CEO, InnovateTech",
      },
    ],
    team: [
      "Creative Director",
      "Brand Strategist",
      "Graphic Designer",
      "Copywriter",
    ],
    faq: [
      {
        question: "How long does the brand strategy process take?",
        answer:
          "Typically, our brand strategy and identity projects take 4-6 weeks from start to finish, depending on the complexity and scope of the project.",
      },
      {
        question: "What if I only need certain elements of the brand package?",
        answer:
          "We offer customized packages based on your specific needs. Contact us to discuss a tailored approach for your business.",
      },
      {
        question: "Do you provide brand implementation support?",
        answer:
          "Yes, we can help implement your new brand across various touchpoints including website, marketing materials, social media, and more.",
      },
    ],
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
              <div className="flex items-center gap-4">
                <div className="text-4xl">{service.icon}</div>
                <div>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {service.category}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="whitespace-pre-line">{service.description}</p>

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Our Process</h3>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-4 pb-4"
                    >
                      <h4 className="font-semibold">
                        {index + 1}. {step.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Deliverables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">FAQ</h3>
                <div className="space-y-4">
                  {service.faq.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-medium">{item.question}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Studies</CardTitle>
              <CardDescription>
                Examples of our {service.name.toLowerCase()} work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.caseStudies.map((caseStudy, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{caseStudy.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {caseStudy.client}
                    </p>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span>{caseStudy.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-4"
                  >
                    <p className="italic text-gray-700 mb-3">
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

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Price Range
                </h4>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p>{service.priceRange}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Timeline
                </h4>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{service.timeline}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Category
                </h4>
                <p>{service.category}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Involved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {service.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {service.relatedServices.map((relatedService, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>{relatedService}</span>
                    </div>
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
                <FolderKanban className="h-4 w-4 mr-2" />
                <span>View Case Studies</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquareQuote className="h-4 w-4 mr-2" />
                <span>View Testimonials</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
