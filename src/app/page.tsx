"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Users, 
  FileText, 
  Sparkles, 
  Presentation,
  FolderKanban,
  Award,
  MessageSquareQuote,
  Briefcase,
  Brain,
  Clock,
  ArrowRight
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useEffect, useState, useRef } from "react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    role: ""
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [animationsTriggered, setAnimationsTriggered] = useState(false);
  
  // Reference to check if component is mounted
  const isMounted = useRef(false);
  
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Trigger animations after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setAnimationsTriggered(true);
      }
    }, 100);
    
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (isMounted.current) {
        setUser(data.user);
      }
    };
    
    getUser();
    
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.name || !formState.email || !formState.company || !formState.role) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    
    setFormStatus("submitting");
    setErrorMessage("");
    
    try {
      const supabase = createClient();
      
      // Try to insert into waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([
          { 
            name: formState.name,
            email: formState.email,
            company: formState.company,
            role: formState.role
          }
        ]);
        
      if (error) {
        console.error("Database error:", error);
        
        // Fallback: Store in localStorage if database insert fails
        const waitlistEntries = JSON.parse(localStorage.getItem('waitlistEntries') || '[]');
        waitlistEntries.push({
          id: Date.now().toString(),
          name: formState.name,
          email: formState.email,
          company: formState.company,
          role: formState.role,
          created_at: new Date().toISOString(),
          contacted: false
        });
        localStorage.setItem('waitlistEntries', JSON.stringify(waitlistEntries));
        console.log("Stored waitlist entry in localStorage as fallback");
      }
      
      setFormStatus("success");
      // Reset form
      setFormState({
        name: "",
        email: "",
        company: "",
        role: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Fallback: Store in localStorage if database connection fails
      try {
        const waitlistEntries = JSON.parse(localStorage.getItem('waitlistEntries') || '[]');
        waitlistEntries.push({
          id: Date.now().toString(),
          name: formState.name,
          email: formState.email,
          company: formState.company,
          role: formState.role,
          created_at: new Date().toISOString(),
          contacted: false
        });
        localStorage.setItem('waitlistEntries', JSON.stringify(waitlistEntries));
        console.log("Stored waitlist entry in localStorage as fallback");
        
        setFormStatus("success");
        // Reset form
        setFormState({
          name: "",
          email: "",
          company: "",
          role: ""
        });
      } catch (localStorageError) {
        console.error("LocalStorage fallback failed:", localStorageError);
        setFormStatus("error");
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="bg-blue-600 text-white p-1.5 rounded">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-heading font-bold">PitchHub</span>
          </motion.div>
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </motion.nav>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="#waitlist">Join Waitlist</Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate={animationsTriggered ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1">
                Coming Soon
              </Badge>
            </motion.div>
            <motion.h1 
              initial="hidden"
              animate={animationsTriggered ? "visible" : "hidden"}
              variants={slideUp}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6"
            >
              The Complete Solution for <span className="text-blue-600">Agency New Business</span>
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate={animationsTriggered ? "visible" : "hidden"}
              variants={slideUp}
              className="text-xl text-gray-600 mb-8 md:px-10"
            >
              Centralize your agency's knowledge, streamline proposal creation, and win more business with PitchHub's all-in-one platform.
            </motion.p>
            <motion.div 
              initial="hidden"
              animate={animationsTriggered ? "visible" : "hidden"}
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild>
                <Link href="#waitlist" className="px-8">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features" className="px-8">
                  Explore Features
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">Agencies Struggle with Knowledge Management</h2>
            <p className="text-lg text-gray-600">
              Whether you're responding to an RFP, preparing a pitch, or showcasing case studies, keeping your agency's content organized is a constant challenge.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FolderKanban className="h-8 w-8 text-red-500" />,
                title: "Scattered Case Studies",
                description: "Case studies spread across drives, emails, and presentations, making it difficult to find the right examples when needed."
              },
              {
                icon: <Users className="h-8 w-8 text-orange-500" />,
                title: "Outdated Team Information",
                description: "Team bios and credentials that are inconsistent or outdated, creating confusion during client presentations."
              },
              {
                icon: <Briefcase className="h-8 w-8 text-yellow-500" />,
                title: "Inconsistent Service Descriptions",
                description: "Different team members describing your services in different ways, diluting your agency's unique value proposition."
              },
              {
                icon: <MessageSquareQuote className="h-8 w-8 text-green-500" />,
                title: "Lost Testimonials",
                description: "Client testimonials and success metrics buried in emails or forgotten entirely, missing opportunities to showcase your impact."
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-500" />,
                title: "Time-Consuming Proposals",
                description: "Spending days or weeks assembling proposals from scratch for each new opportunity, duplicating effort and wasting time."
              },
              {
                icon: <Award className="h-8 w-8 text-purple-500" />,
                title: "Missed Opportunities",
                description: "Losing potential clients because you can't respond quickly enough with tailored, professional proposals."
              },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemFadeIn}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1">
              Features
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-gray-600">
              PitchHub centralizes all your agency's critical information and streamlines your new business process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-heading font-bold mb-4">Centralized Knowledge Hub</h3>
              <p className="text-gray-600 mb-6">
                Store, organize, and easily access all your agency's essential information in one secure location.
              </p>
              <motion.ul 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-3"
              >
                {[
                  "Case studies with results and metrics",
                  "Team member profiles and expertise",
                  "Service descriptions and methodologies",
                  "Client testimonials and success stories",
                  "Pricing structures and rate cards",
                  "Agency credentials and awards"
                ].map((feature, index) => (
                  <motion.li 
                    key={index} 
                    variants={itemFadeIn}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <FolderKanban className="h-16 w-16 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full"></div>
                <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Brain className="h-16 w-16 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full"></div>
                <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h3 className="text-2xl font-heading font-bold mb-4">AI-Powered Proposal Builder</h3>
              <p className="text-gray-600 mb-6">
                Create professional, tailored proposals in minutes instead of days using our intelligent AI assistant.
              </p>
              <motion.ul 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-3"
              >
                {[
                  "Generate complete proposals with a few clicks",
                  "Automatically include relevant case studies",
                  "Customize content for specific client needs",
                  "Maintain consistent branding and messaging",
                  "Export to multiple formats (PDF, PPT, Doc)",
                  "Track proposal views and engagement"
                ].map((feature, index) => (
                  <motion.li 
                    key={index} 
                    variants={itemFadeIn}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="h-10 w-10 text-yellow-500" />,
                title: "Rapid Response",
                description: "Respond to RFPs and opportunities in hours instead of days, giving you a competitive edge."
              },
              {
                icon: <Sparkles className="h-10 w-10 text-purple-500" />,
                title: "Consistent Quality",
                description: "Ensure every proposal maintains your agency's high standards and brand consistency."
              },
              {
                icon: <Shield className="h-10 w-10 text-blue-500" />,
                title: "Secure Collaboration",
                description: "Collaborate securely with team members on proposals with role-based permissions."
              },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemFadeIn}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1">
              Process
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-4">How PitchHub Works</h2>
            <p className="text-lg text-gray-600">
              A simple, intuitive process to transform how your agency manages new business development.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                number: "01",
                title: "Centralize Your Content",
                description: "Upload and organize all your agency's case studies, team information, services, and testimonials in one secure platform.",
                icon: <FolderKanban className="h-8 w-8 text-blue-500" />
              },
              {
                number: "02",
                title: "Create Proposals Instantly",
                description: "Use our AI-powered proposal builder to quickly assemble tailored proposals that showcase your agency's strengths.",
                icon: <Brain className="h-8 w-8 text-blue-500" />
              },
              {
                number: "03",
                title: "Win More Business",
                description: "Respond faster to opportunities, present your work professionally, and track engagement to close more deals.",
                icon: <Award className="h-8 w-8 text-blue-500" />
              }
            ].map((step, index) => (
              <motion.div key={index} className="relative" variants={itemFadeIn}>
                <div className="bg-blue-50 p-8 rounded-xl h-full">
                  <div className="text-5xl font-heading font-bold text-blue-200 mb-4">{step.number}</div>
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-blue-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1">
              Pricing
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">
              Join our waitlist today to secure early bird pricing when we launch.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-500">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
                <Badge className="bg-white text-blue-700 hover:bg-white mb-2">
                  Early Bird Offer
                </Badge>
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-medium mb-2">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-heading font-bold">PitchHub Plus</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-heading font-bold">£45</span>
                    <span className="text-gray-500 ml-2">/month per user</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <motion.ul 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4 mb-8"
                >
                  {[
                    "Unlimited case studies & content storage",
                    "AI-powered proposal builder",
                    "Team collaboration tools",
                    "Custom branding & templates",
                    "Proposal tracking & analytics",
                    "Priority support",
                    "7-day free trial"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index} 
                      variants={itemFadeIn}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="text-center">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="#waitlist">
                      Join the Waitlist
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Limited-time offer for waitlist members only
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">Join the PitchHub Waitlist</h2>
            <p className="text-xl opacity-90">
              Be the first to know when we launch and secure early bird pricing.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="mt-1" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="john@youragency.com" 
                    className="mt-1" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-gray-700">Agency Name</Label>
                  <Input 
                    id="company" 
                    value={formState.company}
                    onChange={handleInputChange}
                    placeholder="Your Agency" 
                    className="mt-1" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-gray-700">Your Role</Label>
                  <Input 
                    id="role" 
                    value={formState.role}
                    onChange={handleInputChange}
                    placeholder="e.g. New Business Director" 
                    className="mt-1" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                
                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
                
                {formStatus === "success" ? (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span>Thanks for joining! We'll be in touch soon.</span>
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? "Submitting..." : "Join Waitlist"}
                  </Button>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  We'll only use your email to send you PitchHub updates. No spam, ever.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1 rounded">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xl font-heading font-bold text-white">PitchHub</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                The complete solution for agency new business
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-heading font-semibold mb-3 text-white">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
                  <li><Link href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-3 text-white">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-3 text-white">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} PitchHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
