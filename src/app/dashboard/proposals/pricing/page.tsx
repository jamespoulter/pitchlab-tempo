import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Save,
  ArrowLeft,
  Plus,
  DollarSign,
  Check,
  Trash,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function ProposalPricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/proposals/new">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Builder</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Proposal Pricing
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage pricing tables for your proposal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
          <Button className="gap-1">
            <Save className="h-4 w-4" />
            <span>Save Pricing</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Tables</CardTitle>
              <CardDescription>
                Create pricing tables to include in your proposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="packages">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                  <TabsTrigger value="itemized">Itemized</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                </TabsList>

                <TabsContent value="packages" className="space-y-6">
                  {/* Package Pricing Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-4 border-b">
                      <h3 className="font-medium">Service Packages</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Basic Package */}
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-blue-50 p-4 border-b">
                            <h4 className="font-medium text-center">Basic</h4>
                          </div>
                          <div className="p-4">
                            <div className="text-center mb-4">
                              <p className="text-3xl font-bold">$1,500</p>
                              <p className="text-sm text-muted-foreground">
                                One-time fee
                              </p>
                            </div>
                            <ul className="space-y-2 mb-4">
                              {[
                                "Brand Strategy Session",
                                "Logo Design",
                                "Business Card Design",
                                "Basic Style Guide",
                              ].map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Standard Package */}
                        <div className="border-2 border-blue-500 rounded-md overflow-hidden shadow-md">
                          <div className="bg-blue-500 p-4 border-b">
                            <h4 className="font-medium text-center text-white">
                              Standard
                            </h4>
                          </div>
                          <div className="p-4">
                            <div className="text-center mb-4">
                              <p className="text-3xl font-bold">$3,500</p>
                              <p className="text-sm text-muted-foreground">
                                One-time fee
                              </p>
                            </div>
                            <ul className="space-y-2 mb-4">
                              {[
                                "Everything in Basic",
                                "Website Design (5 pages)",
                                "Social Media Templates",
                                "Email Signature",
                                "Comprehensive Style Guide",
                              ].map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Premium Package */}
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-blue-50 p-4 border-b">
                            <h4 className="font-medium text-center">Premium</h4>
                          </div>
                          <div className="p-4">
                            <div className="text-center mb-4">
                              <p className="text-3xl font-bold">$7,500</p>
                              <p className="text-sm text-muted-foreground">
                                One-time fee
                              </p>
                            </div>
                            <ul className="space-y-2 mb-4">
                              {[
                                "Everything in Standard",
                                "Website Design (10 pages)",
                                "Marketing Collateral",
                                "Brand Photography",
                                "Video Intro",
                                "3 Months Social Media Management",
                              ].map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Package
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Packages
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itemized" className="space-y-6">
                  {/* Itemized Pricing Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-4 border-b">
                      <h3 className="font-medium">Itemized Services</h3>
                    </div>
                    <div className="p-4">
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-6">Service</div>
                          <div className="col-span-2">Quantity</div>
                          <div className="col-span-2">Rate</div>
                          <div className="col-span-2">Total</div>
                        </div>
                        <div className="divide-y">
                          {[
                            {
                              service: "Brand Strategy Workshop",
                              quantity: 1,
                              rate: "$1,500.00",
                              total: "$1,500.00",
                            },
                            {
                              service: "Logo Design",
                              quantity: 1,
                              rate: "$800.00",
                              total: "$800.00",
                            },
                            {
                              service: "Website Design",
                              quantity: 5,
                              rate: "$400.00",
                              total: "$2,000.00",
                            },
                            {
                              service: "Social Media Templates",
                              quantity: 3,
                              rate: "$250.00",
                              total: "$750.00",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 p-3 items-center"
                            >
                              <div className="col-span-6">{item.service}</div>
                              <div className="col-span-2">{item.quantity}</div>
                              <div className="col-span-2">{item.rate}</div>
                              <div className="col-span-2">{item.total}</div>
                            </div>
                          ))}
                          <div className="grid grid-cols-12 p-3 items-center bg-muted/30">
                            <div className="col-span-10 text-right font-medium">
                              Subtotal:
                            </div>
                            <div className="col-span-2 font-medium">
                              $5,050.00
                            </div>
                          </div>
                          <div className="grid grid-cols-12 p-3 items-center">
                            <div className="col-span-10 text-right">
                              Discount (10%):
                            </div>
                            <div className="col-span-2">-$505.00</div>
                          </div>
                          <div className="grid grid-cols-12 p-3 items-center bg-blue-50">
                            <div className="col-span-10 text-right font-bold">
                              Total:
                            </div>
                            <div className="col-span-2 font-bold">
                              $4,545.00
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Item
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Discount
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-6">
                  {/* Comparison Pricing Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-4 border-b">
                      <h3 className="font-medium">Service Comparison</h3>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border p-3 text-left bg-muted/30">
                              Feature
                            </th>
                            <th className="border p-3 text-center bg-muted/30">
                              Basic
                            </th>
                            <th className="border p-3 text-center bg-blue-50">
                              Standard
                            </th>
                            <th className="border p-3 text-center bg-muted/30">
                              Premium
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-3">Brand Strategy</td>
                            <td className="border p-3 text-center">Basic</td>
                            <td className="border p-3 text-center">
                              Comprehensive
                            </td>
                            <td className="border p-3 text-center">Advanced</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Logo Design</td>
                            <td className="border p-3 text-center">
                              3 Concepts
                            </td>
                            <td className="border p-3 text-center">
                              5 Concepts
                            </td>
                            <td className="border p-3 text-center">
                              Unlimited
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3">Website</td>
                            <td className="border p-3 text-center">—</td>
                            <td className="border p-3 text-center">5 Pages</td>
                            <td className="border p-3 text-center">10 Pages</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Social Media</td>
                            <td className="border p-3 text-center">—</td>
                            <td className="border p-3 text-center">
                              Templates
                            </td>
                            <td className="border p-3 text-center">
                              3 Months Management
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3">Style Guide</td>
                            <td className="border p-3 text-center">Basic</td>
                            <td className="border p-3 text-center">
                              Comprehensive
                            </td>
                            <td className="border p-3 text-center">
                              Comprehensive
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3">Revisions</td>
                            <td className="border p-3 text-center">2 Rounds</td>
                            <td className="border p-3 text-center">3 Rounds</td>
                            <td className="border p-3 text-center">
                              Unlimited
                            </td>
                          </tr>
                          <tr className="bg-muted/10">
                            <td className="border p-3 font-bold">Price</td>
                            <td className="border p-3 text-center font-bold">
                              $1,500
                            </td>
                            <td className="border p-3 text-center font-bold">
                              $3,500
                            </td>
                            <td className="border p-3 text-center font-bold">
                              $7,500
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Feature
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Comparison
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
              <CardDescription>
                Define payment schedule and terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-schedule">Payment Schedule</Label>
                  <select
                    id="payment-schedule"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="50-50">
                      50% Upfront, 50% Upon Completion
                    </option>
                    <option value="33-33-33">
                      33% Upfront, 33% Midway, 33% Upon Completion
                    </option>
                    <option value="monthly">Monthly Installments</option>
                    <option value="custom">Custom Schedule</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-methods">
                    Accepted Payment Methods
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "credit-card", label: "Credit Card" },
                      { id: "bank-transfer", label: "Bank Transfer" },
                      { id: "paypal", label: "PayPal" },
                      { id: "check", label: "Check" },
                    ].map((method) => (
                      <div key={method.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={method.id}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <Label htmlFor={method.id} className="text-sm">
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Additional Terms</Label>
                  <Textarea
                    id="payment-terms"
                    placeholder="Enter any additional payment terms or conditions..."
                    rows={4}
                    defaultValue="Payment is due within 14 days of invoice date. Late payments are subject to a 1.5% monthly interest charge."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Options</CardTitle>
              <CardDescription>Configure pricing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                  <option value="cad">CAD ($)</option>
                  <option value="aud">AUD ($)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="0" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-discount">Show Discount</Label>
                  <input
                    type="checkbox"
                    id="show-discount"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-subtotal">Show Subtotal</Label>
                  <input
                    type="checkbox"
                    id="show-subtotal"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <Button variant="outline" className="w-full">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Calculate Total
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Pricing Templates</CardTitle>
              <CardDescription>
                Reuse pricing from previous proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Standard Web Design", date: "Oct 15, 2023" },
                  { name: "Social Media Package", date: "Sep 22, 2023" },
                  { name: "Branding Package", date: "Aug 10, 2023" },
                ].map((template, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Save Current as Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
