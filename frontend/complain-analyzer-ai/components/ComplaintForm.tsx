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
      // NOTE: ensure this port matches your backend (5001 if your API runs on :5001)
      const response = await fetch(`http://localhost:5001/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: text }),
      });

      // read body once
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errMsg =
          (data && (data.error || data.message)) ||
          "Failed to analyze complaint";
        throw new Error(errMsg);
      }

      if (data && data.success) {
        toast.success("Complaint analyzed successfully!");
        return data.data || null; // Return the data property which contains the analysis
      } else {
        const errMsg =
          (data && (data.error || data.message)) || "Analysis failed";
        throw new Error(errMsg);
      }
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
        // Keep the existing userType, don't let AI override it
        userType: prev.userType,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure description present
      if (!formData.description || !formData.description.trim()) {
        toast.error("Please enter a complaint description");
        return;
      }

      // If AI fields missing, run analysis first
      if (
        !formData.category ||
        !formData.priority ||
        !formData.department ||
        !formData.type
      ) {
        const analysis = await analyzeComplaint(formData.description);
        if (!analysis) {
          throw new Error("AI analysis failed");
        }
        setFormData((prev) => ({
          ...prev,
          category: analysis.category || prev.category || "",
          priority: analysis.priority || prev.priority || "",
          department:
            analysis.assignedDepartment ||
            analysis.department ||
            prev.department ||
            "",
          type: analysis.type || analysis.userType || prev.type || "",
        }));
        // merge for immediate submit
        formData.category = formData.category || analysis.category || "";
        formData.priority = formData.priority || analysis.priority || "";
        formData.department =
          formData.department ||
          analysis.assignedDepartment ||
          analysis.department ||
          "";
        formData.type =
          formData.type || analysis.type || analysis.userType || "";
      }

      const body = {
        title: formData.title || "",
        description: formData.description,
        userType: formData.userType || "Student",
        contactInfo: formData.contactInfo || "",
        category: formData.category || "",
        priority: formData.priority || "",
        department: formData.department || "",
        type: formData.type || "",
        aiAnalyzed: true,
        createdAt: new Date().toISOString(),
      };

      const resp = await fetch("http://localhost:5001/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const respJson = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(respJson.error || `Status ${resp.status}`);

      toast.success("Complaint submitted successfully");
      // reset form
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
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error(
        `Failed to submit complaint: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
