import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import {
    Brain,
    HelpCircle,
    ArrowLeft,
    LayoutDashboard,
    Plus,
    BarChart3,
    User
} from "lucide-react";

import { Dashboard } from "./Dashboard";
import { ComplaintForm } from "./ComplaintForm";
import { ComplaintAnalytics } from "./ComplaintAnalytics";
import { DomainSelector } from "./DomainSelector";
import { getCurrentDomain, type DomainConfig } from "../config/domains";
import { TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import complaintsData from "../../../../backend/data/complaints.json";

interface DashboardAppProps {
    children?: React.ReactNode;
}

// Function to load complaints from JSON file
const loadComplaintsFromJSON = () => {
    return complaintsData.map((complaint: any) => ({
        ...complaint,
        analysis: complaint.analysis || {
            category: complaint.category || 'General',
            priority: complaint.priority || 'Medium',
            type: complaint.type || 'General',
            assignedDepartment: complaint.department || 'General',
            aiConfidence: complaint.aiConfidence || 0
        }
    }));
};

export default function DashboardApp({ children }: DashboardAppProps) {
    const [selectedDomain, setSelectedDomain] = useState<DomainConfig | null>(() => {
        const currentDomain = getCurrentDomain();
        if (!currentDomain) {
            const defaultDomainId = 'healthcare'; // Set a default domain ID
            localStorage.setItem('selectedDomain', defaultDomainId);
            return {
                id: 'healthcare',
                name: 'Healthcare',
                description: 'Healthcare complaint management system',
                icon: '🏥',
                features: ['HIPAA Compliance', 'Patient Privacy', 'Medical Records'],
                color: '#10b981',
                theme: {
                    primary: '#10b981',
                    secondary: '#065f46',
                    accent: '#34d399'
                }
            };
        }
        return currentDomain;
    });

    const [showDomainSelector, setShowDomainSelector] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [complaints, setComplaints] = useState<any[]>(loadComplaintsFromJSON());
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleChangeDomain = () => {
        setShowDomainSelector(true);
    };

    const handleRefreshComplaints = () => {
        setIsRefreshing(true);
        // Simulate loading and reload from JSON
        setTimeout(() => {
            setComplaints(loadComplaintsFromJSON());
            setIsRefreshing(false);
        }, 1000);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/app/profile');
    };

    if (showDomainSelector) {
        return (
            <DomainSelector
                onDomainSelected={(domain) => {
                    setSelectedDomain(domain);
                    localStorage.setItem('selectedDomain', domain.id);
                    setShowDomainSelector(false);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {children || (
                <>
                    <VercelAnalytics />
                    <Toaster />

                    {/* Header */}
                    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
                        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleChangeDomain}
                                        className="flex items-center gap-2 hover:bg-gray-100 rounded-[50px]"
                                    >
                                        <Brain className="h-4 w-4 md:h-5 md:w-5" />
                                        <span className="hidden md:inline font-semibold">
                                            {selectedDomain?.name || 'Complaint Analyzer'}
                                        </span>
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3">
                                    {/* Profile Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleProfileClick}
                                        className="flex items-center gap-2 hover:bg-gray-100 rounded-[50px]"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="hidden md:inline">Profile</span>
                                    </Button>

                                    {/* Logout Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 hover:bg-red-50 text-red-600 rounded-[50px]"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="hidden md:inline">Logout</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 rounded-[50px]">
                        <div className="rounded-[50px] ">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rounded-[50px]">
                                <div className="rounded-[50px] w-[80%] mx-auto">
                                    <TabsList
                                        id="selector-elector"
                                        className="bg-gray-100 text-muted-foreground items-center justify-center rounded-[50px] py-[2px] px-[-1px] grid w-[80%] max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl grid-cols-3 mb-4 md:mb-6 h-11 mx-auto rounded-[100px]">
                                        <TabsTrigger
                                            value="dashboard"
                                            className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[50px] min-w-0">
                                            <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                                            <span className="hidden md:inline truncate">Dashboard</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="complaints"
                                            className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[50px] min-w-0">
                                            <Plus className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                                            <span className="hidden md:inline truncate">Submit</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="analytics"
                                            className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[50px] min-w-0">
                                            <BarChart3 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                                            <span className="hidden md:inline truncate">Analytics</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="dashboard" className="space-y-4 md:space-y-6 rounded-[50px]">
                                    <div className="mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-semibold mb-2">
                                            {selectedDomain?.name || 'Dashboard'} Dashboard
                                        </h2>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            Monitor and manage all {selectedDomain?.name?.toLowerCase() || 'complaint'} complaints in one place
                                        </p>
                                    </div>
                                    <Dashboard
                                        complaints={complaints}
                                        isLoading={isLoading}
                                        isRefreshing={isRefreshing}
                                        onRefresh={handleRefreshComplaints}
                                        setComplaints={setComplaints}
                                        setIsLoading={setIsLoading}
                                        setIsRefreshing={setIsRefreshing}
                                    />
                                </TabsContent>

                                <TabsContent value="complaints" className="space-y-4 md:space-y-6 rounded-[50px]">
                                    <div className="mb-4 md:mb-6 text-center">
                                        <h2 className="text-xl md:text-2xl font-semibold mb-2">Submit a Complaint</h2>
                                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                                            Our AI system will automatically analyze your complaint, categorize it based on {selectedDomain?.name?.toLowerCase() || 'general'} standards,
                                            determine the priority level, and route it to the appropriate department for quick resolution.
                                        </p>
                                    </div>
                                    <ComplaintForm />
                                </TabsContent>

                                <TabsContent value="analytics" className="space-y-4 md:space-y-6 rounded-[50px]">
                                    <div className="mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-semibold mb-2">Analytics & Insights</h2>
                                        <p className="text-sm md:text-base text-muted-foreground px-2">
                                            Comprehensive analytics powered by AI to identify patterns, trends, and improvement opportunities
                                            specific to {selectedDomain?.name?.toLowerCase() || 'general'}s
                                        </p>
                                    </div>
                                    <ComplaintAnalytics
                                        complaints={complaints}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                        {/* Help Section */}
                        <div className="fixed bottom-4 right-4 z-50">
                            <Button size="sm" variant="outline" className="rounded-full shadow-lg px-3 md:px-4">
                                <HelpCircle className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Help</span>
                            </Button>
                        </div>

                        {/* Footer with domain info */}
                        <div className="border-t bg-muted/30 py-3 md:py-4 mt-8 md:mt-12">
                            <div className="container mx-auto px-3 md:px-4">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 text-xs md:text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span>Current Domain:</span>
                                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                            {selectedDomain?.icon || '📋'} {selectedDomain?.name || 'General'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
