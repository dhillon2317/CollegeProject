import React from 'react';
import ComplaintForm from '../components/ComplaintForm';

const ComplaintPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">File a New Complaint</h1>
        <ComplaintForm />
      </div>
    </div>
  );
};

export default ComplaintPage;
