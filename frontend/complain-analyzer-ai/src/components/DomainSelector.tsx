import React from 'react';
import { DOMAINS } from '../config/domains';

interface DomainSelectorProps {
  onDomainSelected: (domain: any) => void;
}

const DomainSelector: React.FC<DomainSelectorProps> = ({ onDomainSelected }) => {
  const handleSelectDomain = (domain: any) => {
    localStorage.setItem('selectedDomain', domain.id);
    onDomainSelected(domain);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Complaint Analyzer</h1>
          <p className="text-gray-600">Please select a domain to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOMAINS.map((domain) => (
            <div 
              key={domain.id}
              onClick={() => handleSelectDomain(domain)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-primary-500"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{domain.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-800">{domain.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{domain.description}</p>
                <div className="flex justify-end">
                  <button 
                    className={`px-4 py-2 rounded-md text-white font-medium ${domain.theme.primary} transition-colors`}
                  >
                    Select Domain
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>Your selection will help us provide you with the best experience.</p>
          <p className="mt-1">You can change this later in the settings.</p>
        </div>
      </div>
    </div>
  );
};

export default DomainSelector;
