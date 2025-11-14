"use client";

import { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiClient } from "../../lib/api";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  amount: number; // in cents
  disabled?: boolean;
}

function PaymentForm({ onPaymentSuccess, onPaymentError, amount, disabled }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsLoading(false);
      return;
    }

    try {
      // Create payment intent on your backend
      const response = await apiClient.createPaymentIntent(amount);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create payment intent");
      }

      const { client_secret } = response.data;

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        onPaymentError(confirmError.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
      onPaymentError(err.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        "::placeholder": {
          color: "#ffffff80",
        },
        iconColor: "#ffffff",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-white text-sm font-medium">
            Card Information
          </label>
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-green-300">Secured by Stripe</span>
          </div>
        </div>
        <CardElement options={cardElementOptions} />
        <div className="mt-2 text-xs text-blue-200">
          Your payment information is encrypted and secure. We never store your card details.
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading || disabled}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </button>
    </form>
  );
}

interface StripePaymentFormProps extends PaymentFormProps {
  className?: string;
}

export default function StripePaymentForm({
  onPaymentSuccess,
  onPaymentError,
  amount,
  disabled,
  className = "",
}: StripePaymentFormProps) {
  return (
    <div className={className}>
      <Elements stripe={stripePromise}>
        <PaymentForm
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
          amount={amount}
          disabled={disabled}
        />
      </Elements>
    </div>
  );
}
