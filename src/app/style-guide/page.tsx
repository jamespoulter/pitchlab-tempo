import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function StyleGuidePage() {
  return (
    <div className="container py-10 space-y-12">
      <div className="space-y-4">
        <h1>PitchCraft Style Guide - New York Knicks Inspired</h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive guide to PitchCraft's typography, colors, and UI components using a New York Knicks-inspired color scheme.
        </p>
      </div>

      {/* Typography Section */}
      <section className="space-y-6">
        <h2>Typography</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Headings</CardTitle>
            <CardDescription>
              Using Montserrat font with letter-spacing of -0.01em
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1>Heading 1 (2.488rem)</h1>
              <p className="text-sm text-muted-foreground">Used for main page titles</p>
            </div>
            <div>
              <h2>Heading 2 (2.074rem)</h2>
              <p className="text-sm text-muted-foreground">Used for section titles</p>
            </div>
            <div>
              <h3>Heading 3 (1.728rem)</h3>
              <p className="text-sm text-muted-foreground">Used for subsection titles</p>
            </div>
            <div>
              <h4>Heading 4 (1.44rem)</h4>
              <p className="text-sm text-muted-foreground">Used for card titles</p>
            </div>
            <div>
              <h5>Heading 5 (1.2rem)</h5>
              <p className="text-sm text-muted-foreground">Used for smaller section titles</p>
            </div>
            <div>
              <h6>Heading 6 (1rem)</h6>
              <p className="text-sm text-muted-foreground">Used for the smallest section titles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Body Text</CardTitle>
            <CardDescription>
              Using Inter font with normal letter-spacing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-base">
                Base text (14px) - This is the standard body text used throughout the application. It has a line height of 1.5 for optimal readability across devices.
              </p>
            </div>
            <div>
              <p className="text-sm">
                Small text (12px) - Used for less important information, captions, and helper text.
              </p>
            </div>
            <div>
              <p className="text-lg">
                Large text (16px) - Used for important paragraphs or introductory text.
              </p>
            </div>
            <div>
              <p className="text-xl">
                Extra large text (19px) - Used for featured quotes or highlighted information.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Colors Section */}
      <section className="space-y-6">
        <h2>Colors</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
            <CardDescription>
              New York Knicks-inspired color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-knicks-blue rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Knicks Blue (#006BB6)</span>
                </div>
                <p className="text-sm text-muted-foreground">Primary brand color for navigation and key UI elements</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-knicks-orange rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Knicks Orange (#F58426)</span>
                </div>
                <p className="text-sm text-muted-foreground">Accent color for calls-to-action and highlights</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-silver rounded-md flex items-end p-2">
                  <span className="text-charcoal font-medium">Silver (#BEC0C2)</span>
                </div>
                <p className="text-sm text-muted-foreground">Secondary UI elements, borders, and subtle accents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Variants</CardTitle>
            <CardDescription>
              Light and dark variants of primary colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Knicks Blue Variants</h4>
                <div className="space-y-2">
                  <div className="h-12 bg-knicks-blue-dark rounded-md flex items-center px-3">
                    <span className="text-white font-medium">Dark (#005A9C)</span>
                  </div>
                  <div className="h-12 bg-knicks-blue rounded-md flex items-center px-3">
                    <span className="text-white font-medium">Default (#006BB6)</span>
                  </div>
                  <div className="h-12 bg-knicks-blue-light rounded-md flex items-center px-3">
                    <span className="text-white font-medium">Light (#1A7DC9)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Knicks Orange Variants</h4>
                <div className="space-y-2">
                  <div className="h-12 bg-knicks-orange-dark rounded-md flex items-center px-3">
                    <span className="text-white font-medium">Dark (#E06C0F)</span>
                  </div>
                  <div className="h-12 bg-knicks-orange rounded-md flex items-center px-3">
                    <span className="text-white font-medium">Default (#F58426)</span>
                  </div>
                  <div className="h-12 bg-knicks-orange-light rounded-md flex items-center px-3">
                    <span className="text-white font-medium">Light (#FF9B4D)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Silver Variants</h4>
                <div className="space-y-2">
                  <div className="h-12 bg-silver-dark rounded-md flex items-center px-3">
                    <span className="text-charcoal font-medium">Dark (#A3A5A7)</span>
                  </div>
                  <div className="h-12 bg-silver rounded-md flex items-center px-3">
                    <span className="text-charcoal font-medium">Default (#BEC0C2)</span>
                  </div>
                  <div className="h-12 bg-silver-light rounded-md flex items-center px-3">
                    <span className="text-charcoal font-medium">Light (#D9DADC)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Black & White System</CardTitle>
            <CardDescription>
              Foundation for the interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-white border rounded-md flex items-end p-2">
                  <span className="font-medium">Pure White (#FFFFFF)</span>
                </div>
                <p className="text-sm text-muted-foreground">Primary backgrounds and card surfaces</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-off-white rounded-md flex items-end p-2">
                  <span className="font-medium">Off-White (#F8F9FA)</span>
                </div>
                <p className="text-sm text-muted-foreground">Secondary backgrounds</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-charcoal rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Charcoal (#2C2D2F)</span>
                </div>
                <p className="text-sm text-muted-foreground">Primary text and important UI elements</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-black rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Rich Black (#000000)</span>
                </div>
                <p className="text-sm text-muted-foreground">Logos and key brand elements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extended Palette</CardTitle>
            <CardDescription>
              Additional colors for specific UI areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-midnight-blue rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Midnight Blue (#00487C)</span>
                </div>
                <p className="text-sm text-muted-foreground">Header backgrounds and dark elements</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-navy rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Navy (#003366)</span>
                </div>
                <p className="text-sm text-muted-foreground">Footer backgrounds and dark mode elements</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-light-gray rounded-md flex items-end p-2">
                  <span className="font-medium">Light Gray (#E5E7EB)</span>
                </div>
                <p className="text-sm text-muted-foreground">Table alternating rows and form backgrounds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Semantic Colors</CardTitle>
            <CardDescription>
              Used to convey meaning and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-success rounded-md flex items-end p-2">
                  <span className="text-success-foreground font-medium">Success (#22C55E)</span>
                </div>
                <p className="text-sm text-muted-foreground">Used for success states and positive actions</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-warning rounded-md flex items-end p-2">
                  <span className="text-warning-foreground font-medium">Warning (#FACC15)</span>
                </div>
                <p className="text-sm text-muted-foreground">Used for warning states and cautionary actions</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-error rounded-md flex items-end p-2">
                  <span className="text-error-foreground font-medium">Error (#EF4444)</span>
                </div>
                <p className="text-sm text-muted-foreground">Used for error states and destructive actions</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-info rounded-md flex items-end p-2">
                  <span className="text-info-foreground font-medium">Info (#3B82F6)</span>
                </div>
                <p className="text-sm text-muted-foreground">Used for informational states and messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* UI Components Section */}
      <section className="space-y-6">
        <h2>UI Components</h2>
        
        <Tabs defaultValue="buttons">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buttons" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Hierarchy</CardTitle>
                <CardDescription>
                  Different button styles for different actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Accent Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">All buttons have a 200-300ms transition on hover/focus states</p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
                <CardDescription>
                  Different button sizes for different contexts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small Button</Button>
                  <Button>Default Button</Button>
                  <Button size="lg">Large Button</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inputs" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>
                  Input fields, checkboxes, and other form elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Enter your email" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" placeholder="Enter your password" />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Form elements have consistent 8px spacing and subtle rounded corners</p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>
                    Card description with additional details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is a standard card with header, content, and footer sections.</p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-knicks-blue/20">
                <CardHeader className="bg-knicks-blue/5 rounded-t-lg">
                  <CardTitle>Knicks Blue Card</CardTitle>
                  <CardDescription>
                    A card with Knicks Blue accents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card has subtle Knicks Blue accents to make it stand out.</p>
                </CardContent>
                <CardFooter className="bg-knicks-blue/5 rounded-b-lg">
                  <Button>Primary Action</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-knicks-orange/20">
                <CardHeader className="bg-knicks-orange/5 rounded-t-lg">
                  <CardTitle>Knicks Orange Card</CardTitle>
                  <CardDescription>
                    A card with Knicks Orange accents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card has subtle Knicks Orange accents for highlighting important content.</p>
                </CardContent>
                <CardFooter className="bg-knicks-orange/5 rounded-b-lg">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Accent Action</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-silver/50">
                <CardHeader className="bg-silver/20 rounded-t-lg">
                  <CardTitle>Silver Card</CardTitle>
                  <CardDescription>
                    A card with Silver accents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card has subtle Silver accents for secondary content.</p>
                </CardContent>
                <CardFooter className="bg-silver/20 rounded-b-lg">
                  <Button variant="secondary">Secondary Action</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="badges" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>
                  Used to indicate status and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  
                  <Badge className="bg-knicks-blue/10 text-knicks-blue hover:bg-knicks-blue/20">Knicks Blue</Badge>
                  <Badge className="bg-knicks-orange/10 text-knicks-orange hover:bg-knicks-orange/20">Knicks Orange</Badge>
                  <Badge className="bg-success/10 text-success hover:bg-success/20">Success</Badge>
                  <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Warning</Badge>
                  <Badge className="bg-error/10 text-error hover:bg-error/20">Error</Badge>
                  <Badge className="bg-info/10 text-info hover:bg-info/20">Info</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Header Example</CardTitle>
                <CardDescription>
                  Using the Knicks Blue gradient for headers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-header text-white p-4">
                    <div className="container mx-auto">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xl">PitchCraft</div>
                        <div className="flex space-x-4">
                          <span className="nav-item">Dashboard</span>
                          <span className="nav-item-active">Proposals</span>
                          <span className="nav-item">Templates</span>
                          <span className="nav-item">Settings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Footer Example</CardTitle>
                <CardDescription>
                  Using Navy for footer backgrounds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden">
                  <div className="footer">
                    <div className="container mx-auto">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <h4 className="font-bold text-lg mb-2">PitchCraft</h4>
                          <p className="text-sm text-white/80">Complete Agency New Business Solution</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                          <div>
                            <h5 className="font-medium mb-2">Product</h5>
                            <ul className="space-y-1 text-sm text-white/80">
                              <li>Features</li>
                              <li>Pricing</li>
                              <li>Integrations</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Resources</h5>
                            <ul className="space-y-1 text-sm text-white/80">
                              <li>Documentation</li>
                              <li>Guides</li>
                              <li>Support</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Company</h5>
                            <ul className="space-y-1 text-sm text-white/80">
                              <li>About</li>
                              <li>Blog</li>
                              <li>Contact</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
} 