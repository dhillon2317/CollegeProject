import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, Clock, Target, Users, Zap } from "lucide-react";
import { getCurrentDomain } from "./DomainConfig";
import { Loader2 } from "lucide-react";

interface Complaint {
  _id:string; category:string; priority:string; department:string; type:string; userType:string; createdAt:string;
}

export function Analytics() {
  const domain = getCurrentDomain();
  
  const [complaints,setComplaints]=useState<Complaint[]>([]);
  const [isLoading,setIsLoading]=useState(true);

  useEffect(()=>{
    fetch('http://localhost:5001/api/complaints')
      .then(r=>r.json())
      .then(data=>setComplaints(data))
      .catch(()=>{})
      .finally(()=>setIsLoading(false));
  },[]);

  // Derived analytics data
  const complaintsOverTime = [
    { month: "Feb", complaints: 28, resolved: 25 },
    { month: "Mar", complaints: 35, resolved: 31 },
    { month: "Apr", complaints: 42, resolved: 38 },
    { month: "May", complaints: 31, resolved: 29 },
    { month: "Jun", complaints: 45, resolved: 40 },
    { month: "Jul", complaints: 38, resolved: 35 },
  ];

  const categoryCount:Record<string,number>={};
complaints.forEach(c=>{categoryCount[c.category]=(categoryCount[c.category]||0)+1});
const categoryData = Object.entries(categoryCount).map(([name,value])=>({name,value,color:"#8884d8"}));
  const defaultCategoryData = [
    { name: "Fee & Financial Issues", value: 22, color: "#82ca9d" },
    { name: "IT & Technical Support", value: 18, color: "#ffc658" },
    { name: "Food Services/Canteen", value: 15, color: "#ff7300" },
    { name: "Parking & Transportation", value: 10, color: "#0088fe" },
    { name: "Other", value: 7, color: "#00C49F" },
  ];
  const pieChartData = categoryData.length ? categoryData : defaultCategoryData;


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

    // Calculate user type distribution
  const userTypeCount:Record<string,number>={};
  complaints.forEach(c=>{userTypeCount[c.userType]=(userTypeCount[c.userType]||0)+1});
  const totalComplaints=complaints.length||1;
  const userTypeData = Object.entries(userTypeCount).map(([type,complaints])=>({type,complaints,percentage:Math.round((complaints as number)/totalComplaints*100)}));

  // Calculate complaint type distribution
  const typeCount:Record<string,number>={};
  complaints.forEach(c=>{typeCount[c.type]=(typeCount[c.type]||0)+1});
  const typeData = Object.entries(typeCount).map(([name,value])=>({name,value,color:"#8884d8"}));
  const defaultTypeData = [
    { name: "Academic", value: 35, color: "#8884d8" },
    { name: "Infrastructure", value: 25, color: "#82ca9d" },
    { name: "Administrative", value: 20, color: "#ffc658" },
    { name: "Facilities", value: 15, color: "#ff7300" },
    { name: "Other", value: 5, color: "#0088fe" },
  ];
  const pieTypeData = typeData.length ? typeData : defaultTypeData;

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00C49F"];

  return (
    <div className="space-y-6">
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
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent = 0 }) => `${name.split('/')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Complaints by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Type</CardTitle>
            <CardDescription>Distribution of complaint types across the institution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieTypeData.map((entry, index) => (
                    <Cell key={`type-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
      </div>

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