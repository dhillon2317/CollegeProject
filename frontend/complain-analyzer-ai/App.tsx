import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import {
  BarChart3,
  Brain,
  LayoutDashboard,
  Plus,
  Settings,
  HelpCircle,
  ArrowLeft
} from "lucide-react";

import { Dashboard } from "./components/Dashboard";
import { ComplaintForm } from "./components/ComplaintForm";
import { ComplaintAnalysis } from "./components/ComplaintAnalysis";
import { Analytics } from "./components/Analytics";
import { DomainSelector } from "./components/DomainSelector";
import { getCurrentDomain, type DomainConfig } from "./components/DomainConfig";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDomain, setSelectedDomain] = useState<DomainConfig | null>(null);
  const [showDomainSelector, setShowDomainSelector] = useState(false);

  useEffect(() => {
    const domain = getCurrentDomain();
    const savedDomain = localStorage.getItem('selectedDomain');

    if (!savedDomain) {
      setShowDomainSelector(true);
    } else {
      setSelectedDomain(domain);
    }
  }, []);

  const handleDomainSelected = (domain: DomainConfig) => {
    setSelectedDomain(domain);
    setShowDomainSelector(false);
  };

  const handleChangeDomain = () => {
    setShowDomainSelector(true);
  };

  if (showDomainSelector) {
    return <DomainSelector onDomainSelected={handleDomainSelected} />;
  }

  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <VercelAnalytics />
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-lg flex-shrink-0">
                <Brain className="h-4 w-4 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-xl font-semibold truncate">Complaint Analyzer AI</h1>
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-base md:text-lg flex-shrink-0">{selectedDomain.icon}</span>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {selectedDomain.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Badge variant="secondary" className="hidden lg:inline-flex text-xs">
                AI Powered
              </Badge>
              <Button size="sm" variant="outline" onClick={handleChangeDomain} className="px-2 md:px-3 transition-shadow hover:shadow-md">
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                <span className="hidden md:inline" style={{ cursor: "pointer" }}>Change Domain</span>
              </Button>
              <Button size="sm" variant="outline" className="px-2 md:px-3 transition-shadow hover:shadow-md">
                <Settings className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                <span className="hidden md:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList id="selector-elector" className="bg-muted text-muted-foreground items-center justify-center rounded-[25px] py-[2px] px-[-1px] grid w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl grid-cols-4 mb-4 md:mb-6 h-11 mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
              <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="hidden md:inline truncate">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="submit" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
              <Plus className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="hidden md:inline truncate">Submit</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
              <Brain className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="hidden md:inline truncate">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center justify-center gap-1 py-2 text-xs md:text-sm rounded-[25px] min-w-0">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="hidden md:inline truncate">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                {selectedDomain.name} Dashboard
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Overview of all complaints and their AI-powered analysis status for your institution
              </p>
            </div>
            <Dashboard />
          </TabsContent>

          <TabsContent value="submit" className="space-y-4 md:space-y-6">
            <div className="mb-4 md:mb-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Submit a Complaint</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                Our AI system will automatically analyze your complaint, categorize it based on {selectedDomain.name.toLowerCase()} standards,
                determine the priority level, and route it to the appropriate department for quick resolution.
              </p>
            </div>
            <ComplaintForm />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 md:space-y-6">
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Detailed AI Analysis</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                In-depth analysis of a college complaint with AI-generated insights and recommended actions
              </p>
            </div>
            <ComplaintAnalysis complaintId="C001" onChangeDomain={handleChangeDomain} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Analytics & Insights</h2>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Comprehensive analytics powered by AI to identify patterns, trends, and improvement opportunities
                specific to {selectedDomain.name.toLowerCase()}s
              </p>
            </div>
            <Analytics />
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
                {selectedDomain.icon} {selectedDomain.name}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}