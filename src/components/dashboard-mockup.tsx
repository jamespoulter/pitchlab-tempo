"use client";

import { Card } from "@/components/ui/card";
import { 
    BarChart3, 
    FileText, 
    Users, 
    Building2, 
    FolderKanban, 
    BrainCircuit, 
    PieChart,
    Calendar,
    CheckCircle2
} from "lucide-react";

export default function DashboardMockup() {
    return (
        <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-xl bg-white">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">P</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">PitchHub Dashboard</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <span className="text-sm text-gray-600">Agency Admin</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Active Proposals", value: "12", icon: <FileText className="h-5 w-5 text-blue-500" /> },
                        { label: "Clients", value: "24", icon: <Users className="h-5 w-5 text-green-500" /> },
                        { label: "Case Studies", value: "8", icon: <FolderKanban className="h-5 w-5 text-purple-500" /> },
                        { label: "Brands", value: "3", icon: <Building2 className="h-5 w-5 text-orange-500" /> }
                    ].map((stat, index) => (
                        <Card key={index} className="p-4 flex flex-col items-center justify-center">
                            <div className="mb-2">{stat.icon}</div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                {/* Main Dashboard Area */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="col-span-2 space-y-6">
                        {/* AI Proposal Generator */}
                        <Card className="p-5 border-2 border-blue-100 bg-blue-50">
                            <div className="flex items-center mb-4">
                                <BrainCircuit className="h-6 w-6 text-blue-600 mr-2" />
                                <h3 className="font-semibold text-blue-800">AI Proposal Generator</h3>
                            </div>
                            <div className="bg-white rounded-md p-3 border border-blue-200 mb-3">
                                <p className="text-sm text-gray-700">Generate a proposal for <span className="font-medium">Website Redesign</span> for <span className="font-medium">Acme Corp</span></p>
                            </div>
                            <div className="flex space-x-2">
                                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Website</div>
                                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">E-commerce</div>
                                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Branding</div>
                                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">+ Add</div>
                            </div>
                        </Card>

                        {/* Recent Proposals */}
                        <Card className="p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">Recent Proposals</h3>
                                <button className="text-xs text-blue-600">View All</button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { client: "Acme Corp", type: "Website Redesign", status: "Sent", date: "2 days ago" },
                                    { client: "TechStart", type: "Brand Identity", status: "Draft", date: "1 week ago" },
                                    { client: "GreenLife", type: "Marketing Campaign", status: "Approved", date: "2 weeks ago" }
                                ].map((proposal, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{proposal.client}</p>
                                            <p className="text-xs text-gray-500">{proposal.type}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                                                proposal.status === "Approved" ? "bg-green-100 text-green-700" :
                                                proposal.status === "Sent" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                                {proposal.status}
                                            </span>
                                            <span className="text-xs text-gray-400">{proposal.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Agency Brands */}
                        <Card className="p-5">
                            <div className="flex items-center mb-4">
                                <Building2 className="h-5 w-5 text-gray-700 mr-2" />
                                <h3 className="font-semibold">Agency Brands</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Main Agency", color: "bg-blue-500" },
                                    { name: "Creative Studio", color: "bg-purple-500" },
                                    { name: "Digital Marketing", color: "bg-green-500" }
                                ].map((brand, index) => (
                                    <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                                        <div className={`h-4 w-4 rounded-full ${brand.color} mr-2`}></div>
                                        <span className="text-sm">{brand.name}</span>
                                    </div>
                                ))}
                                <button className="w-full text-center text-xs text-blue-600 mt-2">+ Add Brand</button>
                            </div>
                        </Card>

                        {/* Case Studies */}
                        <Card className="p-5">
                            <div className="flex items-center mb-4">
                                <FolderKanban className="h-5 w-5 text-gray-700 mr-2" />
                                <h3 className="font-semibold">Case Studies</h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { title: "E-commerce Redesign", client: "Fashion Brand" },
                                    { title: "SEO Campaign", client: "Local Business" },
                                    { title: "Brand Identity", client: "Tech Startup" }
                                ].map((study, index) => (
                                    <div key={index} className="p-2 border border-gray-100 rounded-md">
                                        <p className="text-sm font-medium">{study.title}</p>
                                        <p className="text-xs text-gray-500">{study.client}</p>
                                    </div>
                                ))}
                                <button className="w-full text-center text-xs text-blue-600 mt-2">+ Add Case Study</button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 