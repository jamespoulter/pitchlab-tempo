import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Star,
  Calendar,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TestimonialsPage() {
  // This would normally fetch real data from the database
  const testimonials = [
    {
      id: 1,
      clientName: "John Smith",
      clientTitle: "CEO",
      companyName: "TechStart Inc.",
      quote:
        "Working with this agency transformed our brand identity and online presence. Their strategic approach and creative solutions exceeded our expectations and delivered measurable results.",
      rating: 5,
      date: "2023-09-15",
      projectType: "Brand Strategy & Website Redesign",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      featured: true,
    },
    {
      id: 2,
      clientName: "Sarah Johnson",
      clientTitle: "Marketing Director",
      companyName: "Retail Chain Co.",
      quote:
        "The digital marketing campaign they developed for us generated a 45% increase in qualified leads within the first three months. Their data-driven approach and constant optimization made all the difference.",
      rating: 5,
      date: "2023-08-22",
      projectType: "Digital Marketing Campaign",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      featured: true,
    },
    {
      id: 3,
      clientName: "Michael Chen",
      clientTitle: "Founder",
      companyName: "Startup Ventures",
      quote:
        "As a startup, we needed a partner who could help us establish our brand quickly and effectively. This agency delivered a comprehensive brand identity that perfectly captured our vision and values.",
      rating: 4,
      date: "2023-07-10",
      projectType: "Brand Development",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      featured: false,
    },
    {
      id: 4,
      clientName: "Emily Rodriguez",
      clientTitle: "E-commerce Manager",
      companyName: "Fashion Brand",
      quote:
        "The website redesign and optimization work resulted in a 30% increase in conversion rate and significantly improved user engagement metrics. Their team was responsive, creative, and technically excellent.",
      rating: 5,
      date: "2023-06-05",
      projectType: "E-commerce Optimization",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      featured: false,
    },
    {
      id: 5,
      clientName: "David Wilson",
      clientTitle: "Communications Director",
      companyName: "Nonprofit Organization",
      quote:
        "Their content strategy and social media management helped us reach a wider audience and increase donations by 25%. They truly understood our mission and translated it into compelling messaging.",
      rating: 5,
      date: "2023-05-18",
      projectType: "Content & Social Media",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      featured: false,
    },
    {
      id: 6,
      clientName: "Jessica Lee",
      clientTitle: "Product Manager",
      companyName: "SaaS Company",
      quote:
        "The UX/UI redesign of our application significantly improved user satisfaction and reduced customer support inquiries. Their team took the time to understand our users' needs and delivered an intuitive interface.",
      rating: 4,
      date: "2023-04-12",
      projectType: "UX/UI Design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      featured: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage client testimonials and success stories.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search testimonials..."
                  className="pl-8 h-9 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`border rounded-lg overflow-hidden group hover:shadow-md transition-all ${testimonial.featured ? "border-blue-500 shadow-sm" : ""}`}
              >
                {testimonial.featured && (
                  <div className="bg-blue-500 text-white text-center py-1 text-xs font-medium">
                    FEATURED TESTIMONIAL
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.clientName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {testimonial.clientName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.clientTitle}, {testimonial.companyName}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" />
                      <span>{testimonial.projectType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(testimonial.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t p-3 flex justify-between items-center bg-gray-50">
                  <Button variant="outline" size="sm">
                    <MessageSquareQuote className="h-3.5 w-3.5 mr-1" />
                    Add to Proposal
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        {testimonial.featured ? "Unfeature" : "Feature"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            <div className="border rounded-lg overflow-hidden border-dashed flex items-center justify-center p-8 h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <MessageSquareQuote className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Add New Testimonial</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Showcase client feedback and success stories
                </p>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Testimonial
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Display Settings</CardTitle>
          <CardDescription>
            Configure how testimonials appear in proposals and on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Proposal Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="include-avatar"
                      className="text-sm font-medium"
                    >
                      Include Client Avatar
                    </label>
                    <input
                      type="checkbox"
                      id="include-avatar"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="include-rating"
                      className="text-sm font-medium"
                    >
                      Show Star Rating
                    </label>
                    <input
                      type="checkbox"
                      id="include-rating"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="include-date"
                      className="text-sm font-medium"
                    >
                      Show Testimonial Date
                    </label>
                    <input
                      type="checkbox"
                      id="include-date"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="max-testimonials"
                    className="text-sm font-medium"
                  >
                    Maximum Testimonials to Include
                  </label>
                  <select
                    id="max-testimonials"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="3">3 Testimonials</option>
                    <option value="5">5 Testimonials</option>
                    <option value="all">All Featured Testimonials</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Website Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="auto-rotate"
                      className="text-sm font-medium"
                    >
                      Auto-rotate Testimonials
                    </label>
                    <input
                      type="checkbox"
                      id="auto-rotate"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="show-featured-only"
                      className="text-sm font-medium"
                    >
                      Show Featured Testimonials Only
                    </label>
                    <input
                      type="checkbox"
                      id="show-featured-only"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="enable-filtering"
                      className="text-sm font-medium"
                    >
                      Enable Category Filtering
                    </label>
                    <input
                      type="checkbox"
                      id="enable-filtering"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="display-style"
                    className="text-sm font-medium"
                  >
                    Display Style
                  </label>
                  <select
                    id="display-style"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="grid">Grid Layout</option>
                    <option value="carousel">Carousel</option>
                    <option value="list">List View</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="mr-2">Save Settings</Button>
              <Button variant="outline">Reset to Defaults</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
