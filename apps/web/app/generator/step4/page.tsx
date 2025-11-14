"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CASE_TYPES,
  getCaseTypeByKey,
  type CaseTypeKey 
} from "../../../lib/constants";

interface GeneratorData {
  caseType: string;
  caseTypeDisplay: string;
  state: string;
  stateDisplay: string;
  step: number;
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  documentSpecific: {
    [key: string]: any;
  };
  confirmed?: boolean;
}

export default function DocumentGeneratorStep4() {
  const router = useRouter();
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);

  // Validate case type against constants
  const validateCaseType = (caseType: string): boolean => {
    return Object.values(CASE_TYPES).some(type => type.key === caseType);
  };
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { title: "Validating Information", description: "Checking all provided details..." },
    { title: "Preparing Your Order", description: "Setting up your document request..." },
    { title: "Legal Review Setup", description: "Preparing for professional review..." },
    { title: "State Compliance Check", description: "Ensuring compliance with state laws..." },
    { title: "Order Preparation Complete", description: "Ready for payment and processing..." }
  ];

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('generatorData');
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // Validate case type
      if (!validateCaseType(data.caseType)) {
        console.warn(`Invalid case type: ${data.caseType}. Redirecting to step 1.`);
        router.push('/generator/step1');
        return;
      }
      
      if (!data.confirmed) {
        // Redirect to step 3 if not confirmed
        router.push('/generator/step3');
        return;
      }
      setGeneratorData(data);
      
      // Start the generation process
      simulateGeneration();
    } else {
      // Redirect to step 1 if no data found
      router.push('/generator/step1');
    }
  }, [router]);

  const simulateGeneration = async () => {
    try {
      // Simulate the document generation process
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        setCurrentStep(i + 1);
      }
      
      // Additional delay before completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsComplete(true);
      
      // Update localStorage with completion status
      const savedData = localStorage.getItem('generatorData');
      if (savedData) {
        const data = JSON.parse(savedData);
        const updatedData = {
          ...data,
          step: 4,
          generated: true,
          generatedAt: new Date().toISOString()
        };
        localStorage.setItem('generatorData', JSON.stringify(updatedData));
      }
      
      // Auto-redirect to step 5 after a short delay
      setTimeout(() => {
        router.push('/generator/step5');
      }, 2000);
      
    } catch (err) {
      setError("An error occurred during order preparation. Please try again.");
    }
  };

  const handleTryAgain = () => {
    setError(null);
    setCurrentStep(0);
    setIsComplete(false);
    simulateGeneration();
  };

  if (!generatorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
            <span className="font-medium">Step 4 of 5</span>
            <span className="hidden sm:inline">Generating Document</span>
            <span className="sm:hidden text-xs">Generating</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-4/5 transition-all duration-300"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                {isComplete ? (
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : error ? (
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-white font-bold text-lg">4</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {isComplete ? "Document Generated!" : error ? "Generation Error" : "Generating Document"}
                </h1>
                <p className="text-blue-200 mt-1 sm:mt-2 text-sm sm:text-base">
                  {isComplete 
                    ? "Your legal document has been successfully created"
                    : error 
                    ? "Something went wrong during generation"
                    : `Creating your ${generatorData.caseTypeDisplay} for ${generatorData.stateDisplay}`
                  }
                </p>
              </div>
            </div>
          </div>

          {error ? (
            /* Error State */
            <div className="text-center space-y-6">
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-red-100 font-semibold text-lg mb-2">Generation Failed</h3>
                <p className="text-red-200 text-sm mb-4">{error}</p>
                <button
                  onClick={handleTryAgain}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : isComplete ? (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="h-16 w-16 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-green-100 font-semibold text-xl mb-2">Success!</h3>
                <p className="text-green-200 mb-4">
                  Your {generatorData.caseTypeDisplay} has been generated successfully and is ready for download.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-green-300">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    State Compliant
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professionally Formatted
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready to Use
                  </div>
                </div>
              </div>
              <p className="text-blue-200 text-sm">
                Redirecting to download page in 2 seconds...
              </p>
            </div>
          ) : (
            /* Progress State */
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = index === currentStep - 1;
                  const isCompleted = index < currentStep;
                  const isPending = index >= currentStep;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : isActive 
                          ? 'bg-blue-500 border-blue-500 animate-pulse' 
                          : 'bg-white/20 border-white/30'
                      }`}>
                        {isCompleted ? (
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : isActive ? (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        ) : (
                          <span className="text-white/60 text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium transition-all duration-300 ${
                          isCompleted 
                            ? 'text-green-300' 
                            : isActive 
                            ? 'text-white' 
                            : 'text-white/60'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm transition-all duration-300 ${
                          isActive ? 'text-blue-200' : 'text-white/40'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall Progress Bar */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Overall Progress</span>
                  <span className="text-blue-200">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="text-center">
                <p className="text-blue-200 text-sm">
                  Estimated time remaining: {Math.max(0, steps.length - currentStep)} - {Math.max(0, (steps.length - currentStep) * 2)} seconds
                </p>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-blue-300 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-white font-semibold mb-2">What's happening:</h3>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• Applying your personal information to the legal template</li>
                  <li>• Ensuring compliance with {generatorData.state} state laws</li>
                  <li>• Formatting the document professionally</li>
                  <li>• Preparing your document for download</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
