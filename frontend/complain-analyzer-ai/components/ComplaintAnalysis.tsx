import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  Brain,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target
} from "lucide-react";
import { getCurrentDomain } from "./DomainConfig";
import React from "react";

interface ComplaintAnalysisProps {
  complaintId: string;
  onChangeDomain: () => void;
}

export function ComplaintAnalysis({ complaintId, onChangeDomain }: ComplaintAnalysisProps) {
  const domain = getCurrentDomain();

  // College-specific AI analysis data
  const analysisData = {
    complaint: {
      id: complaintId,
      title: "Ceiling fan not working in Lecture Hall 3",
      description: "The ceiling fan in LH-3 has been non-functional for the past 3 days. With the summer heat approaching, it's becoming very difficult for students to concentrate during lectures. Multiple students have complained about the stuffiness, and some have started skipping classes in this hall. The issue seems to be electrical as the fan doesn't respond to the switch at all.",
      submittedBy: "Student (Final Year, CSE)",
      submittedAt: "2024-08-07 14:30:00",
      category: "Infrastructure/Facilities",
      userType: "Student",
      status: "Analyzing"
    },
    aiAnalysis: {
      confidence: 96,
      severity: "Medium",
      priority: "High",
      estimatedResolution: "4-6 hours",
      department: "Maintenance & Facilities",
      similarCases: 2,
      riskLevel: "Medium",
      categories: [
        { name: "Electrical/Infrastructure", probability: 94 },
        { name: "Student Welfare", probability: 89 },
        { name: "Academic Environment", probability: 85 }
      ],
      sentimentAnalysis: {
        urgency: 78,
        frustration: 65,
        clarity: 92
      },
      keyInsights: [
        "Issue affects multiple students and class attendance",
        "Timing coincides with rising temperatures - seasonal urgency",
        "Simple electrical repair likely needed",
        "Similar issues reported in LH-5 last month",
        "Students actively avoiding affected classroom"
      ],
      recommendedActions: [
        {
          action: "Dispatch electrician to inspect ceiling fan wiring and motor",
          priority: "High",
          estimatedTime: "2 hours",
          assignee: "Maintenance Team"
        },
        {
          action: "Arrange temporary ventilation (portable fans) if repair takes longer",
          priority: "Medium",
          estimatedTime: "30 minutes",
          assignee: "Facility Coordinator"
        },
        {
          action: "Check electrical connections in all lecture halls for preventive maintenance",
          priority: "Medium",
          estimatedTime: "4 hours",
          assignee: "Electrical Maintenance"
        },
        {
          action: "Update students and faculty about repair timeline",
          priority: "Low",
          estimatedTime: "15 minutes",
          assignee: "Academic Office"
        }
      ],
      riskFactors: [
        "Declining class attendance",
        "Student discomfort and health concerns",
        "Negative impact on learning environment",
        "Potential similar failures in other halls"
      ],
      impactAnalysis: {
        studentsAffected: "~60 students daily",
        classesImpacted: "4-5 lectures per day",
        academicImpact: "Medium - affecting concentration",
        urgencyScore: 75
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-blue-100 text-blue-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div className="space-y-6">

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Analysis Results - {domain.name}
              </CardTitle>
              <CardDescription>
                Complaint #{analysisData.complaint.id} • Analyzed with {analysisData.aiAnalysis.confidence}% confidence
              </CardDescription>
            </div>
            <Badge variant={getSeverityColor(analysisData.aiAnalysis.severity)}>
              {analysisData.aiAnalysis.severity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div className="font-semibold">Priority</div>
              <div className={`inline-block px-2 py-1 rounded-full text-sm mt-1 ${getPriorityColor(analysisData.aiAnalysis.priority)}`}>
                {analysisData.aiAnalysis.priority}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div className="font-semibold">Est. Resolution</div>
              <div className="text-sm text-muted-foreground mt-1">
                {analysisData.aiAnalysis.estimatedResolution}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div className="font-semibold">Department</div>
              <div className="text-sm text-muted-foreground mt-1">
                {analysisData.aiAnalysis.department}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div className="font-semibold">Similar Cases</div>
              <div className="text-sm text-muted-foreground mt-1">
                {analysisData.aiAnalysis.similarCases} this month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* College Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>College Impact Assessment</CardTitle>
          <CardDescription>
            Analysis of how this issue affects students and academic activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Students Affected</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {analysisData.aiAnalysis.impactAnalysis.studentsAffected}
                </p>
                <p className="text-sm text-muted-foreground">Directly impacted by this issue</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Classes Impacted</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {analysisData.aiAnalysis.impactAnalysis.classesImpacted}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled in affected location</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Academic Impact Level</h4>
                <Badge variant="secondary" className="text-sm">
                  {analysisData.aiAnalysis.impactAnalysis.academicImpact}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Affecting student concentration and attendance
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Urgency Score</h4>
                <div className="flex items-center gap-2">
                  <Progress value={analysisData.aiAnalysis.impactAnalysis.urgencyScore} />
                  <span className="text-sm font-medium">
                    {analysisData.aiAnalysis.impactAnalysis.urgencyScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>
            AI classification confidence levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.aiAnalysis.categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {category.probability}%
                  </span>
                </div>
                <Progress value={category.probability} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
          <CardDescription>
            AI-generated action plan based on college complaint analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.aiAnalysis.recommendedActions.map((action, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{action.action}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <span>⏱️ {action.estimatedTime}</span>
                  <span>👤 {action.assignee}</span>
                </div>
                <Button size="sm" className="w-auto md:w-auto">
                  Assign Action <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Risk Factors</h4>
              <ul className="space-y-2">
                {analysisData.aiAnalysis.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Sentiment Analysis</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Urgency</span>
                    <span>{analysisData.aiAnalysis.sentimentAnalysis.urgency}%</span>
                  </div>
                  <Progress value={analysisData.aiAnalysis.sentimentAnalysis.urgency} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Frustration Level</span>
                    <span>{analysisData.aiAnalysis.sentimentAnalysis.frustration}%</span>
                  </div>
                  <Progress value={analysisData.aiAnalysis.sentimentAnalysis.frustration} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Clarity</span>
                    <span>{analysisData.aiAnalysis.sentimentAnalysis.clarity}%</span>
                  </div>
                  <Progress value={analysisData.aiAnalysis.sentimentAnalysis.clarity} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysisData.aiAnalysis.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}