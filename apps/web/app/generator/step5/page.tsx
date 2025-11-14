"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CASE_TYPES,
  getCaseTypeByKey,
  type CaseTypeKey 
} from "../../../lib/constants";
import StripePaymentForm from "../../components/StripePaymentForm";
import { apiClient } from "../../../lib/api";

interface GeneratorData {
  caseType: string;
  caseTypeDisplay: string;
  state: string;
  stateDisplay: string;
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
  generated?: boolean;
  generatedAt?: string;
  paymentCompleted?: boolean;
  paymentIntentId?: string;
  orderCreated?: boolean;
  orderDate?: string;
  expectedDelivery?: string;
}

export default function DocumentGeneratorStep5() {
  const router = useRouter();
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);

  // Validate case type against constants
  const validateCaseType = (caseType: string): boolean => {
    return Object.values(CASE_TYPES).some(type => type.key === caseType);
  };
  const [paymentStep, setPaymentStep] = useState<"payment" | "completed">("payment");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Payment amount in cents ($29.99)
  const DOCUMENT_PRICE = 2999;

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
      
      if (!data.generated) {
        // Redirect to step 4 if not generated
        router.push('/generator/step4');
        return;
      }
      setGeneratorData(data);
      
      // Check if payment is already completed
      if (data.paymentCompleted) {
        setPaymentStep("completed");
      }
    } else {
      // Redirect to step 1 if no data found
      router.push('/generator/step1');
    }
  }, [router]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    
    try {
      // Create order record after successful payment
      const response = await apiClient.createDocumentOrder(
        paymentIntent.id,
        generatorData,
        generatorData?.personalDetails?.email!
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to create order");
      }
      
      // Update localStorage with payment completion
      const updatedData = {
        ...generatorData!,
        paymentCompleted: true,
        paymentIntentId: paymentIntent.id,
        orderCreated: true,
        orderDate: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      };
      localStorage.setItem('generatorData', JSON.stringify(updatedData));
      setGeneratorData(updatedData);
      
      setPaymentStep("completed");
    } catch (error: any) {
      setPaymentError(error.message || "Failed to process payment completion");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setIsProcessingPayment(false);
  };



  const handleStartNew = () => {
    // Clear localStorage
    localStorage.removeItem('generatorData');
    // Redirect to step 1
    router.push('/generator/step1');
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
            <span className="font-medium">Step 5 of 5</span>
            <span>Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${paymentStep === "completed" ? "bg-green-600" : "bg-blue-600"} rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4`}>
                {paymentStep === "completed" ? (
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {paymentStep === "completed" ? "Order Confirmed!" : "Complete Your Purchase"}
                </h1>
                <p className="text-blue-200 mt-1 sm:mt-2 text-sm sm:text-base">
                  {paymentStep === "completed" 
                    ? `Your order has been received! Your ${generatorData.caseTypeDisplay} will be delivered within 2 business days`
                    : `Complete payment and we'll deliver your ${generatorData.caseTypeDisplay} within 2 business days`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Document Summary */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Document Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <span className="text-blue-300 block text-sm">Document Type</span>
                  <span className="font-medium">{generatorData.caseTypeDisplay}</span>
                </div>
                <div>
                  <span className="text-blue-300 block text-sm">State</span>
                  <span className="font-medium">{generatorData.stateDisplay}</span>
                </div>
                <div>
                  <span className="text-blue-300 block text-sm">Ordered For</span>
                  <span className="font-medium">{generatorData.personalDetails.fullName}</span>
                </div>
                <div>
                  <span className="text-blue-300 block text-sm">Order Prepared</span>
                  <span className="font-medium">
                    {generatorData.generatedAt ? new Date(generatorData.generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {paymentStep === "payment" && (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">Secure Payment</h3>
                    <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-400/30">
                      SSL Encrypted
                    </span>
                  </div>
                  <p className="text-blue-200 mb-4">
                    Complete your one-time payment and we'll professionally prepare and deliver your legal document within 2 business days via email.
                  </p>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center text-green-300 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Stripe Secured
                    </div>
                    <div className="flex items-center text-green-300 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      PCI Compliant
                    </div>
                    <div className="flex items-center text-green-300 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      256-bit SSL
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">${(DOCUMENT_PRICE / 100).toFixed(2)}</span>
                    <span className="text-blue-200 ml-2">One-time payment</span>
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
                    <p className="text-red-200 text-sm">{paymentError}</p>
                  </div>
                )}

                {isProcessingPayment ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-white">Processing payment and creating your order...</p>
                  </div>
                ) : (
                  <StripePaymentForm
                    amount={DOCUMENT_PRICE}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    disabled={isProcessingPayment}
                  />
                )}
              </div>
            )}

            {/* Order Confirmation Section */}
            {paymentStep === "completed" && (
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Order Confirmed!</h3>
                  <p className="text-green-200 mb-6">
                    Thank you for your order! Your ${generatorData.caseTypeDisplay} document is now being professionally prepared. 
                    We'll email it to <strong>{generatorData.personalDetails.email}</strong> within <strong>2 business days</strong>.
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-300 block">Order Date</span>
                        <span className="font-medium text-white">
                          {generatorData.orderDate ? new Date(generatorData.orderDate).toLocaleDateString() : new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-300 block">Expected Delivery</span>
                        <span className="font-medium text-white">
                          {generatorData.expectedDelivery 
                            ? new Date(generatorData.expectedDelivery).toLocaleDateString() 
                            : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-300 block">Payment ID</span>
                        <span className="font-medium text-white text-xs">
                          {generatorData.paymentIntentId?.substring(0, 20)}...
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-300 block">Amount Paid</span>
                        <span className="font-medium text-white">
                          ${(DOCUMENT_PRICE / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-blue-200 text-sm mb-4">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    You'll receive an email confirmation shortly with your order details and tracking information.
                  </div>
                </div>
              </div>
            )}

            {/* Additional Actions */}
            {paymentStep === "completed" && (
            <div className="text-center">
              <button
                onClick={handleStartNew}
                className="flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 mx-auto"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Order Another Document
              </button>
            </div>
            )}

            {/* Important Information */}
            {paymentStep === "completed" && (
            <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-yellow-100 font-semibold mb-2">What Happens Next</h3>
                  <ul className="text-yellow-100 text-sm space-y-1">
                    <li>• Our legal experts will professionally prepare your document</li>
                    <li>• You'll receive an email confirmation within 1 hour</li>
                    <li>• Your completed document will be delivered within 2 business days</li>
                    <li>• Review the document carefully and consider attorney consultation</li>
                    <li>• Some documents may require notarization or witnessing</li>
                  </ul>
                </div>
              </div>
            </div>
            )}

            {/* Support Information */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="text-center">
                <h3 className="text-white font-semibold mb-2">Need Help?</h3>
                <p className="text-blue-200 text-sm mb-4">
                  If you have questions about your document or need assistance, we're here to help.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    href="/contact" 
                    className="text-blue-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    Contact Support
                  </Link>
                  <span className="text-white/40">•</span>
                  <Link 
                    href="/" 
                    className="text-blue-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
