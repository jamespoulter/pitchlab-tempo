import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Users, 
  FileText, 
  Sparkles, 
  Presentation 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch plans from the updated Edge function
  const { data: allPlans, error } = await supabase.functions.invoke(
    "get-plans",
    {
      body: {
        product_id: "prod_RuEdYVyOF1Vitg" // Pitchhub Premium product ID
      }
    }
  );
  
  // Debug the plans data
  console.log("All plans from Stripe:", allPlans);
  console.log("Error from get-plans function:", error);
  
  // Ensure allPlans is an array, even if it's null or undefined
  const safeAllPlans = Array.isArray(allPlans) ? allPlans : [];
  
  // Filter to only show the Pitchhub Premium product
  const plans = safeAllPlans.filter((plan: any) => 
    plan.product?.id === "prod_RuEdYVyOF1Vitg" || 
    plan.product?.name === "Pitchhub Premium"
  );
  
  console.log("Filtered plans:", plans);
  
  // Get the price amount from the plan or use default
  const priceAmount = plans?.[0]?.amount || 4500; // Default to £45 if not found
  
  // Extract features from the plan for the features section
  const premiumFeatures = plans?.[0]?.product?.metadata?.features 
    ? JSON.parse(plans[0].product.metadata.features) 
    : [
        { name: "Unlimited Pitches", included: true },
        { name: "AI-Powered Content", included: true },
        { name: "Custom Branding", included: true },
        { name: "Team Collaboration", included: true }
      ];

  return (
    <div className="min-h-screen to-gray-50 from-[#c93333]">
      <Navbar />
      <Hero />
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pitchhub Premium Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create winning pitches that stand out from the competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Presentation className="w-6 h-6" />,
                title: "Unlimited Pitches",
                description: "Create as many professional pitches as you need",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "AI-Powered Content",
                description: "Generate compelling content with our AI assistant",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Custom Branding",
                description: "Add your logo, colors, and brand identity",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Collaboration",
                description: "Work together seamlessly with your team",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  minimumFractionDigits: 0,
                }).format(priceAmount / 100)}
              </div>
              <div className="text-blue-100">Per Month</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">7 Days</div>
              <div className="text-blue-100">Free Trial</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start with a 7-day free trial. No credit card required.
            </p>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-md mx-auto">
            {plans && plans.length > 0 ? (
              plans.map((item: any) => (
                <PricingCard key={item.id} item={item} user={user} />
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Pitchhub Premium</h3>
                <p className="text-3xl font-bold mb-2">£45<span className="text-lg font-normal">/month</span></p>
                <p className="text-gray-600 mb-6">Full access to all Pitchhub Premium features</p>
                <Button 
                  onClick={() => window.location.href = user ? "/dashboard" : "/login?redirect=pricing"}
                  className="w-full py-6 text-lg font-medium"
                >
                  {user ? "Go to Dashboard" : "Sign Up"}
                </Button>
                <p className="text-xs text-center w-full mt-3 text-gray-500">
                  Includes 7-day free trial
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Winning Pitches?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals who are creating standout pitches with Pitchhub Premium.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Your 7-Day Free Trial
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
