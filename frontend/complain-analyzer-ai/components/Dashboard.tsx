import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { AlertTriangle, Clock, CheckCircle, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { getCurrentDomain } from "./DomainConfig";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "../styles/scrollbar.module.css";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  department: string;
  contactInfo: string;
  userType: string;
  type: string;
  status: string;
  createdAt: string;
  aiAnalyzed?: boolean;
}

interface ComplaintStats {
  total: number;
  pending: number;
  resolved: number;
  critical: number;
}

export function Dashboard() {
  const domain = getCurrentDomain();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/complaints');
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      console.log('Fetched complaints:', data); // Debug log
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchComplaints();
  };

  // Calculate statistics from real data
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    critical: complaints.filter(c => c.priority === 'High').length,
  };

  // Get recent complaints (last 5)
  const recentComplaints = complaints
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Under Review": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{domain.icon}</div>
            <div>
              <h3 className="font-semibold">{domain.name}</h3>
              <p className="text-sm text-muted-foreground">{domain.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.resolved / stats.total) * 100)}%
            </div>
            <Progress value={(stats.resolved / stats.total) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent College Complaints & AI Analysis</CardTitle>
            <CardDescription>
              Latest complaints with AI-powered categorization and priority assessment
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className={`space-y-4 max-h-[70vh] overflow-y-auto pr-2 ${styles.customScrollbar}`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="group flex flex-col p-5 border rounded-xl space-y-3 hover:shadow-md transition-all duration-200 bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {complaint.title || 'No Title'}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getSeverityColor(complaint.priority)} className="text-xs">
                            {complaint.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {complaint.type || 'General'}
                          </Badge>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </div>
                        </div>
                      </div>
                      
                      {complaint.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {complaint.description}
                        </p>
                      )}
                    </div>
                    
                    {complaint.aiAnalyzed && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                        AI Analyzed
                      </Badge>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-border/50 mt-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-muted-foreground">Category:</span>
                        <span className="font-medium">{complaint.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-muted-foreground">Department:</span>
                        <span className="font-medium">{complaint.department}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-muted-foreground">Submitted:</span>
                        <span className="font-medium">
                          {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No complaints found. Submit a new complaint to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions for College */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">🔧</span>
              </div>
              <div>
                <h4 className="font-medium">Infrastructure Issues</h4>
                <p className="text-sm text-muted-foreground">Report facility problems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">💰</span>
              </div>
              <div>
                <h4 className="font-medium">Fee & Financial</h4>
                <p className="text-sm text-muted-foreground">Payment and scholarship issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🚗</span>
              </div>
              <div>
                <h4 className="font-medium">Parking & Transport</h4>
                <p className="text-sm text-muted-foreground">Campus accessibility issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}