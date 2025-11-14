"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CASE_TYPES, 
  CASE_TYPE_DISPLAY_NAMES, 
  US_STATES, 
  US_STATE_NAMES,
  getCaseTypeByKey,
  getStateByKey,
  getKeyFromDisplayName,
  getStateKeyFromName
} from "../../../lib/constants";

function DocumentGeneratorStep1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isDocumentDropdownOpen, setIsDocumentDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");

  // Load parameters from URL on component mount
  useEffect(() => {
    const caseTypeParam = searchParams.get('caseType');
    const stateParam = searchParams.get('state');
    
    if (caseTypeParam) {
      // Convert case type key to display name
      const caseType = getCaseTypeByKey(caseTypeParam);
      if (caseType) {
        setSelectedDocumentType(caseType.displayName);
      }
    }
    
    if (stateParam) {
      // Convert state key to state name
      const state = getStateByKey(stateParam);
      if (state) {
        setSelectedState(state.name);
      }
    }
  }, [searchParams]);

  // Filter states based on search term
  const filteredStates = US_STATE_NAMES.filter(state =>
    state.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (!selectedDocumentType || !selectedState) {
      alert("Please select both a document type and state");
      return;
    }

    // Store data in localStorage for persistence across pages (using keys)
    const generatorData = {
      caseType: getKeyFromDisplayName(selectedDocumentType),
      caseTypeDisplay: selectedDocumentType,
      state: getStateKeyFromName(selectedState),
      stateDisplay: selectedState,
      step: 1
    };
    localStorage.setItem('generatorData', JSON.stringify(generatorData));
    
    // Navigate to step 2
    router.push('/generator/step2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
            <span className="font-medium">Step 1 of 5</span>
            <span className="hidden sm:inline">Document Selection</span>
            <span className="sm:hidden text-xs">Selection</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-1/5 transition-all duration-300"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                <span className="text-white font-bold text-base sm:text-lg">1</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Document Selection</h1>
                <p className="text-blue-200 mt-1 sm:mt-2 text-sm sm:text-base">Choose your document type and jurisdiction</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Document Type Selection */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Document Type *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDocumentDropdownOpen(!isDocumentDropdownOpen)}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-left text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                >
                  <span className={selectedDocumentType ? "text-white" : "text-white/70"}>
                    {selectedDocumentType || "Select Legal Service"}
                  </span>
                  <svg className={`h-5 w-5 text-white transition-transform duration-200 ${isDocumentDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDocumentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-sm border border-white/30 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                    <div className="p-2">
                      {CASE_TYPE_DISPLAY_NAMES.map((docType) => (
                        <button
                          key={docType}
                          onClick={() => {
                            setSelectedDocumentType(docType);
                            setIsDocumentDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-gray-800 hover:bg-blue-100 rounded-xl transition-colors duration-200 flex items-center"
                        >
                          {selectedDocumentType === docType && (
                            <svg className="h-4 w-4 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {docType}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                State *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-left text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                >
                  <span className={selectedState ? "text-white" : "text-white/70"}>
                    {selectedState || "Select Your State"}
                  </span>
                  <svg className={`h-5 w-5 text-white transition-transform duration-200 ${isStateDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isStateDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-sm border border-white/30 rounded-2xl shadow-2xl max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search states..."
                          value={stateSearchTerm}
                          onChange={(e) => setStateSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 pl-10 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          autoFocus
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* States List */}
                    <div className="max-h-60 overflow-y-auto">
                      <div className="p-2">
                        {filteredStates.length > 0 ? (
                          filteredStates.map((state) => (
                            <button
                              key={state}
                              onClick={() => {
                                setSelectedState(state);
                                setIsStateDropdownOpen(false);
                                setStateSearchTerm("");
                              }}
                              className="w-full text-left px-4 py-3 text-gray-800 hover:bg-blue-100 rounded-xl transition-colors duration-200 flex items-center"
                            >
                              {selectedState === state && (
                                <svg className="h-4 w-4 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {state}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No states found matching "{stateSearchTerm}"
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Select Options */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <div className="text-xs text-gray-600 mb-2">Popular States:</div>
                      <div className="flex flex-wrap gap-1">
                        {["California", "Texas", "Florida", "New York", "Pennsylvania"].map((state) => (
                          <button
                            key={state}
                            onClick={() => {
                              setSelectedState(state);
                              setIsStateDropdownOpen(false);
                              setStateSearchTerm("");
                            }}
                            className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors duration-200"
                          >
                            {state}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-6">
              <Link 
                href="/" 
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>

              <button
                onClick={handleContinue}
                disabled={!selectedDocumentType || !selectedState}
                className="flex items-center justify-center px-6 sm:px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base order-1 sm:order-2"
              >
                Continue
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Info Section */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-white font-semibold mb-2">What's Next:</h3>
                  <ul className="text-blue-100 text-sm space-y-1">
                    <li>• Provide document-specific details</li>
                    <li>• Review your information</li>
                    <li>• Generate your professional legal document</li>
                    <li>• Download and customize as needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentGeneratorStep1() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <DocumentGeneratorStep1Content />
    </Suspense>
  );
}
