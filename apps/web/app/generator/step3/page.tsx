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
}

export default function DocumentGeneratorStep3() {
  const router = useRouter();
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Validate case type against constants
  const validateCaseType = (caseType: string): boolean => {
    return Object.values(CASE_TYPES).some(type => type.key === caseType);
  };

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
      
      setGeneratorData(data);
    } else {
      // Redirect to step 1 if no data found
      router.push('/generator/step1');
    }
  }, [router]);

  const handleGenerateDocument = () => {
    if (!isConfirmed) {
      alert("Please confirm that all information is correct");
      return;
    }

    // Update localStorage with confirmation
    const updatedData = {
      ...generatorData,
      step: 3,
      confirmed: true
    };
    localStorage.setItem('generatorData', JSON.stringify(updatedData));
    
    // Navigate to step 4 (generation)
    router.push('/generator/step4');
  };

  const handleBack = () => {
    router.push('/generator/step2');
  };

  const handleEdit = (step: number) => {
    router.push(`/generator/step${step}`);
  };

  // Render document-specific details
  const renderDocumentSpecificReview = () => {
    if (!generatorData?.documentSpecific) return null;

    const specific = generatorData.documentSpecific;
    const caseType = generatorData.caseType;

    switch (caseType) {
      case CASE_TYPES.POWER_OF_ATTORNEY.key:
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-200">Power of Attorney Details:</h4>
            {specific.attorneyName && (
              <div className="flex justify-between">
                <span className="text-blue-300">Attorney-in-Fact:</span>
                <span>{specific.attorneyName}</span>
              </div>
            )}
            {specific.powerType && (
              <div className="flex justify-between">
                <span className="text-blue-300">Type:</span>
                <span className="capitalize">{specific.powerType}</span>
              </div>
            )}
            {specific.specificPowers && (
              <div>
                <span className="text-blue-300">Specific Powers:</span>
                <p className="mt-1 text-sm">{specific.specificPowers}</p>
              </div>
            )}
          </div>
        );

      case CASE_TYPES.WILLS_TRUSTS.key:
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-200">Will & Trust Details:</h4>
            {specific.executorName && (
              <div className="flex justify-between">
                <span className="text-blue-300">Executor:</span>
                <span>{specific.executorName}</span>
              </div>
            )}
            {specific.beneficiaries && (
              <div>
                <span className="text-blue-300">Beneficiaries:</span>
                <p className="mt-1 text-sm">{specific.beneficiaries}</p>
              </div>
            )}
            {specific.guardian && (
              <div className="flex justify-between">
                <span className="text-blue-300">Guardian:</span>
                <span>{specific.guardian}</span>
              </div>
            )}
          </div>
        );

      case CASE_TYPES.REAL_ESTATE_DEED.key:
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-200">Property Transfer Details:</h4>
            {specific.propertyAddress && (
              <div>
                <span className="text-blue-300">Property Address:</span>
                <p className="mt-1 text-sm">{specific.propertyAddress}</p>
              </div>
            )}
            {specific.transfereeName && (
              <div className="flex justify-between">
                <span className="text-blue-300">Transferee:</span>
                <span>{specific.transfereeName}</span>
              </div>
            )}
            {specific.consideration && (
              <div className="flex justify-between">
                <span className="text-blue-300">Consideration:</span>
                <span>{specific.consideration}</span>
              </div>
            )}
          </div>
        );

      case CASE_TYPES.DIVORCE.key:
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-200">Divorce Details:</h4>
            {specific.spouseName && (
              <div className="flex justify-between">
                <span className="text-blue-300">Spouse Name:</span>
                <span>{specific.spouseName}</span>
              </div>
            )}
            {specific.marriageDate && (
              <div className="flex justify-between">
                <span className="text-blue-300">Marriage Date:</span>
                <span>{new Date(specific.marriageDate).toLocaleDateString()}</span>
              </div>
            )}
            {specific.children && (
              <div>
                <span className="text-blue-300">Children:</span>
                <p className="mt-1 text-sm">{specific.children}</p>
              </div>
            )}
          </div>
        );

      default:
        if (specific.additionalInfo) {
          return (
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-200">Additional Information:</h4>
              <p className="text-sm">{specific.additionalInfo}</p>
            </div>
          );
        }
        return null;
    }
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
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
            <span className="font-medium">Step 3 of 5</span>
            <span className="hidden sm:inline">Review & Confirm</span>
            <span className="sm:hidden text-xs">Review</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-3/5 transition-all duration-300"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                <span className="text-white font-bold text-base sm:text-lg">3</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Review & Confirm</h1>
                <p className="text-blue-200 mt-1 sm:mt-2 text-sm sm:text-base">
                  Please review all information before generating your document
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Document Type & State */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Document Information</h3>
                <button
                  onClick={() => handleEdit(1)}
                  className="text-blue-300 hover:text-white text-sm flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span className="text-blue-300">Document Type:</span>
                  <span className="font-medium">{generatorData.caseTypeDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">State:</span>
                  <span className="font-medium">{generatorData.stateDisplay}</span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                <button
                  onClick={() => handleEdit(2)}
                  className="text-blue-300 hover:text-white text-sm flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span className="text-blue-300">Full Name:</span>
                  <span className="font-medium">{generatorData.personalDetails.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Email:</span>
                  <span className="font-medium">{generatorData.personalDetails.email}</span>
                </div>
                {generatorData.personalDetails.phone && (
                  <div className="flex justify-between">
                    <span className="text-blue-300">Phone:</span>
                    <span className="font-medium">{generatorData.personalDetails.phone}</span>
                  </div>
                )}
                {generatorData.personalDetails.address && (
                  <div className="flex justify-between">
                    <span className="text-blue-300">Address:</span>
                    <span className="font-medium">
                      {generatorData.personalDetails.address}
                      {generatorData.personalDetails.city && `, ${generatorData.personalDetails.city}`}
                      {generatorData.personalDetails.zipCode && ` ${generatorData.personalDetails.zipCode}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Document-Specific Information */}
            {Object.keys(generatorData.documentSpecific || {}).length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Document-Specific Details</h3>
                  <button
                    onClick={() => handleEdit(2)}
                    className="text-blue-300 hover:text-white text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="text-white">
                  {renderDocumentSpecificReview()}
                </div>
              </div>
            )}

            {/* Confirmation */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="confirmation"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-green-600 bg-white/20 border-white/30 rounded focus:ring-green-500"
                />
                <label htmlFor="confirmation" className="ml-3 text-white">
                  <span className="font-medium">I confirm that all information above is correct</span>
                  <p className="text-blue-200 text-sm mt-1">
                    By checking this box, I acknowledge that I have reviewed all the information and it is accurate. 
                    This information will be used to generate my legal document.
                  </p>
                </label>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-yellow-100 font-semibold mb-2">Important Legal Notice</h3>
                  <p className="text-yellow-100 text-sm">
                    This document is generated for informational purposes. While we strive for accuracy, 
                    this does not constitute legal advice. For complex legal matters, please consult with 
                    a qualified attorney in your jurisdiction.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-6">
              <button
                onClick={handleBack}
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>

              <button
                onClick={handleGenerateDocument}
                disabled={!isConfirmed}
                className="flex items-center justify-center px-6 sm:px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base order-1 sm:order-2"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Generate Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
