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
  Download,
  Mail,
  Copy,
  FileText,
  Briefcase,
  Award,
  FolderKanban,
  Users,
  MessageSquareQuote,
  Calendar,
  Building,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function ProposalPreviewPage() {
  // This would normally fetch real data from the database
  const proposal = {
    title: "Digital Marketing Strategy Proposal",
    client: "Acme Corporation",
    date: "2023-11-15",
    validUntil: "2023-12-15",
    summary:
      "This proposal outlines a comprehensive digital marketing strategy designed to increase Acme Corporation's online visibility, drive qualified traffic, and generate leads. Our approach combines SEO, content marketing, paid advertising, and social media to create a cohesive marketing ecosystem that delivers measurable results.",
    sections: [
      {
        id: "1",
        title: "Agency Overview",
        content: [
          {
            type: "text",
            value:
              "Creative Solutions is a full-service digital marketing agency specializing in brand strategy, web design, content creation, and digital advertising. We help businesses of all sizes establish a strong online presence and connect with their target audience.",
          },
          {
            type: "stats",
            items: [
              { label: "Years of Experience", value: "10+" },
              { label: "Successful Projects", value: "250+" },
              { label: "Client Retention Rate", value: "92%" },
              { label: "Industry Awards", value: "15" },
            ],
          },
        ],
      },
      {
        id: "2",
        title: "Credentials & Experience",
        content: [
          {
            type: "credentials",
            items: [
              {
                title: "Google Ads Certification",
                issuer: "Google",
                image:
                  "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4285F4&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
              },
              {
                title: "Facebook Blueprint Certification",
                issuer: "Meta",
                image:
                  "https://api.dicebear.com/7.x/initials/svg?seed=FB&backgroundColor=1877F2&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
              },
              {
                title: "HubSpot Inbound Marketing Certification",
                issuer: "HubSpot Academy",
                image:
                  "https://api.dicebear.com/7.x/initials/svg?seed=HS&backgroundColor=FF7A59&fontFamily=Arial&fontSize=40&fontWeight=bold&textColor=ffffff",
              },
            ],
          },
        ],
      },
      {
        id: "3",
        title: "Relevant Case Studies",
        content: [
          {
            type: "caseStudies",
            items: [
              {
                title: "E-commerce Conversion Optimization",
                client: "Fashion Retailer",
                result: "45% increase in conversion rate",
                image:
                  "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80",
              },
              {
                title: "B2B Lead Generation Campaign",
                client: "Software Company",
                result: "112% increase in qualified leads",
                image:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
              },
            ],
          },
        ],
      },
      {
        id: "4",
        title: "Team Members",
        content: [
          {
            type: "team",
            items: [
              {
                name: "Sarah Johnson",
                role: "Creative Director",
                bio: "Over 10 years of experience in brand strategy and creative direction.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
              },
              {
                name: "Michael Chen",
                role: "Lead Developer",
                bio: "Full-stack developer with expertise in React, Node.js, and cloud architecture.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
              },
              {
                name: "Jessica Rivera",
                role: "Marketing Strategist",
                bio: "Digital marketing expert specializing in data-driven campaign optimization.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
              },
            ],
          },
        ],
      },
      {
        id: "5",
        title: "Proposed Solution",
        content: [
          {
            type: "text",
            value:
              "Based on our understanding of your business goals and challenges, we propose the following digital marketing strategy:",
          },
          {
            type: "services",
            items: [
              {
                name: "SEO Optimization",
                description:
                  "Comprehensive SEO services to improve organic visibility, traffic, and rankings.",
                features: [
                  "Technical SEO Audit",
                  "Keyword Research",
                  "On-page Optimization",
                  "Link Building",
                ],
                price: "$2,500/month",
              },
              {
                name: "Content Marketing",
                description:
                  "Strategic content creation and distribution to attract, engage, and convert your target audience.",
                features: [
                  "Content Strategy",
                  "Blog Writing",
                  "Lead Magnets",
                  "Email Newsletters",
                ],
                price: "$3,000/month",
              },
              {
                name: "Paid Advertising",
                description:
                  "Targeted paid campaigns across search and social platforms to drive immediate traffic and conversions.",
                features: [
                  "Google Ads",
                  "Social Media Ads",
                  "Retargeting",
                  "Performance Tracking",
                ],
                price: "$2,000/month + Ad Spend",
              },
            ],
          },
        ],
      },
      {
        id: "6",
        title: "Pricing & Timeline",
        content: [
          {
            type: "pricing",
            total: "$7,500/month",
            notes:
              "This proposal represents a 6-month commitment with monthly reporting and quarterly strategy reviews. All prices are exclusive of applicable taxes.",
            paymentTerms: "50% upfront, 50% upon completion of each month",
          },
          {
            type: "timeline",
            items: [
              { phase: "Discovery & Strategy", duration: "2 weeks" },
              { phase: "Implementation", duration: "4 weeks" },
              { phase: "Optimization", duration: "Ongoing" },
              { phase: "Reporting", duration: "Monthly" },
            ],
          },
        ],
      },
      {
        id: "7",
        title: "Client Testimonials",
        content: [
          {
            type: "testimonials",
            items: [
              {
                quote:
                  "The digital marketing campaign they developed for us generated a 45% increase in qualified leads within the first three months. Their data-driven approach and constant optimization made all the difference.",
                author: "Sarah Johnson",
                title: "Marketing Director, Retail Chain Co.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
              },
              {
                quote:
                  "Working with this agency transformed our brand identity and online presence. Their strategic approach and creative solutions exceeded our expectations and delivered measurable results.",
                author: "John Smith",
                title: "CEO, TechStart Inc.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
              },
            ],
          },
        ],
      },
      {
        id: "8",
        title: "Next Steps",
        content: [
          {
            type: "steps",
            items: [
              {
                step: "Proposal Review",
                description:
                  "Review this proposal and reach out with any questions or clarifications.",
              },
              {
                step: "Contract Signing",
                description:
                  "Upon approval, we'll prepare a contract outlining all deliverables and terms.",
              },
              {
                step: "Kickoff Meeting",
                description:
                  "Schedule a kickoff meeting to align on goals, timelines, and communication protocols.",
              },
              {
                step: "Project Commencement",
                description:
                  "Begin the discovery phase and implement the agreed-upon strategy.",
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/proposals/new">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Editor</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Copy className="h-4 w-4" />
            <span>Copy Link</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {/* Proposal Header */}
        <div className="bg-blue-600 text-white p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {proposal.title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-blue-100 mb-6">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>Prepared for: {proposal.client}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(proposal.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Valid until:{" "}
                  {new Date(proposal.validUntil).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <p className="text-lg">{proposal.summary}</p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="border-b">
          <div className="max-w-4xl mx-auto py-6 px-8">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ol className="space-y-2">
              {proposal.sections.map((section, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium">
                    {index + 1}.
                  </span>
                  <a href={`#section-${section.id}`} className="hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Proposal Content */}
        <div className="max-w-4xl mx-auto py-8 px-8">
          {proposal.sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                {sectionIndex + 1}. {section.title}
              </h2>

              {section.content.map((content, contentIndex) => {
                switch (content.type) {
                  case "text":
                    return (
                      <p key={contentIndex} className="mb-6">
                        {content.value}
                      </p>
                    );

                  case "stats":
                    return (
                      <div
                        key={contentIndex}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                      >
                        {content.items.map((stat, statIndex) => (
                          <div
                            key={statIndex}
                            className="bg-gray-50 p-4 rounded-lg text-center"
                          >
                            <div className="text-3xl font-bold text-blue-600">
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    );

                  case "credentials":
                    return (
                      <div
                        key={contentIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                      >
                        {content.items.map((credential, credIndex) => (
                          <div
                            key={credIndex}
                            className="border rounded-lg p-4 flex items-center gap-4"
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={credential.image}
                                alt={credential.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {credential.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {credential.issuer}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );

                  case "caseStudies":
