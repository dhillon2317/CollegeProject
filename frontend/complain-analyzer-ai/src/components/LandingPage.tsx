import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate(); 

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Complain Analyzer AI</h1>
                <p className="text-gray-600 mb-8">Efficiently manage and analyze complaints with our AI-powered platform</p>
                
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
                    </div>
    );
}