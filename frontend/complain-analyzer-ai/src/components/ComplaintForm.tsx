import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeComplaint } from "../services/complaintService";
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
import { toast } from "sonner";
import { complaintService } from "../services/api";

type FormData = {
  title: string;
  description: string;
  department: string;
  priority: string;
  contactInfo: string;
  userType: string;
  domain: string;
  type?: string;
  category?: string;
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  aiAnalysis?: {
    categoryConfidence?: number;
    priorityConfidence?: number;
    departmentConfidence?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    sentimentScore?: number;
    keywords?: string[];
  };
};

// Domain-specific configurations
const domainConfigs = {
  healthcare: {
    categories: [
      "Patient Care",
      "Billing",
      "Appointment Scheduling",
      "Medical Staff",
      "Facilities",
      "Medical Records",
    ],
    departments: [
      "Emergency Room",
      "General Practice",
      "Cardiology",
      "Pediatrics",
      "Radiology",
      "Pharmacy",
    ],
  },
  business: {
    categories: [
      "Billing",
      "Customer Service",
      "Product Quality",
      "Shipping",
      "Account Issues",
      "Website Problems",
    ],
    departments: [
      "Billing",
      "Customer Support",
      "Sales",
      "Technical Support",
      "Management",
      "Operations",
    ],
  },
  education: {
    categories: [
      "Academic",
      "Facilities",
      "Staff Related",
      "Hygiene & Sanitation",
      "Security",
      "Other",
    ],
    departments: [
      "Academic Office",
      "Facilities Management",
      "IT Department",
      "Student Affairs",
      "Security",
      "Administration",
    ],
  },
  default: {
    categories: ["General", "Technical", "Billing", "Other"],
    departments: ["General Support", "Technical Support", "Billing", "Other"],
  },
};

const priorities = ["Low", "Medium", "High"];
const userTypes = [
  "Student",
  "Faculty/Staff",
  "Parent/Guardian",
  "Patient",
  "Customer",
  "Visitor",
  "Other",
];

export function ComplaintForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    department: "",
    priority: "medium",
    contactInfo: "",
    userType: "student",
    domain: window.location.hostname,
    status: 'pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.description) {
      toast.warning('Please enter a complaint description to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeComplaint(formData.description);
      
      setFormData(prev => ({
        ...prev,
        ...analysis,
        aiAnalysis: analysis.aiAnalysis
      }));
      
      toast.success('Complaint analyzed successfully!');
    } catch (error: any) {
      console.error('Error analyzing complaint:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to analyze complaint. Please try again.';
      toast.error(`Error: ${errorMessage}`);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.department || !formData.contactInfo) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if backend is reachable
      try {
        await fetch('http://localhost:5001/api/health');
      } catch (error) {
        console.error('Backend connection error:', error);
        throw new Error('Unable to connect to the server. Please make sure the backend is running on http://localhost:5001');
      }

      // Prepare the submission data with all required fields
      const submissionData = {
        title: formData.title,
        description: formData.description,
        contactInfo: formData.contactInfo,
        userType: formData.userType || 'Student',
        domain: formData.domain || 'default',
        status: 'pending',
        department: formData.department,
        priority: formData.priority || 'medium',
        category: formData.category || 'General',
        type: formData.type || 'General',
        // Include AI analysis if available
        ...(formData.aiAnalysis && { aiAnalysis: formData.aiAnalysis })
      };

      console.log('Submitting complaint:', submissionData);
      
      // Use the complaintService to submit the complaint
      const response = await complaintService.createComplaint(submissionData);
      
      if (response && response.id) {
        toast.success('Complaint submitted successfully!');
        setIsSuccess(true);
        setFormData({
          title: '',
          description: '',
          department: '',
          priority: 'medium',
          contactInfo: '',
          userType: 'student',
          domain: window.location.hostname,
        });
        
        // Redirect to complaints list after a short delay
        setTimeout(() => {
          navigate('/complaints');
        }, 1500);
      } else {
        throw new Error('Invalid response from server');
      }
      
      return response;
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      
      let errorMessage = 'Failed to submit complaint.';
      
      // Handle specific error cases
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        // Optionally redirect to login
        // navigate('/login');
      } else if (error.status === 400) {
        errorMessage = error.message || "Invalid data. Please check your input and try again.";
      } else if (error.status === 500) {
        errorMessage = "Server error. Please try again later or contact support if the problem persists.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      toast.error(`Error: ${errorMessage}`);
      
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
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
    <div className="bg-gray-100 p-4 m-2 rounded-[15px]">


    <Card className="w-full max-w-3xl mx-auto border-2 border-black rounded-2xl overflow-hidden">
      <CardHeader className="bg-white p-6 ">
        <CardTitle className="text-2xl font-bold">File a Complaint</CardTitle>
        <CardDescription className="text-gray-600">
          Please fill out the form below to submit your complaint or concern.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 bg-gray-100 p-2 rounded-[10px]">
            <div className="space-y-2 bg-gray-300 p-2 rounded-[10px]">
              <Label htmlFor="title">Complaint Title *</Label>
              <Input
                id="title"
                placeholder="Brief title of your complaint"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div className="space-y-2 bg-gray-300 p-2 rounded-[10px]">
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
                  Analyze with AI
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

            <div className="space-y-2 bg-gray-300 p-3 rounded-[10px]">
              <Label htmlFor="userType">You are *</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => handleSelectChange(value, "userType")}
              >
                <SelectTrigger className=" bg-white border-2 border-gray-200 text-gray-600 focus:ring-1 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 bg-gray-300 p-3 rounded-[10px]">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                type="email"
                placeholder="Your email or phone number"
                value={formData.contactInfo}
                onChange={(e) =>
                  handleInputChange("contactInfo", e.target.value)
                }
                className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div className="flex justify-between ">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    title: "Network connectivity issues in the library",
                    description:
                      "I've been experiencing frequent disconnections from the WiFi in the library, especially in the second floor study area. This has been happening for the past 3 days during peak hours.",
                    department: "it",
                    priority: "high",
                    contactInfo: "john.doe@example.com",
                    userType: "student",
                    domain: window.location.hostname,
                    status: 'pending'
                  });
                }}
                className="w-full sm:w-auto"
              >
                Fill Sample
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !formData.description}
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-300" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 text-blue-300" />
                )}
                Analyze with AI
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isAnalyzing}
                className="w-full sm:w-auto bg-blue-400 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Complaint
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
