"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  personalDetails?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  documentSpecific?: {
    [key: string]: any;
  };
}

export default function DocumentGeneratorStep2() {
  const router = useRouter();
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);

  // Validate case type against constants
  const validateCaseType = (caseType: string): boolean => {
    return Object.values(CASE_TYPES).some(type => type.key === caseType);
  };
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });
  const [documentSpecific, setDocumentSpecific] = useState<{[key: string]: any}>({});

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
      
      // Load existing personal details if available
      if (data.personalDetails) {
        setPersonalDetails(data.personalDetails);
      }
      if (data.documentSpecific) {
        setDocumentSpecific(data.documentSpecific);
      }
    } else {
      // Redirect to step 1 if no data found
      router.push('/generator/step1');
    }
  }, [router]);

  const handlePersonalDetailChange = (field: string, value: string) => {
    setPersonalDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentSpecificChange = (field: string, value: string) => {
    setDocumentSpecific(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    if (!personalDetails.fullName || !personalDetails.email) {
      alert("Please fill in all required personal details");
      return;
    }

    // Update localStorage with new data
    const updatedData = {
      ...generatorData,
      personalDetails,
      documentSpecific,
      step: 2
    };
    localStorage.setItem('generatorData', JSON.stringify(updatedData));
    
    // Navigate to step 3
    router.push('/generator/step3');
  };

  const handleBack = () => {
    // Save current data before going back
    const updatedData = {
      ...generatorData,
      personalDetails,
      documentSpecific
    };
    localStorage.setItem('generatorData', JSON.stringify(updatedData));
    router.push('/generator/step1');
  };

  // Render document-specific fields based on document type
  const renderDocumentSpecificFields = () => {
    if (!generatorData) return null;

    switch (generatorData.caseType) {
      case CASE_TYPES.POWER_OF_ATTORNEY.key:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Power of Attorney Details</h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Attorney-in-Fact Name *
              </label>
              <input
                type="text"
                value={documentSpecific.attorneyName || ""}
                onChange={(e) => handleDocumentSpecificChange("attorneyName", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Full name of person you're granting power to"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Type of Power of Attorney
              </label>
              <select
                value={documentSpecific.powerType || ""}
                onChange={(e) => handleDocumentSpecificChange("powerType", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="general">General Power of Attorney</option>
                <option value="limited">Limited Power of Attorney</option>
                <option value="durable">Durable Power of Attorney</option>
                <option value="medical">Medical Power of Attorney</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Specific Powers (Optional)
              </label>
              <textarea
                value={documentSpecific.specificPowers || ""}
                onChange={(e) => handleDocumentSpecificChange("specificPowers", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Describe specific powers you want to grant..."
                rows={4}
              />
            </div>
          </div>
        );

      case CASE_TYPES.WILLS_TRUSTS.key:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Will & Trust Details</h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Executor Name *
              </label>
              <input
                type="text"
                value={documentSpecific.executorName || ""}
                onChange={(e) => handleDocumentSpecificChange("executorName", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Full name of your executor"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Primary Beneficiaries
              </label>
              <textarea
                value={documentSpecific.beneficiaries || ""}
                onChange={(e) => handleDocumentSpecificChange("beneficiaries", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="List your beneficiaries and their relationship to you..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Guardian for Minor Children (if applicable)
              </label>
              <input
                type="text"
                value={documentSpecific.guardian || ""}
                onChange={(e) => handleDocumentSpecificChange("guardian", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Guardian name for minor children"
              />
            </div>
          </div>
        );

      case CASE_TYPES.REAL_ESTATE_DEED.key:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Property Transfer Details</h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Property Address *
              </label>
              <input
                type="text"
                value={documentSpecific.propertyAddress || ""}
                onChange={(e) => handleDocumentSpecificChange("propertyAddress", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Full property address"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Transferee Name *
              </label>
              <input
                type="text"
                value={documentSpecific.transfereeName || ""}
                onChange={(e) => handleDocumentSpecificChange("transfereeName", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Name of person/entity receiving the property"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Consideration Amount
              </label>
              <input
                type="text"
                value={documentSpecific.consideration || ""}
                onChange={(e) => handleDocumentSpecificChange("consideration", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Sale price or 'Love and Affection'"
              />
            </div>
          </div>
        );

      case CASE_TYPES.DIVORCE.key:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Divorce Details</h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Spouse's Full Name *
              </label>
              <input
                type="text"
                value={documentSpecific.spouseName || ""}
                onChange={(e) => handleDocumentSpecificChange("spouseName", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Your spouse's full legal name"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Date of Marriage
              </label>
              <input
                type="date"
                value={documentSpecific.marriageDate || ""}
                onChange={(e) => handleDocumentSpecificChange("marriageDate", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Children from Marriage
              </label>
              <textarea
                value={documentSpecific.children || ""}
                onChange={(e) => handleDocumentSpecificChange("children", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="List children's names and ages, or write 'None'"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Additional Information
              </label>
              <textarea
                value={documentSpecific.additionalInfo || ""}
                onChange={(e) => handleDocumentSpecificChange("additionalInfo", e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Provide any additional information specific to your document..."
                rows={4}
              />
            </div>
          </div>
        );
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
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
            <span className="font-medium">Step 2 of 5</span>
            <span className="hidden sm:inline">Document Details</span>
            <span className="sm:hidden text-xs">Details</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-2/5 transition-all duration-300"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                <span className="text-white font-bold text-base sm:text-lg">2</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Document Details</h1>
                <p className="text-blue-200 mt-1 sm:mt-2 text-sm sm:text-base">
                  {generatorData.caseTypeDisplay} for {generatorData.stateDisplay}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={personalDetails.fullName}
                    onChange={(e) => handlePersonalDetailChange("fullName", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="Your full legal name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={personalDetails.email}
                    onChange={(e) => handlePersonalDetailChange("email", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={personalDetails.phone}
                    onChange={(e) => handlePersonalDetailChange("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={personalDetails.address}
                    onChange={(e) => handlePersonalDetailChange("address", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={personalDetails.city}
                    onChange={(e) => handlePersonalDetailChange("city", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={personalDetails.zipCode}
                    onChange={(e) => handlePersonalDetailChange("zipCode", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            {/* Document-Specific Fields */}
            {renderDocumentSpecificFields()}

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
                onClick={handleContinue}
                disabled={!personalDetails.fullName || !personalDetails.email}
                className="flex items-center justify-center px-6 sm:px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base order-1 sm:order-2"
              >
                Continue
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
