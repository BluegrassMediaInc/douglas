"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CASE_TYPES, 
  CASE_TYPE_DISPLAY_NAMES, 
  US_STATES, 
  US_STATE_NAMES,
  getKeyFromDisplayName,
  getStateKeyFromName
} from "../../lib/constants";

export default function DocumentGeneratorPage() {
  const router = useRouter();
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isDocumentDropdownOpen, setIsDocumentDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter states based on search term
  const filteredStates = US_STATE_NAMES.filter(state =>
    state.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!selectedDocumentType || !selectedState) {
      alert("Please select both a document type and state");
      return;
    }

    // Create URL with query parameters using keys instead of display names
    const params = new URLSearchParams();
    params.set('caseType', getKeyFromDisplayName(selectedDocumentType));
    params.set('state', getStateKeyFromName(selectedState));
    
    // Navigate to step 1 with parameters
    router.push(`/generator/step1?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
              <h1 className="text-3xl font-bold text-white">Legal Document Generator</h1>
            </div>
          </div>

          <div className="space-y-8">
            {/* Document Type Selection */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Document Type
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
                State
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

            {/* Generate Button */}
            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedDocumentType || !selectedState}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Document...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Generate Legal Document
                  </div>
                )}
              </button>
            </div>

            {/* Info Section */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-white font-semibold mb-2">How it works:</h3>
                  <ul className="text-blue-100 text-sm space-y-1">
                    <li>• Select the type of legal document you need</li>
                    <li>• Choose your state for compliance requirements</li>
                    <li>• Our AI generates a professional, state-specific document</li>
                    <li>• Download and customize as needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-blue-200 hover:text-white transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}