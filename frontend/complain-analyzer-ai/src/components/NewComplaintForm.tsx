import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { CheckCircle, Send } from "lucide-react";
import React from "react";
type FormData = {
    title: string;
    description: string;
    category: string;
    department: string;
    priority: string;
    contactInfo: string;
    userType: string;
};

export function NewComplaintForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        category: "",
        department: "",
        priority: "Medium",
        contactInfo: "",
        userType: "Student"
    });

    const categories = [
        "Academic",
        "Facilities",
        "Staff Related",
        "Hygiene & Sanitation",
        "Security",
        "Other"
    ];

    const departments = [
        "Academic Office",
        "Facilities Management",
        "IT Department",
        "Human Resources",
        "Student Affairs",
        "Security"
    ];

    const priorities = ["Low", "Medium", "High", "Critical"];
    const userTypes = ["Student", "Faculty/Staff", "Parent/Guardian", "Visitor", "Other"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string, name: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    complaintText: `${formData.title}\n\n${formData.description}`,
                    category: formData.category,
                    priority: formData.priority,
                    type: formData.userType,
                    assignedDepartment: formData.department,
                    contactInfo: formData.contactInfo,
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit complaint');
            }

            const result = await response.json();
            console.log('Complaint submitted successfully:', result);
            setIsSubmitted(true);
            
            // Reset form after successful submission
            setFormData({
                title: "",
                description: "",
                category: "",
                department: "",
                priority: "Medium",
                contactInfo: "",
                userType: "Student"
            });
            
            // Reset submission status after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Complaint Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">Your complaint has been received and is being processed.</p>
                <Button onClick={() => window.location.reload()}>Submit Another Complaint</Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Submit a Complaint</CardTitle>
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
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter a brief title for your complaint"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Please provide a detailed description of your complaint"
                                rows={5}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleSelectChange(value, 'category')}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department *</Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(value) => handleSelectChange(value, 'department')}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* <div className="space-y-2">
                                <Label htmlFor="priority">Priority *</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => handleSelectChange(value, 'priority')}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((priority) => (
                                            <SelectItem key={priority} value={priority}>
                                                {priority}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}

                            <div className="space-y-2">
                                <Label htmlFor="userType">You are *</Label>
                                <Select
                                    value={formData.userType}
                                    onValueChange={(value) => handleSelectChange(value, 'userType')}
                                    required
                                >
                                    <SelectTrigger>
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactInfo">Contact Information *</Label>
                            <Input
                                id="contactInfo"
                                name="contactInfo"
                                type="email"
                                value={formData.contactInfo}
                                onChange={handleInputChange}
                                placeholder="Your email address"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                'Submitting...'
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Complaint
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
