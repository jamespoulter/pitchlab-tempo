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
  const [activeRole, setActiveRole] = useState<"founder" | "newBusiness" | "marketing">("founder");
  
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
      <header className="border-b border-gray-100 bg-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="bg-primary text-white p-1.5 rounded">
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
            <Link href="#features" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
              Pricing
            </Link>
          </motion.nav>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            {user ? (
              <Button asChild className="rounded-full font-medium">
                <Link href="/dashboard">
                  Dashboard
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-700 hover:text-primary hover:bg-gray-50 font-medium">
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button asChild className="rounded-full font-medium">
                  <Link href="#waitlist">
                    Join Waitlist
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={animationsTriggered ? "visible" : "hidden"}
              variants={fadeIn}
              className="max-w-xl"
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
                Coming Soon
              </Badge>
              <motion.h1 
                initial="hidden"
                animate={animationsTriggered ? "visible" : "hidden"}
                variants={slideUp}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6"
              >
                <span className="text-gray-900">The Complete Solution for </span>
                <span className="text-primary">Agency New Business</span>
              </motion.h1>
              <motion.p 
                initial="hidden"
                animate={animationsTriggered ? "visible" : "hidden"}
                variants={slideUp}
                className="text-xl text-gray-600 mb-8"
              >
                Stop losing valuable agency knowledge buried in SharePoint, desktops, and PowerPoint presentations. Centralize your case studies, credentials, and brand assets to win more business.
              </motion.p>
              <motion.div 
                initial="hidden"
                animate={animationsTriggered ? "visible" : "hidden"}
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="rounded-full px-8 font-medium" asChild>
                  <Link href="#waitlist">
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 font-medium" asChild>
                  <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={animationsTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-primary/10 p-3 flex items-center gap-2 border-b border-gray-100">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium">Case Studies</div>
                    <div className="bg-primary/10 text-primary p-2 rounded">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium">Credentials</div>
                    <div className="bg-primary/10 text-primary p-2 rounded">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium">Agency Brand</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Case Studies</div>
                      <div className="text-2xl font-bold">24</div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Proposals</div>
                      <div className="text-2xl font-bold">8</div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium">Recent Activity</div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Today</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 py-1 border-b border-gray-50">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                          <FolderKanban className="h-3 w-3" />
                        </div>
                        <div className="text-sm">New case study added</div>
                      </div>
                      <div className="flex items-center gap-2 py-1 border-b border-gray-50">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs text-accent">
                          <Users className="h-3 w-3" />
                        </div>
                        <div className="text-sm">Team credentials updated</div>
                      </div>
                      <div className="flex items-center gap-2 py-1 border-b border-gray-50">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-700">
                          <Briefcase className="h-3 w-3" />
                        </div>
                        <div className="text-sm">Brand assets refreshed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
              Challenges
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-4">The Hidden Cost of Scattered Agency Knowledge</h2>
            <p className="text-lg text-gray-600">
              In today's fast-paced agency world, valuable information is often buried in SharePoint, desktop folders, and PowerPoint presentations. When team members leave, critical knowledge walks out the door with them.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <FolderKanban className="h-8 w-8 text-red-500" />,
                title: "Information Scattered Across Systems",
                description: "Critical case studies and client work buried in SharePoint, personal drives, email chains, and forgotten PowerPoint presentations."
              },
              {
                icon: <Users className="h-8 w-8 text-orange-500" />,
                title: "Knowledge Loss Through Team Churn",
                description: "When team members leave, their institutional knowledge and project insights walk out the door, leaving gaps in your agency's expertise."
              },
              {
                icon: <Briefcase className="h-8 w-8 text-yellow-500" />,
                title: "Inconsistent Service Descriptions",
                description: "Different team members describing your services in different ways, diluting your agency's unique value proposition."
              },
              {
                icon: <MessageSquareQuote className="h-8 w-8 text-green-500" />,
                title: "Lost Testimonials & Results",
                description: "Client testimonials and success metrics buried in emails or forgotten entirely, missing opportunities to showcase your impact."
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-500" />,
                title: "Time-Consuming Proposal Creation",
                description: "Spending days or weeks assembling proposals from scratch for each new opportunity, duplicating effort and wasting time."
              },
              {
                icon: <Award className="h-8 w-8 text-purple-500" />,
                title: "Competitive Disadvantage",
                description: "Agencies that better organize their knowledge win more business and retain clients longer. Don't get left behind."
              },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemFadeIn}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center">{item.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
              Features
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-gray-600">
              PitchHub centralizes all your agency's critical information and streamlines your new business process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block bg-primary/10 text-primary p-2 rounded-lg mb-4">
                <FolderKanban className="h-6 w-6" />
              </div>
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
              className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Case Studies</div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                        {i}
                      </div>
                      <div>
                        <div className="text-sm font-medium">Case Study {i}</div>
                        <div className="text-xs text-gray-500">Updated 2d ago</div>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Team Members</div>
                </div>
                <div className="flex -space-x-2 mb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      {i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center text-xs">
                    +2
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">AI Proposal Builder</div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-4/6"></div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="rounded-full text-xs">Generate</Button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Recent Proposals</div>
                </div>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                        {i}
                      </div>
                      <div>
                        <div className="text-sm font-medium">Proposal {i}</div>
                        <div className="text-xs text-gray-500">Created 1d ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="inline-block bg-primary/10 text-primary p-2 rounded-lg mb-4">
                <Brain className="h-6 w-6" />
              </div>
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
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Zap className="h-6 w-6 text-yellow-500" />,
                title: "Rapid Response",
                description: "Respond to RFPs and opportunities in hours instead of days, giving you a competitive edge."
              },
              {
                icon: <Sparkles className="h-6 w-6 text-purple-500" />,
                title: "Consistent Quality",
                description: "Ensure every proposal maintains your agency's high standards and brand consistency."
              },
              {
                icon: <Shield className="h-6 w-6 text-blue-500" />,
                title: "Secure Collaboration",
                description: "Collaborate securely with team members on proposals with role-based permissions."
              },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemFadeIn}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-gray-100">{item.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Competitive Advantage Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
                Competitive Edge
              </Badge>
              <h2 className="text-3xl font-heading font-bold mb-6">Knowledge Retention Drives Business Growth</h2>
              <p className="text-lg text-gray-600 mb-6">
                Agencies that effectively organize and preserve their institutional knowledge consistently outperform their competitors in winning new business and retaining valuable clients.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Faster Response Times</h3>
                    <p className="text-gray-600">
                      When information is centralized and accessible, your team can respond to RFPs and client requests in hours instead of days.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Seamless Team Transitions</h3>
                    <p className="text-gray-600">
                      When team members leave, their knowledge stays with your agency, ensuring continuity and preserving valuable client relationships.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Higher Win Rates</h3>
                    <p className="text-gray-600">
                      Agencies with organized knowledge management systems win 35% more new business opportunities than those with fragmented information.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Knowledge Retention Impact</div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium">Proposal Win Rate</div>
                      <div className="text-sm font-medium text-green-600">+35%</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[65%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium">Time Saved on Proposals</div>
                      <div className="text-sm font-medium text-green-600">+68%</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[68%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium">Client Retention</div>
                      <div className="text-sm font-medium text-green-600">+42%</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[42%]"></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Based on a survey of 200+ agencies that implemented centralized knowledge management systems
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 w-full h-full bg-primary/5 rounded-xl -z-10"></div>
              <div className="absolute top-3 right-3 w-full h-full bg-primary/5 rounded-xl -z-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/2">
                <h2 className="text-4xl font-heading font-bold mb-12">
                  <span className="text-gray-900">Key </span>
                  <span className="text-primary">Benefits</span>
                  <span className="text-gray-900"> for...</span>
                </h2>

                <div className="space-y-4">
                  {/* Role tabs */}
                  <div 
                    className={`p-6 rounded-lg cursor-pointer transition-colors ${activeRole === "founder" ? "border-l-4 border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveRole("founder")}
                    onKeyDown={(e) => e.key === "Enter" && setActiveRole("founder")}
                    aria-label="View benefits for Agency Founder"
                    aria-selected={activeRole === "founder"}
                  >
                    <h3 className="text-xl font-heading font-semibold">Agency Founder</h3>
                  </div>
                  
                  <div 
                    className={`p-6 rounded-lg cursor-pointer transition-colors ${activeRole === "newBusiness" ? "border-l-4 border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveRole("newBusiness")}
                    onKeyDown={(e) => e.key === "Enter" && setActiveRole("newBusiness")}
                    aria-label="View benefits for Head of New Business"
                    aria-selected={activeRole === "newBusiness"}
                  >
                    <h3 className="text-xl font-heading font-semibold">Head of New Business</h3>
                  </div>
                  
                  <div 
                    className={`p-6 rounded-lg cursor-pointer transition-colors ${activeRole === "marketing" ? "border-l-4 border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveRole("marketing")}
                    onKeyDown={(e) => e.key === "Enter" && setActiveRole("marketing")}
                    aria-label="View benefits for Marketing Manager"
                    aria-selected={activeRole === "marketing"}
                  >
                    <h3 className="text-xl font-heading font-semibold">Marketing Manager</h3>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                {activeRole === "founder" && (
                  <div className="space-y-6">
                    {/* Agency Founder benefits */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increased business growth</h4>
                        <p className="text-gray-600">Win more pitches and grow your client base with professional, consistent proposals</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Preserved institutional knowledge</h4>
                        <p className="text-gray-600">Retain valuable agency expertise even when team members leave</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Improved operational efficiency</h4>
                        <p className="text-gray-600">Reduce time spent searching for information across systems and creating proposals</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Enhanced team collaboration</h4>
                        <p className="text-gray-600">Enable seamless cooperation between departments with centralized information</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Competitive advantage</h4>
                        <p className="text-gray-600">Stand out from other agencies with faster response times and higher quality proposals</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-700 italic">
                        "PitchHub helps me preserve our agency's valuable knowledge, win more business, and ensure consistency even as our team evolves. The time saved on proposals alone has transformed how we approach new business opportunities."
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="font-medium">Sarah Johnson</div>
                          <div className="text-sm text-gray-500">Founder & CEO, Bright Ideas Agency</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeRole === "newBusiness" && (
                  <div className="space-y-6">
                    {/* Head of New Business benefits */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Faster proposal creation</h4>
                        <p className="text-gray-600">Create tailored, professional proposals in minutes instead of days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Instant access to case studies</h4>
                        <p className="text-gray-600">Quickly find and include the most relevant case studies for each opportunity</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Higher win rates</h4>
                        <p className="text-gray-600">Respond to more opportunities with higher quality proposals that showcase your best work</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Proposal analytics</h4>
                        <p className="text-gray-600">Track engagement and identify what works best to continuously improve win rates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Consistent messaging</h4>
                        <p className="text-gray-600">Ensure all proposals maintain consistent branding and messaging about your agency</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-700 italic">
                        "Before PitchHub, I spent days hunting for case studies and rebuilding proposals from scratch. Now I can create tailored, professional proposals in hours, allowing us to respond to more opportunities and win more business."
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="font-medium">Michael Chen</div>
                          <div className="text-sm text-gray-500">Head of New Business, Spark Creative</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeRole === "marketing" && (
                  <div className="space-y-6">
                    {/* Marketing Manager benefits */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Centralized brand assets</h4>
                        <p className="text-gray-600">Store and organize all brand materials in one accessible location</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Consistent case study formatting</h4>
                        <p className="text-gray-600">Maintain uniform presentation of case studies across all client communications</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Streamlined content updates</h4>
                        <p className="text-gray-600">Update case studies and credentials once, and they're instantly available everywhere</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Simplified collaboration</h4>
                        <p className="text-gray-600">Work seamlessly with the new business team to create compelling proposals</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Reduced duplicate work</h4>
                        <p className="text-gray-600">Eliminate recreating materials that already exist but are hard to find</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-700 italic">
                        "PitchHub has eliminated the constant requests to find and format case studies for pitches. Our team now spends more time on strategic work instead of hunting through old files and presentations."
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="font-medium">Emma Rodriguez</div>
                          <div className="text-sm text-gray-500">Marketing Manager, Elevate Digital</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
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
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                number: "01",
                title: "Rescue Scattered Knowledge",
                description: "Gather and organize all your agency's case studies, team information, and assets from SharePoint, desktops, and forgotten presentations.",
                icon: <FolderKanban className="h-6 w-6 text-primary" />
              },
              {
                number: "02",
                title: "Preserve Institutional Memory",
                description: "Create a central knowledge hub that retains critical information even when team members leave, ensuring continuity and consistency.",
                icon: <Brain className="h-6 w-6 text-primary" />
              },
              {
                number: "03",
                title: "Win More Business",
                description: "Respond faster to opportunities with tailored proposals that showcase your best work, increasing win rates and client retention.",
                icon: <Award className="h-6 w-6 text-primary" />
              }
            ].map((step, index) => (
              <motion.div key={index} className="relative" variants={itemFadeIn}>
                <div className="bg-white p-8 rounded-xl h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-heading font-bold text-gray-200 mb-4">{step.number}</div>
                  <h3 className="text-xl font-heading font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-primary p-6 text-white text-center">
                <Badge className="bg-white text-primary hover:bg-white mb-2 font-medium">
                  Early Bird Offer
                </Badge>
                <div className="flex flex-col items-center mb-4">
                  <div className="bg-white/20 text-white rounded-full px-4 py-1 text-sm font-medium mb-2">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-heading font-bold">PitchHub Plus</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-heading font-bold">£45</span>
                    <span className="text-white/80 ml-2">/month per user</span>
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
                  <Button size="lg" className="w-full rounded-full font-medium" asChild>
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
      <section id="waitlist" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1 font-medium">
              Waitlist
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-4">Join the PitchHub Waitlist</h2>
            <p className="text-lg text-gray-600">
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
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="mt-1 rounded-lg" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="john@youragency.com" 
                    className="mt-1 rounded-lg" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-gray-700 font-medium">Agency Name</Label>
                  <Input 
                    id="company" 
                    value={formState.company}
                    onChange={handleInputChange}
                    placeholder="Your Agency" 
                    className="mt-1 rounded-lg" 
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-gray-700 font-medium">Your Role</Label>
                  <Input 
                    id="role" 
                    value={formState.role}
                    onChange={handleInputChange}
                    placeholder="e.g. New Business Director" 
                    className="mt-1 rounded-lg" 
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
                    className="w-full rounded-full font-medium"
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
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-white p-1 rounded">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xl font-heading font-bold text-white">PitchHub</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                The complete solution for agency new business
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-heading font-semibold mb-3 text-white text-sm">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                  <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-3 text-white text-sm">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-3 text-white text-sm">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} PitchHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
