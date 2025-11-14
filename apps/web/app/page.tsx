"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CASE_TYPE_DISPLAY_NAMES, 
  US_STATE_NAMES,
  getKeyFromDisplayName,
  getStateKeyFromName
} from "../lib/constants";

// Home Generator Form Component
function HomeGeneratorForm() {
  const router = useRouter();
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocumentType) {
      alert("Please select a document type");
      return;
    }
    
    // Create URL with query parameters using keys instead of display names
    const params = new URLSearchParams();
    params.set('caseType', getKeyFromDisplayName(selectedDocumentType));
    if (selectedState) {
      params.set('state', getStateKeyFromName(selectedState));
    }
    
    router.push(`/generator/step1?${params.toString()}`);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="document-type" className="block text-sm font-medium mb-2">
          Document Type
        </label>
        <select
          id="document-type"
          value={selectedDocumentType}
          onChange={(e) => setSelectedDocumentType(e.target.value)}
          className="w-full px-4 py-3 bg-blue-700/50 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="" disabled>Select Legal Service</option>
          {CASE_TYPE_DISPLAY_NAMES.map((displayName) => (
            <option key={displayName} value={displayName}>
              {displayName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium mb-2">
          State (Optional)
        </label>
        <select
          id="state"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-4 py-3 bg-blue-700/50 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Your State</option>
          {US_STATE_NAMES.map((stateName) => (
            <option key={stateName} value={stateName}>
              {stateName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
      >
        Generate Documents
      </button>
    </form>
  );
}

// Case type mapping for service IDs to ensure consistency
const SERVICE_ID_TO_CASE_TYPE = {
  "bankruptcy-filing": "bankruptcy",
  "divorce-proceedings": "divorce", 
  "foreclosure-defense": "foreclosure",
  "property-title-search": "property_title",
  "probate-estate-filing": "probate",
  "loan-modification": "loan_modification",
  "eviction-defense": "eviction",
  "wills-trusts": "wills_trusts",
  "real-estate-deed-transfer": "real_estate_deed",
  "power-of-attorney": "power_of_attorney",
  "name-change-petition": "name_change"
};

// Services data array
const services = [
  {
    id: "property-title-search",
    title: "Property Title Search",
    description: "Comprehensive property analysis with preliminary Title Commitment letter after our detailed county-specific research across all 50 states",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$500-$1,500",
    ourPrice: "$100",
    savings: "Save $400+"
  },
  {
    id: "probate-estate-filing",
    title: "Probate & Estate Filing",
    description: "Professional court templates for all U.S. states",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$1,800-$5,000",
    ourPrice: "$100",
    savings: "Save $1,700+"
  },
  {
    id: "foreclosure-defense",
    title: "Foreclosure Defense",
    description: "Strategic timeline analysis and defense strategies nationwide",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$3,000-$8,000",
    ourPrice: "$100",
    savings: "Save $2,900+"
  },
  {
    id: "bankruptcy-filing",
    title: "Bankruptcy Filing",
    description: "Chapter 7 & 13 automated petition generation for all U.S. federal courts",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$2,500-$5,000",
    ourPrice: "$100",
    savings: "Save $2,400+"
  },
  {
    id: "divorce-proceedings",
    title: "Divorce Proceedings",
    description: "Complete petition systems for all 50 states",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
    attorneyPrice: "$3,000-$15,000",
    ourPrice: "$100",
    savings: "Save $2,900+"
  },
  {
    id: "loan-modification",
    title: "Loan Modification",
    description: "Professional hardship letter generation nationwide",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$1,500-$4,000",
    ourPrice: "$100",
    savings: "Save $1,400+"
  },
  {
    id: "eviction-defense",
    title: "Eviction Defense",
    description: "Tenant rights protection in all states",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    attorneyPrice: "$1,500-$3,500",
    ourPrice: "$100",
    savings: "Save $1,400+"
  },
  {
    id: "wills-trusts",
    title: "Wills & Trusts",
    description: "Comprehensive estate planning automation for all U.S. states",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$2,000-$7,000",
    ourPrice: "$100",
    savings: "Save $1,900+"
  },
  {
    id: "real-estate-deed-transfer",
    title: "Real Estate Deed Transfer",
    description: "County integration and ZIP code lookup nationwide",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$800-$2,500",
    ourPrice: "$100",
    savings: "Save $700+"
  },
  {
    id: "power-of-attorney",
    title: "Power of Attorney",
    description: "4 comprehensive POA types with state-specific compliance for all 50 states",
    icon: (
      <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    attorneyPrice: "$300-$1,200",
    ourPrice: "$100",
    savings: "Save $200+"
  }
];

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 min-h-screen text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Professional Legal
                <br />
                Document Generation
              </h1>
              <div className="text-2xl lg:text-3xl font-semibold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </div>
            </div>

            <p className="text-lg lg:text-xl text-blue-100 max-w-2xl">
              Get court-ready legal documents in minutes, not weeks. Our AI-powered 
              platform provides professional legal services at 90% cost savings with 
              nationwide coverage across all 50 states.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-blue-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                </div>
                <span>Trusted by attorneys in 50 states</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm border-2 border-blue-300 flex items-center justify-center">
                  <div className="w-2 h-1 bg-blue-300"></div>
                </div>
                <span>Encrypted & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border-2 border-blue-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                </div>
                <span>Secure Checkout with <strong>stripe</strong></span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-8 py-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  10
                </div>
                <div className="text-sm lg:text-base text-blue-200 mt-2">
                  MINUTES NOT WEEKS
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  50
                </div>
                <div className="text-sm lg:text-base text-blue-200 mt-2">
                  STATES COVERED
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  90%
                </div>
                <div className="text-sm lg:text-base text-blue-200 mt-2">
                  COST SAVINGS
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-center"
              >
                View Services
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-blue-300 text-blue-100 hover:bg-blue-300 hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-center"
              >
                See Pricing
              </Link>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-600/30">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Legal Document Generator</h3>
              </div>

              <HomeGeneratorForm />
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Legal Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Legal Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional document generation across all major legal specialties
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* AI Legal Assistant Chat Interface */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Chat Header */}
              <div className="bg-blue-600 text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">AI Legal Assistant</h3>
                </div>
              </div>

              {/* Chat Content */}
              <div className="p-6 bg-gray-50 min-h-[400px]">
                {/* AI Message */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 max-w-md">
                    <p className="text-gray-800">
                      Hello! I'm your AI Legal Assistant.
                    </p>
                    <p className="text-gray-800 mt-2">
                      Tell me about your legal situation and I'll help you determine which documents you need and gather the necessary information.
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200">
                    <span>🏛️</span>
                    Bankruptcy Filing
                  </button>
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200">
                    <span>👥</span>
                    Divorce Documents
                  </button>
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200">
                    <span>🏠</span>
                    Foreclosure Defense
                  </button>
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200">
                    <span>📋</span>
                    Title Search
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Message"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Pricing Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Legal Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered legal document generation at a fraction of attorney costs
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 group flex flex-col h-full"
              >
                {/* Icon */}
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  {service.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3 flex-grow">
                  {service.description}
                </p>
                
                {/* Pricing */}
                <div className="mb-6">
                  <div className="text-red-500 line-through text-sm mb-2 font-medium">
                    Attorney: {service.attorneyPrice}
                  </div>
                  <div className="text-green-600 text-2xl font-bold mb-4">
                    Our Price: {service.ourPrice}
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="space-y-3 mt-auto">
                  <div className="bg-green-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm">
                    {service.savings}
                  </div>
                  <Link 
                    href={`/generator?caseType=${SERVICE_ID_TO_CASE_TYPE[service.id as keyof typeof SERVICE_ID_TO_CASE_TYPE] || service.id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 text-center"
                  >
                    Get Started Now
                  </Link>
                  <div className="text-xs text-gray-500">
                    National Coverage - All 50 States
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Plans Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Access Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're an individual handling your own case or an organization serving multiple clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Pro-Se Individual */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro-Se Individual</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For consumers without legal experience<br />
                  Perfect for individuals handling their own legal matters
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$29.00</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">Plus $10 per document generated</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Access to all self-help legal forms
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Step-by-step filing guidance
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AI-powered document review
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic legal knowledge base
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                Start Pro-Se Plan
              </button>
            </div>

            {/* Single Service */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Single Service</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Per service access<br />
                  Perfect for individual legal needs with professional results
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$100</span>
                  <span className="text-gray-600">/service</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">Complete access for 30 days</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Secure Checkout with</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Any single legal service
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AI-powered document generation
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Professional attorney review
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Court-ready PDF output
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No monthly subscription required
                </li>
              </ul>

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200">
                Get Started
              </button>
            </div>

            {/* Organization Pro - MOST POPULAR */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-500 relative hover:shadow-xl transition-shadow duration-200 flex flex-col h-full">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>

              <div className="text-center mb-6 pt-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 011 1v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 5a1 1 0 100-2 1 1 0 000 2zm3.5-1a1 1 0 11-2 0 1 1 0 012 0zm1.5 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Organization Pro</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For law firms, corporations & non-profits<br />
                  Designed for legal professionals and organizations
                </p>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">or $529/year (Save $59)</p>
              </div>

              <ul className="space-y-2 mb-8 text-sm flex-grow">
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Pro-Se Individual
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multi-user access (up to 10 users)
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced case management
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bulk document processing
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  API access for integrations
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom branding options
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Analytics and reporting
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  HIPAA Compliance & Requirements for Data Servers
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AES-256 Data Encryption for sensitive data protection
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Access Controls with role-based permissions
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure Cloud Storage with enterprise-grade security
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Software Purchase Option: $1,000 one-time + $49/month updates
                </li>
              </ul>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 mb-4">
                Start Enterprise Trial
              </button>
            </div>

            {/* Legal Flow Pro A.I. Premium */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Legal Flow Pro A.I. Premium</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Custom solutions<br />
                  Custom solutions for large organizations and specialized needs
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">Contact</span>
                  <span className="text-gray-600">/sales</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">Custom pricing available</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Enterprise
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom legal workflows
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  White-label solutions
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  On-premise deployment
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated infrastructure
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 premium support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Legal compliance consulting
                </li>
              </ul>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              Trusted by legal professionals and individuals nationwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Pro Se User Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-8 relative">
              <div className="mb-6">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "Saved me hours on bankruptcy forms. The AI guidance made everything so much clearer."
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pro Se User</h4>
                  <p className="text-gray-600 text-sm">Florida</p>
                </div>
              </div>
            </div>

            {/* Small Business Owner Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-8 relative">
              <div className="mb-6">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "Professional quality documents at a fraction of attorney costs. Highly recommend for any legal needs."
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">MR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Small Business Owner</h4>
                  <p className="text-gray-600 text-sm">California</p>
                </div>
              </div>
            </div>

            {/* Legal Professional Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-8 relative">
              <div className="mb-6">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "The foreclosure defense documents were exactly what we needed. Court-ready and professionally formatted."
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">LF</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Legal Professional</h4>
                  <p className="text-gray-600 text-sm">Texas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="flex items-center justify-center space-x-4">
            <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors duration-200">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
            
            <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Get professional legal documents in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
              </div>
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Tell Us Your Needs</h3>
                <p className="text-blue-100">
                  Chat with our AI assistant about your legal situation. Answer simple questions to help us understand your specific requirements.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
              </div>
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Creates Your Documents</h3>
                <p className="text-blue-100">
                  Our advanced AI generates professional, state-specific legal documents tailored to your situation in minutes, not weeks.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Download & File</h3>
                <p className="text-blue-100">
                  Review your court-ready documents, download them instantly, and follow our step-by-step filing instructions for your state.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-600/30 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-blue-100 mb-6">
                Join thousands who have simplified their legal process with AI-powered assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  Start Free Consultation
                </button>
                <button className="border-2 border-blue-300 text-blue-100 hover:bg-blue-300 hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  View Pricing Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Get Started Today Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold text-sm mb-6">
              ✨ Start Your Legal Journey
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Get Started Today
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands who've simplified their legal process with AI-powered assistance
            </p>
          </div>

          {/* Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-16">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-blue-300 mb-2">
                  10,000+
                </div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">
                  Documents Generated
                </div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-blue-300 mb-2">
                  95%
                </div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">
                  Success Rate
                </div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-blue-300 mb-2">
                  24/7
                </div>
                <div className="text-gray-300 font-medium uppercase tracking-wide">
                  AI Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Benefits Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            
            {/* Boost Revenue */}
            <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30 hover:bg-blue-800/40 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Boost Revenue</h3>
                  <p className="text-blue-100">Earn more but cost less</p>
                </div>
              </div>
            </div>

            {/* Amplify Efficiency */}
            <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30 hover:bg-blue-800/40 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Amplify Efficiency</h3>
                  <p className="text-blue-100">Deliver better but faster</p>
                </div>
              </div>
            </div>

            {/* Build Resilient Team */}
            <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30 hover:bg-blue-800/40 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Build resilient team</h3>
                  <p className="text-blue-100">Fortify work life balance</p>
                </div>
              </div>
            </div>

            {/* Unlock More Clients - Highlighted */}
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-400/50 hover:border-orange-400/70 transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-100 mb-2">Unlock more clients</h3>
                  <p className="text-orange-200">Extend quality interactions</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
