export interface DomainConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

export const DOMAINS: DomainConfig[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Patient complaints and healthcare service feedback',
    icon: '🏥',
    theme: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-blue-100 text-blue-800'
    }
  },
  {
    id: 'business',
    name: 'Business/Corporate Office',
    description: 'Corporate complaints and office management',
    icon: '🏢',
    theme: {
      primary: 'bg-green-600 hover:bg-green-700',
      secondary: 'bg-green-100 text-green-800'
    }
  },
  {
    id: 'education',
    name: 'Education',
    description: 'School and university related complaints',
    icon: '🎓',
    theme: {
      primary: 'bg-purple-600 hover:bg-purple-700',
      secondary: 'bg-purple-100 text-purple-800'
    }
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Customer service and product complaints',
    icon: '🛍️',
    theme: {
      primary: 'bg-yellow-600 hover:bg-yellow-700',
      secondary: 'bg-yellow-100 text-yellow-800'
    }
  }
];

export const getDomainById = (id: string): DomainConfig | undefined => {
  return DOMAINS.find(domain => domain.id === id);
};

export const getCurrentDomain = (): DomainConfig | null => {
  if (typeof window === 'undefined') return null;
  const savedDomainId = localStorage.getItem('selectedDomain');
  return savedDomainId ? getDomainById(savedDomainId) || null : null;
};
