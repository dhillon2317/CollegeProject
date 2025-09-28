
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
  Zap,
  List,
  BarChart3
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
  complaints: any[];
}

function AnalyticsDashboard({ onSelectComplaint, complaints }: AnalyticsDashboardProps) {
  const domain = getCurrentDomain();

  // Enhanced AI analysis statistics with more detailed metrics
  const aiAnalysisStats = {
    // Basic counts
    totalAnalyzed: complaints.filter(c => c.aiAnalyzed).length,
    totalComplaints: complaints.length,
    averageConfidence: 0, // Will be calculated

    // Categorization metrics
    categories: {} as Record<string, {
      count: number,
      avgConfidence: number,
      avgResolution: number,
      sentiment: number
    }>,

    // Department metrics
    departments: {} as Record<string, {
      count: number,
      totalResolutionTime: number,
      avgResolution: number,
      avgConfidence: number,
      satisfaction: number
    }>,

    // Priority metrics
    priorities: {} as Record<string, number>,

    // Sentiment analysis
    sentiment: {
      positive: 0,
      neutral: 0,
      negative: 0,
      avgSentiment: 0,
      sentimentTrend: [
        { month: 'Jan', positive: 15, neutral: 20, negative: 5 },
        { month: 'Feb', positive: 18, neutral: 22, negative: 8 },
        { month: 'Mar', positive: 25, neutral: 25, negative: 10 },
        { month: 'Apr', positive: 30, neutral: 28, negative: 12 },
        { month: 'May', positive: 35, neutral: 30, negative: 15 },
        { month: 'Jun', positive: 40, neutral: 32, negative: 18 },
        { month: 'Jul', positive: 45, neutral: 35, negative: 20 }
      ]
    },

    // Resolution metrics
    resolutionMetrics: {
      avgResolutionTime: 0,
      resolutionRate: 0,
      firstResponseTime: 0,
      resolutionTrend: [
        { month: 'Jan', resolved: 15, unresolved: 5 },
        { month: 'Feb', resolved: 18, unresolved: 7 },
        { month: 'Mar', resolved: 22, unresolved: 8 },
        { month: 'Apr', resolved: 25, unresolved: 10 },
        { month: 'May', resolved: 30, unresolved: 12 },
        { month: 'Jun', resolved: 35, unresolved: 15 },
        { month: 'Jul', resolved: 40, unresolved: 18 }
      ]
    },

    // AI model performance
    modelPerformance: {
      predictionAccuracy: 0.87,
      confidenceThreshold: 0.85,
      modelDrift: 0.05,
      lastEvaluation: '2024-09-20T14:30:00Z',
      nextScheduledRetraining: '2024-12-20T00:00:00Z',
      dataDrift: 0.07,
      conceptDrift: 0.03
    },

    // Anomaly detection
    anomalies: [
      { id: 1, type: 'Spike in complaints', date: '2024-09-15', severity: 'high', description: 'Unusual 45% increase in infrastructure complaints' },
      { id: 2, type: 'Decreased resolution rate', date: '2024-09-10', severity: 'medium', description: '10% drop in resolution rate for IT department' },
      { id: 3, type: 'Sentiment shift', date: '2024-09-05', severity: 'low', description: 'Slight negative shift in sentiment for academic complaints' }
    ]
  };

  // Process complaints data for AI analysis with enhanced metrics
  let totalSentiment = 0;
  let totalResolutionTime = 0;
  let resolvedCount = 0;
  let totalResponseTime = 0;
  let responseCount = 0;

  complaints.forEach(complaint => {
    if (complaint.aiAnalyzed) {
      // Process categories with confidence
      if (complaint.category) {
        const cat = complaint.category;
        const current = aiAnalysisStats.categories[cat] || { 
          count: 0, 
          avgConfidence: 0,
          avgResolution: 0,
          sentiment: 0
        };
        const newCount = current.count + 1;
        aiAnalysisStats.categories[cat] = {
          count: newCount,
          avgConfidence: current.count > 0 
            ? (current.avgConfidence * current.count + (complaint.aiConfidence || 0)) / newCount
            : (complaint.aiConfidence || 0),
          avgResolution: current.avgResolution,
          sentiment: current.sentiment
        };
      }

      // Process departments with resolution metrics
      if (complaint.department) {
        const dept = complaint.department;
        const current = aiAnalysisStats.departments[dept] || { 
          count: 0, 
          totalResolutionTime: 0,
          avgResolution: 0,
          avgConfidence: 0,
          satisfaction: 0
        };
        
        const resolutionTime = complaint.resolutionTime || 0;
        const newCount = current.count + 1;
        const newTotalResolutionTime = current.totalResolutionTime + resolutionTime;
        const newAvgResolution = newCount > 0 ? newTotalResolutionTime / newCount : 0;
        const newAvgConfidence = current.count > 0 ? (current.avgConfidence * current.count + (complaint.aiConfidence || 0)) / newCount : 0;
        const newSatisfaction = current.count > 0 ? (current.satisfaction * current.count + (complaint.satisfaction || 0)) / newCount : 0;
        
        aiAnalysisStats.departments[dept] = {
          count: newCount,
          totalResolutionTime: newTotalResolutionTime,
          avgResolution: newAvgResolution,
          avgConfidence: newAvgConfidence,
          satisfaction: newSatisfaction
        };

        if (complaint.status === 'Resolved' && resolutionTime > 0) {
          totalResolutionTime += resolutionTime;
          resolvedCount++;
        }
      }

      // Count priorities
      if (complaint.priority) {
        aiAnalysisStats.priorities[complaint.priority] = (aiAnalysisStats.priorities[complaint.priority] || 0) + 1;
      }

      // Process sentiment
      const sentiment = complaint.sentiment || 'neutral';
      if (sentiment === 'positive') aiAnalysisStats.sentiment.positive++;
      else if (sentiment === 'negative') aiAnalysisStats.sentiment.negative++;
      else aiAnalysisStats.sentiment.neutral++;

      // Calculate average sentiment score (example: -1 to 1 scale)
      const sentimentScore = sentiment === 'positive' ? 1 : sentiment === 'negative' ? -1 : 0;
      totalSentiment += sentimentScore;

      // Track response times
      if (complaint.firstResponseTime) {
        totalResponseTime += complaint.firstResponseTime;
        responseCount++;
      }
    }
  });

  // Calculate averages
  aiAnalysisStats.sentiment.avgSentiment = complaints.length > 0
    ? (totalSentiment / complaints.length + 1) * 50 // Convert to 0-100 scale
    : 50;

  aiAnalysisStats.resolutionMetrics.avgResolutionTime = resolvedCount > 0
    ? totalResolutionTime / resolvedCount
    : 0;

  aiAnalysisStats.resolutionMetrics.firstResponseTime = responseCount > 0
    ? totalResponseTime / responseCount
    : 0;

  aiAnalysisStats.resolutionMetrics.resolutionRate = complaints.length > 0
    ? (complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100
    : 0;

  // Convert category/department/priority counts to array for charts with enhanced data
  const categoryData = Object.entries(aiAnalysisStats.categories).length > 0
    ? Object.entries(aiAnalysisStats.categories)
      .map(([name, data]) => ({
        name,
        value: data.count,
        avgConfidence: data.avgConfidence,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 categories
    : [
      { name: "No categories yet", value: 1, color: "#8884d8", avgConfidence: 0 }
    ];

  const departmentData = Object.entries(aiAnalysisStats.departments).length > 0
    ? Object.entries(aiAnalysisStats.departments)
      .map(([name, data]) => ({
        name,
        value: data.count,
        avgResolution: data.count > 0 ? data.totalResolutionTime / data.count : 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 departments
    : [
      { name: "No departments yet", value: 1, color: "#82ca9d", avgResolution: 0 }
    ];

  const priorityData = Object.entries(aiAnalysisStats.priorities).length > 0
    ? Object.entries(aiAnalysisStats.priorities).map(([name, value]) => ({
      name,
      value,
      color: name === 'High' ? '#ef4444' :
        name === 'Medium' ? '#f59e0b' :
          name === 'Low' ? '#10b981' : '#6b7280'
    }))
    : [
      { name: "No priorities yet", value: 1, color: "#6b7280" }
    ];

  // Calculate average confidence if available
  const totalConfidence = complaints.reduce((sum, complaint) =>
    sum + (complaint.aiConfidence || 0), 0);
  aiAnalysisStats.averageConfidence = aiAnalysisStats.totalAnalyzed > 0
    ? Math.round((totalConfidence / aiAnalysisStats.totalAnalyzed) * 10) / 10
    : 0;

  // Enhanced AI model performance metrics with more detailed data
  const aiModelMetrics = {
    // Core metrics
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.91,
    f1Score: 0.90,

    // Model info
    version: '2.4.1',
    modelName: 'complaint-analyzer-bert',
    lastTrained: '2024-09-20',
    trainingDataSize: 18750,

    // Performance breakdown
    falsePositives: 5,
    falseNegatives: 3,
    truePositives: 1242,
    trueNegatives: 1345,

    // Category-wise accuracy
    categoryAccuracy: {
      'Infrastructure': 0.94,
      'Academic': 0.89,
      'Facilities': 0.91,
      'Administrative': 0.87,
      'Security': 0.93
    },

    // Training metrics
    trainingHistory: [
      { epoch: 1, loss: 1.24, val_loss: 1.18, accuracy: 0.72 },
      { epoch: 2, loss: 0.98, val_loss: 0.89, accuracy: 0.79 },
      { epoch: 3, loss: 0.75, val_loss: 0.67, accuracy: 0.85 },
      { epoch: 4, loss: 0.58, val_loss: 0.52, accuracy: 0.89 },
      { epoch: 5, loss: 0.45, val_loss: 0.42, accuracy: 0.92 }
    ],

    // Feature importance
    featureImportance: [
      { feature: 'Complaint Text', importance: 0.85 },
      { feature: 'Category', importance: 0.78 },
      { feature: 'Department', importance: 0.72 },
      { feature: 'Time of Day', importance: 0.65 },
      { feature: 'User Type', importance: 0.58 }
    ]
  };

  // Generate complaints over time data with AI predictions
  const complaintsOverTime = [
    {
      month: "Feb",
      complaints: 28,
      resolved: 25,
      predicted: 27,
      aiConfidence: 92
    },
    {
      month: "Mar",
      complaints: 35,
      resolved: 31,
      predicted: 32,
      aiConfidence: 89
    },
    {
      month: "Apr",
      complaints: 42,
      resolved: 38,
      predicted: 40,
      aiConfidence: 94
    },
    {
      month: "May",
      complaints: 31,
      resolved: 29,
      predicted: 30,
      aiConfidence: 87
    },
    {
      month: "Jun",
      complaints: 45,
      resolved: 40,
      predicted: 43,
      aiConfidence: 91
    },
    {
      month: "Jul",
      complaints: 38,
      resolved: 35,
      predicted: 36,
      aiConfidence: 88
    },
    {
      month: "Aug",
      complaints: 0, // Future month
      resolved: 0,
      predicted: 41,
      aiConfidence: 85,
      isPrediction: true
    },
    {
      month: "Sep",
      complaints: 0, // Future month
      resolved: 0,
      predicted: 47,
      aiConfidence: 82,
      isPrediction: true
    }
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
      insight: "Infrastructure complaints spike by 42% during exam periods due to higher usage and stress levels",
      confidence: 94,
      impact: "High",
      trend: "increasing",
      actionable: true,
      recommendation: "Schedule preventive maintenance before exam periods and increase staff during peak times"
    },
    {
      title: "Fee Payment Patterns",
      insight: "Financial complaints increase by 65% in the 2 weeks before semester fee deadlines",
      confidence: 97,
      impact: "Medium",
      trend: "stable",
      actionable: true,
      recommendation: "Send payment reminders earlier and provide clear fee breakdowns to students"
    },
    {
      title: "Seasonal Infrastructure Issues",
      insight: "Electrical problems (fans, lights) increase by 40% during summer months (March-June)",
      confidence: 92,
      impact: "High",
      trend: "seasonal",
      actionable: true,
      recommendation: "Implement pre-summer electrical system checks and stock critical spare parts"
    },
    {
      title: "Mobile Submission Trend",
      insight: "Students are 2.7x more likely to submit complaints via mobile devices, with 89% higher response rate to mobile notifications",
      confidence: 91,
      impact: "Medium",
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">AI-Powered Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Showing data for {domain.name}
        </p>
      </div>

      {/* Enhanced AI Analysis Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                <Brain className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-300">v0.01</span>
              </div>
            </div>
            <div className="absolute right-4 top-4">
              <div className={`h-2 w-2 rounded-full ${aiAnalysisStats.averageConfidence > 90 ? 'bg-green-500' :
                  aiAnalysisStats.averageConfidence > 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{aiAnalysisStats.totalAnalyzed}</div>
                <p className="text-xs text-muted-foreground">
                  of {aiAnalysisStats.totalComplaints} total complaints
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {aiAnalysisStats.averageConfidence}%
                </div>
                <p className="text-xs text-muted-foreground">Avg. confidence</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="space-y-1 p-1.5 bg-muted/30 rounded">
                  <div className="font-medium text-blue-600">
                    {Math.round(aiModelMetrics.accuracy * 100)}%
                  </div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
                <div className="space-y-1 p-1.5 bg-muted/30 rounded">
                  <div className="font-medium text-blue-600">
                    {Math.round(aiModelMetrics.precision * 100)}%
                  </div>
                  <div className="text-muted-foreground">Precision</div>
                </div>
                <div className="space-y-1 p-1.5 bg-muted/30 rounded">
                  <div className="font-medium text-blue-600">
                    {Math.round(aiModelMetrics.recall * 100)}%
                  </div>
                  <div className="text-muted-foreground">Recall</div>
                </div>
              </div>
              <div className="pt-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Model Confidence</span>
                  <span>{aiAnalysisStats.averageConfidence}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full w-full flex-1 transition-all ${aiAnalysisStats.averageConfidence > 90 ? 'bg-green-500' :
                        aiAnalysisStats.averageConfidence > 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    style={{
                      transform: `translateX(-${100 - (aiAnalysisStats.averageConfidence || 0)}%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
              <div className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">AI Classified</span>
                <List className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(aiAnalysisStats.categories)
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 3)
                .map(([category, data]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[120px]">{category}</span>
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {Math.round((data.avgConfidence || 0) * 10) / 10}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${Math.min(100, (data.count / Math.max(1, complaints.length)) * 200)}%` }}
                      />
                    </div>
                  </div>
                ))}
              {Object.keys(aiAnalysisStats.categories).length === 0 && (
                <div className="text-sm text-muted-foreground py-2 text-center">
                  No categories identified yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Department Performance</CardTitle>
              <div className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">Resolution Time</span>
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(aiAnalysisStats.departments)
                .sort(([, a], [, b]) => a.avgResolution - b.avgResolution)
                .slice(0, 3)
                .map(([dept, data]) => {
                  const avgHours = Math.round(data.avgResolution * 24 * 10) / 10;
                  const isGood = avgHours <= 24;
                  const isWarning = avgHours > 24 && avgHours <= 72;

                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate max-w-[100px]">{dept}</span>
                        <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${isGood ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            isWarning ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                          {avgHours}h
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isGood ? 'bg-green-500' :
                              isWarning ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${Math.min(100, 100 - (avgHours / 168) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(aiAnalysisStats.departments).length === 0 && (
                <div className="text-sm text-muted-foreground py-2 text-center">
                  No department data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
              <div className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">AI Assessed</span>
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {([
                { displayName: 'Critical', key: 'critical' },
                { displayName: 'High', key: 'high' },
                { displayName: 'Medium', key: 'medium' },
                { displayName: 'Low', key: 'low' }
              ] as const).map(({ displayName, key }) => {
                const count = aiAnalysisStats.priorities[key] || 0;
                const percentage = complaints.length > 0
                  ? Math.round((count / complaints.length) * 100)
                  : 0;

                const priorityColors = {
                  critical: {
                    bg: 'bg-red-500/10',
                    text: 'text-red-700 dark:text-red-300',
                    border: 'border-red-500',
                    icon: '🔥',
                    display: 'Critical'
                  },
                  high: {
                    bg: 'bg-orange-500/10',
                    text: 'text-orange-700 dark:text-orange-300',
                    border: 'border-orange-500',
                    icon: '⚠️',
                    display: 'High'
                  },
                  medium: {
                    bg: 'bg-yellow-500/10',
                    text: 'text-yellow-700 dark:text-yellow-300',
                    border: 'border-yellow-500',
                    icon: 'ℹ️',
                    display: 'Medium'
                  },
                  low: {
                    bg: 'bg-green-500/10',
                    text: 'text-green-700 dark:text-green-300',
                    border: 'border-green-500',
                    icon: '✓',
                    display: 'Low'
                  }
                };

                const colors = priorityColors[key] || {
                  bg: 'bg-gray-500/10',
                  text: 'text-gray-700 dark:text-gray-300',
                  border: 'border-gray-500',
                  icon: '?',
                  display: displayName
                };

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{colors.icon}</span>
                        <span className="font-medium">{displayName}</span>
                      </div>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.border.replace('border-', 'bg-')}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(aiAnalysisStats.priorities).length === 0 && (
                <div className="text-sm text-muted-foreground py-2 text-center">
                  No priority data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => onSelectComplaint("C-12345")} className="w-full sm:w-auto">
        View Sample Complaint Analysis
      </Button>

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
                  label={({ name, percent = 0 }) => `${name.split('/')[0]} ${(percent * 100).toFixed(0)}%`}
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
                      className={`h-2 rounded-full ${item.avgTime <= item.target ? "bg-green-500" : "bg-red-500"
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
export function ComplaintAnalytics({ complaints = [] }: { complaints: any[] }) {
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle complaint selection
  const handleSelectComplaint = (complaintId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedComplaintId(complaintId);
    } catch (err) {
      console.error('Error selecting complaint:', err);
      setError('Failed to load complaint details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation from complaint view
  const handleBack = () => {
    setSelectedComplaintId(null);
    setError(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">
          <AlertTriangle className="h-8 w-8 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    );
  }

  // Show complaint analysis view if a complaint is selected
  if (selectedComplaintId) {
    return (
      <ComplaintAnalysisView
        complaintId={selectedComplaintId}
        onBack={handleBack}
      />
    );
  }

  // Show empty state if no complaints
  if (!complaints || complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
        <div className="mb-4 p-3 rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No complaints yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Submit a complaint to see analytics and insights
        </p>
      </div>
    );
  }

  // Show analytics dashboard
  return (
    <AnalyticsDashboard
      complaints={complaints}
      onSelectComplaint={handleSelectComplaint}
    />
  );
}
