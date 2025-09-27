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

  // The 'categories', 'departments', and 'priorities' arrays are no longer needed.
  // const categories = [
  //   "Academic",
  //   "Facilities",
  //   "Staff Related",
  //   "Hygiene & Sanitation",
  //   "Security",
  //   "Other",
  // ];
  // const departments = [
  //   "Academic Office",
  //   "Facilities Management",
  //   "IT Department",
  //   "Human Resources",
  //   "Student Affairs",
  //   "Security",
  // ];
  // const priorities = ["Low", "Medium", "High", "Critical"];

  const userTypes = [
    "Student",
    "Faculty/Staff",
    "Parent/Guardian",
    "Visitor",
    "Other",
  ];

  // The 'categories' array is no longer needed as it's determined by AI.
  // const categories = [
  //   "Academic",
  //   "Facilities",
  //   "Staff Related",
  //   "Hygiene & Sanitation",
  //   "Security",
  //   "Other",
  // ];

  //   "Other",
  // ];

  // const departments = [
  //   "Academic Office",
  //   "Facilities Management",
  //   "IT Department",
  //   "Human Resources",
  //   "Student Affairs",
  //   "Security",
  // ];

  // const priorities = ["Low", "Medium", "High", "Critical"];

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
    if (!text) {
      toast.warning("Please enter a complaint description first.");
      return null;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaint: text }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to analyze complaint" }));
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      toast.success("Complaint analyzed successfully!");
      return data;
    } catch (error) {
      console.error("Error analyzing complaint:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Analysis Error: ${errorMessage}`);
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
        // Assuming your 'type' model predicts the userType
        userType: analysis.type || prev.userType,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalFormData = { ...formData };

      // If category is missing, it means AI analysis hasn't been run.
      // Run it now before submitting.
      if (!finalFormData.category) {
        toast.info("AI is analyzing your complaint before submission...");
        const analysis = await analyzeComplaint(formData.description);
        if (analysis) {
          finalFormData = {
            ...finalFormData,
            category: analysis.category,
            priority: analysis.priority,
            department: analysis.assignedDepartment,
            userType: analysis.type,
          };
        } else {
          // If analysis fails, stop the submission
          throw new Error("AI analysis failed. Please try again.");
        }
      }

      const requestBody = {
        ...finalFormData,
        status: "Pending",
        createdAt: new Date().toISOString(),
        aiAnalyzed: true,
      };

      console.log(
        "Sending request to backend:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch("http://localhost:5001/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error(
          "Backend error response:",
          response.status,
          response.statusText,
          responseData
        );
        throw new Error(
          responseData.error ||
            `Failed to submit complaint. Status: ${response.status}`
        );
      }

      console.log("Complaint submitted successfully:", responseData);
      setIsSubmitted(true);
      toast.success("Complaint submitted successfully!");

      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          department: "",
          priority: "", // Reset priority
          contactInfo: "",
          userType: "Student",
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to submit complaint: ${errorMessage}`);
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
