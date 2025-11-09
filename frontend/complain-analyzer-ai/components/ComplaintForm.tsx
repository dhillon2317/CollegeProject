import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CheckCircle, Send, Sparkles, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import React from "react";
import { toast } from "sonner";
type FormData = {
  title: string;
  description: string;
  category: string;
  department: string;
  priority: string;
  contactInfo: string;
  userType: string;
};

export function ComplaintForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    department: "",
    priority: "", // Default priority is now empty
    contactInfo: "",
    userType: "Student",
  });

  const userTypes = [
    "Student",
    "Faculty/Staff",
    "Parent/Guardian",
    "Visitor",
    "Other",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const analyzeComplaint = async (text: string) => {
    if (!text?.trim()) {
      toast.error("Please enter a description first");
      return null;
    }

    setIsAnalyzing(true);
    try {
      console.log("Sending analysis request for:", text.substring(0, 100));
      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(), // Ensure text is trimmed
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Analysis response:", result);

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      // Ensure we're getting the correct structure back
      const analysis = result.data;
      if (!analysis || typeof analysis !== "object") {
        throw new Error("Invalid analysis response format");
      }

      return {
        category: analysis.category || "",
        priority: analysis.priority || "",
        department: analysis.department || "",
        type: analysis.type || "",
      };
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    const analysis = await analyzeComplaint(formData.description);
    if (analysis) {
      setFormData((prev) => ({
        ...prev,
        category: analysis.category || prev.category,
        priority: analysis.priority || prev.priority,
        department: analysis.assignedDepartment || prev.department,
        // Keep the existing userType, don't let AI override it
        userType: prev.userType,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.description) {
        throw new Error("Please enter a description");
      }

      console.log("Starting complaint submission...");

      // Run analysis first
      const analysis = await analyzeComplaint(formData.description);
      if (!analysis) {
        throw new Error("Failed to analyze complaint");
      }

      const completeData = {
        ...formData,
        ...analysis,
        aiAnalyzed: true,
        createdAt: new Date().toISOString(),
      };

      console.log("Sending complete data:", completeData);

      const response = await fetch("http://localhost:5001/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Submission failed: ${response.status}`
        );
      }

      toast.success("Complaint submitted successfully");
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        department: "",
        priority: "",
        contactInfo: "",
        userType: "Student",
        type: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Complaint Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-4">
          Your complaint has been received and is being processed.
        </p>
        <Button onClick={() => window.location.reload()}>
          Submit Another Complaint
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>File a Complaint</CardTitle>
        <CardDescription>
          Please fill out the form below to submit your complaint or concern.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Complaint Title *</Label>
              <Input
                id="title"
                placeholder="Brief title of your complaint"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Complaint Details *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !formData.description}
                  className="text-sm"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1" />
                  )}
                  AI Analyze
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="Please describe your complaint in detail..."
                className="min-h-[120px] border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">You are *</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => handleSelectChange(value, "userType")}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                type="email"
                placeholder="Your email or phone number"
                value={formData.contactInfo}
                onChange={(e) =>
                  handleInputChange("contactInfo", e.target.value)
                }
                className="border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Department and Priority are now handled by AI and are not user-selectable fields. */}
            {/* You can see the AI-selected values on the dashboard. */}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Complaint
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
