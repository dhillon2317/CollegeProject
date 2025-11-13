export interface DomainConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
  departments: string[];
  urgencyLevels: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  sampleComplaints: Array<{
    title: string;
    category: string;
    department: string;
    severity: string;
    description: string;
  }>;
  insights: Array<{
    title: string;
    description: string;
    confidence: number;
  }>;
}

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  college: {
    id: "college",
    name: "Educational Institution",
    description: "Complaint management for colleges, universities, and educational institutes",
    icon: "🎓",
    categories: [
      "Academic Issues",
      "Infrastructure/Facilities",
      "Fee & Financial Issues",
      "Parking & Transportation",
      "Hostel/Accommodation",
      "Food Services/Canteen",
      "IT & Technical Support",
      "Library Services",
      "Administrative Services",
      "Student Services",
      "Security & Safety",
      "Other"
    ],
    departments: [
      "Academic Affairs",
      "Student Affairs",
      "Finance Office",
      "Maintenance & Facilities",
      "IT Department",
      "Library",
      "Security",
      "Hostel Administration",
      "Food Services",
      "Transport Office",
      "Administration",
      "General"
    ],
    urgencyLevels: [
      { 
        value: "low", 
        label: "Low Priority", 
        description: "General issues that can be addressed in regular timeline" 
      },
      { 
        value: "medium", 
        label: "Medium Priority", 
        description: "Issues affecting daily activities, needs attention within a week" 
      },
      { 
        value: "high", 
        label: "High Priority", 
        description: "Issues affecting academic work or student welfare, needs prompt attention" 
      },
      { 
        value: "critical", 
        label: "Critical", 
        description: "Safety concerns or issues severely disrupting academic activities" 
      }
    ],
    sampleComplaints: [
      {
        title: "Ceiling fan not working in Lecture Hall 3",
        category: "Infrastructure/Facilities",
        department: "Maintenance & Facilities",
        severity: "Medium",
        description: "The ceiling fan in LH-3 has been non-functional for the past 3 days. With the summer heat, it's becoming difficult for students to concentrate during lectures."
      },
      {
        title: "Delay in scholarship disbursement",
        category: "Fee & Financial Issues", 
        department: "Finance Office",
        severity: "High",
        description: "My scholarship amount was supposed to be credited last month but hasn't been processed yet. This is affecting my ability to pay hostel fees."
      },
      {
        title: "Insufficient parking space for students",
        category: "Parking & Transportation",
        department: "Transport Office",
        severity: "Medium",
        description: "The student parking area is always full by 9 AM, forcing students to park outside campus which is unsafe and causes delays."
      },
      {
        title: "WiFi connectivity issues in Computer Lab",
        category: "IT & Technical Support",
        department: "IT Department", 
        severity: "High",
        description: "Students are unable to access online resources during practical sessions due to frequent WiFi disconnections in the computer lab."
      },
      {
        title: "Poor food quality in main canteen",
        category: "Food Services/Canteen",
        department: "Food Services",
        severity: "Medium",
        description: "The food served in the main canteen has been of poor quality lately. Several students have complained of stomach issues."
      }
    ],
    insights: [
      {
        title: "Infrastructure Maintenance",
        description: "Electrical and maintenance issues peak during exam periods",
        confidence: 89
      },
      {
        title: "Fee Payment Patterns", 
        description: "Financial complaints increase 2 weeks before semester deadlines",
        confidence: 94
      },
      {
        title: "Peak Complaint Hours",
        description: "Most complaints submitted between 2-4 PM after lunch break",
        confidence: 76
      },
      {
        title: "Seasonal Trends",
        description: "Parking complaints increase during exam months due to higher attendance",
        confidence: 82
      }
    ]
  },
  hospital: {
    id: "hospital",
    name: "Healthcare Institution", 
    description: "Complaint management for hospitals and medical facilities",
    icon: "🏥",
    categories: [
      "Medical Equipment",
      "Staff Behavior",
      "Patient Care Quality",
      "Billing & Insurance",
      "Facility Cleanliness",
      "Wait Times",
      "Food Services",
      "Security",
      "Administrative",
      "Other"
    ],
    departments: [
      "Medical Equipment Services",
      "Patient Care",
      "Administration",
      "Billing",
      "Housekeeping",
      "Security",
      "Food Services",
      "Human Resources",
      "IT Support",
      "General"
    ],
    urgencyLevels: [
      { 
        value: "low", 
        label: "Low Priority", 
        description: "General issues that don't affect patient care" 
      },
      { 
        value: "medium", 
        label: "Medium Priority", 
        description: "Issues affecting patient experience or staff efficiency" 
      },
      { 
        value: "high", 
        label: "High Priority", 
        description: "Issues that could impact patient care quality" 
      },
      { 
        value: "critical", 
        label: "Critical", 
        description: "Patient safety concerns requiring immediate attention" 
      }
    ],
    sampleComplaints: [],
    insights: []
  },
  business: {
    id: "business",
    name: "Business/Corporate Office",
    description: "Complaint management for offices and business organizations", 
    icon: "🏢",
    categories: [
      "Technical/IT Issues",
      "Human Resources",
      "Facility Management", 
      "Administrative",
      "Customer Service",
      "Finance/Payroll",
      "Security",
      "Health & Safety",
      "Other"
    ],
    departments: [
      "IT Support",
      "Human Resources",
      "Administration", 
      "Facilities",
      "Finance",
      "Security",
      "Management",
      "Customer Service",
      "General"
    ],
    urgencyLevels: [
      { 
        value: "low", 
        label: "Low Priority", 
        description: "Minor issues that can be addressed in regular workflow" 
      },
      { 
        value: "medium", 
        label: "Medium Priority", 
        description: "Issues affecting productivity or employee satisfaction" 
      },
      { 
        value: "high", 
        label: "High Priority", 
        description: "Issues affecting business operations or client satisfaction" 
      },
      { 
        value: "critical", 
        label: "Critical", 
        description: "Business-critical issues requiring immediate resolution" 
      }
    ],
    sampleComplaints: [],
    insights: []
  }
};

export const getCurrentDomain = (): DomainConfig => {
  // For now, default to college. Later this could come from localStorage or URL params
  const domainId = localStorage.getItem('selectedDomain') || 'college';
  return DOMAIN_CONFIGS[domainId] || DOMAIN_CONFIGS.college;
};

export const setCurrentDomain = (domainId: string): void => {
  localStorage.setItem('selectedDomain', domainId);
};