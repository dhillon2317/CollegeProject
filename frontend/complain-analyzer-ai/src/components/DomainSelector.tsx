import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import { DOMAIN_CONFIGS, setCurrentDomain } from "./DomainConfig";
import type { DomainConfig } from "../src/config/domains";


interface DomainSelectorProps {
  onDomainSelected: (domain: DomainConfig) => void;
}

export function DomainSelector({ onDomainSelected }: DomainSelectorProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
  };

  const handleConfirm = () => {
    if (selectedDomain) {
      const domain = DOMAIN_CONFIGS[selectedDomain];
      setCurrentDomain(selectedDomain);
      onDomainSelected(domain);
    }
  };

  const domains = Object.values(DOMAIN_CONFIGS);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Complaint Analyzer AI</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your institution type to customize the complaint management system 
            with relevant categories, departments, and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {domains.map((domain) => (
            <Card
              key={domain.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedDomain === domain.id
                  ? "ring-2 ring-primary border-primary shadow-md"
                  : "hover:border-muted-foreground/50"
              }`}
              onClick={() => handleDomainSelect(domain.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{domain.icon}</div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {domain.name}
                  {selectedDomain === domain.id && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription className="text-center">
                  {domain.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedDomain && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  You've selected <strong>{DOMAIN_CONFIGS[selectedDomain].name}</strong>. 
                  The system will be customized with relevant categories and workflows.
                </p>
                <Button onClick={handleConfirm} className="w-full">
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Don't see your institution type? More domains will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
