
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Brain,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";
import { getCurrentDomain } from "./DomainConfig";

// --- Merged from ComplaintAnalysis.tsx ---
interface ComplaintAnalysisViewProps {
  complaintId: string;
  onBack: () => void;
}

function ComplaintAnalysisView({ complaintId, onBack }: ComplaintAnalysisViewProps) {
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
      <Button onClick={onBack} variant="outline">Back to Analytics</Button>
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


// --- Merged from Analytics.tsx ---
interface AnalyticsDashboardProps {
  onSelectComplaint: (complaintId: string) => void;
}

function AnalyticsDashboard({ onSelectComplaint }: AnalyticsDashboardProps) {
  const domain = getCurrentDomain();
  
  // College-specific analytics data
  const complaintsOverTime = [
    { month: "Feb", complaints: 28, resolved: 25 },
    { month: "Mar", complaints: 35, resolved: 31 },
    { month: "Apr", complaints: 42, resolved: 38 },
    { month: "May", complaints: 31, resolved: 29 },
    { month: "Jun", complaints: 45, resolved: 40 },
    { month: "Jul", complaints: 38, resolved: 35 },
  ];

  const categoryData = [
    { name: "Infrastructure/Facilities", value: 28, color: "#8884d8" },
    { name: "Fee & Financial Issues", value: 22, color: "#82ca9d" },
    { name: "IT & Technical Support", value: 18, color: "#ffc658" },
    { name: "Food Services/Canteen", value: 15, color: "#ff7300" },
    { name: "Parking & Transportation", value: 10, color: "#0088fe" },
    { name: "Other", value: 7, color: "#00C49F" },
  ];

  const departmentPerformance = [
    { department: "IT Department", avgResolutionTime: 1.2, satisfactionScore: 4.3 },
    { department: "Maintenance & Facilities", avgResolutionTime: 3.5, satisfactionScore: 3.9 },
    { department: "Finance Office", avgResolutionTime: 5.8, satisfactionScore: 3.6 },
    { department: "Food Services", avgResolutionTime: 2.1, satisfactionScore: 4.0 },
    { department: "Transport Office", avgResolutionTime: 4.2, satisfactionScore: 3.7 },
    { department: "Student Affairs", avgResolutionTime: 2.8, satisfactionScore: 4.2 },
  ];

  const aiInsights = [
    {
      title: "Peak Complaint Timing",
      insight: "Infrastructure complaints spike during exam periods due to higher usage",
      confidence: 91,
      actionable: true
    },
    {
      title: "Fee Payment Patterns", 
      insight: "Financial complaints increase 2 weeks before semester fee deadlines",
      confidence: 96,
      actionable: true
    },
    {
      title: "Seasonal Infrastructure Issues",
      insight: "Electrical problems (fans, lights) increase 40% during summer months",
      confidence: 88,
      actionable: true
    },
    {
      title: "Student Response Rate",
      insight: "Students are 70% more likely to submit complaints via mobile devices",
      confidence: 84,
      actionable: false
    }
  ];

  const resolutionTimeData = [
    { severity: "Critical", avgTime: 4.2, target: 4.0 },
    { severity: "High", avgTime: 12.8, target: 12.0 },
    { severity: "Medium", avgTime: 48.5, target: 48.0 },
    { severity: "Low", avgTime: 96.3, target: 96.0 },
  ];

  // College-specific metrics
  const semesterTrends = [
    { period: "Sem Start", complaints: 15, type: "Academic Issues" },
    { period: "Mid Sem", complaints: 42, type: "Infrastructure" },
    { period: "Exam Time", complaints: 38, type: "Facilities" },
    { period: "Sem End", complaints: 25, type: "Administrative" },
  ];

  const userTypeData = [
    { type: "Students", percentage: 78, complaints: 156 },
    { type: "Faculty/Staff", percentage: 18, complaints: 36 },
    { type: "Parents", percentage: 3, complaints: 6 },
    { type: "Visitors", percentage: 1, complaints: 2 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00C49F"];

  return (
    <div className="space-y-6">
      <Button onClick={() => onSelectComplaint("C-12345")}>View Sample Complaint Analysis</Button>
      {/* College-specific Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.6h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↓ 22%</span> from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 5%</span> since implementation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.9/5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 0.3</span> from last survey
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">78% of total enrolled</p>
          </CardContent>
        </Card>
      </div>

      {/* College Domain Indicator */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{domain.icon}</div>
            <div>
              <h3 className="font-semibold">Analytics for {domain.name}</h3>
              <p className="text-sm text-muted-foreground">
                Insights specifically tailored for college and university complaint patterns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Complaint Trends</CardTitle>
            <CardDescription>Semester-wise complaint volume and resolution patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#8884d8" name="Total Complaints" />
                <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
            <CardDescription>Distribution of college-specific complaint types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name.split('/')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints by User Type</CardTitle>
          <CardDescription>Who is submitting complaints and their satisfaction levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTypeData.map((userType, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{userType.type}</span>
                  <div className="text-sm text-muted-foreground">
                    {userType.complaints} complaints ({userType.percentage}%)
                  </div>
                </div>
                <Progress value={userType.percentage} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Average resolution time and satisfaction scores by college departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{dept.department}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Avg: {dept.avgResolutionTime}d</span>
                    <span>Rating: {dept.satisfactionScore}/5</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Resolution Time</div>
                    <Progress value={(7 - dept.avgResolutionTime) * 14.3} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Satisfaction</div>
                    <Progress value={dept.satisfactionScore * 20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* College-specific AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            College-Specific AI Insights
          </CardTitle>
          <CardDescription>Patterns and trends identified specifically for educational institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">{insight.title}</h4>
                  {insight.actionable && (
                    <Badge variant="secondary">Actionable</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    Confidence: {insight.confidence}%
                  </div>
                  <Progress value={insight.confidence} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semester Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Pattern Analysis</CardTitle>
          <CardDescription>How complaints vary throughout the academic semester</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={semesterTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#8884d8" name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p><strong>Key Insight:</strong> Infrastructure complaints peak during mid-semester and exam periods due to increased facility usage and stress on systems.</p>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Resolution Time vs Targets</CardTitle>
          <CardDescription>How actual resolution times compare to college service level targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resolutionTimeData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.severity}</span>
                  <div className="text-sm text-muted-foreground">
                    {item.avgTime}h (Target: {item.target}h)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.avgTime <= item.target ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((item.avgTime / (item.target * 1.5)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {item.avgTime <= item.target ? (
                    <span className="text-xs text-green-600">On Target</span>
                  ) : (
                    <span className="text-xs text-red-600">
                      {((item.avgTime - item.target) / item.target * 100).toFixed(0)}% Over
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Component ---
export function ComplaintAnalytics() {
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  if (selectedComplaintId) {
    return <ComplaintAnalysisView complaintId={selectedComplaintId} onBack={() => setSelectedComplaintId(null)} />;
  }

  return <AnalyticsDashboard onSelectComplaint={setSelectedComplaintId} />;
}
