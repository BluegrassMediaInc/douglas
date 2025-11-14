"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, UserRound, FileText, Building2, Award } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

export default function PricingPlans() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const isYearly = billing === "yearly";

  const price = {
    proSe: isYearly ? { amount: 299, suffix: "/year", blurb: "Save $49 vs monthly" } : { amount: 29, suffix: "/month", blurb: "Plus $10 per document" },
    org: isYearly ? { amount: 529, suffix: "/year", blurb: "Save $59 vs monthly" } : { amount: 49, suffix: "/month", blurb: "Cancel anytime" },
  } as const;

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Choose Your Access Plan</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're an individual handling your own case or an organization serving multiple clients
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                !isYearly ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isYearly ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Yearly
            </button>
          </div>
          {isYearly && (
            <span className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 animate-pulse">
              🎉 Limited‑time: Save up to $108/year!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Pro‑Se Individual */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full relative">
            <div className="absolute -top-2 -right-2 h-6">
              {isYearly && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Save $49
                </span>
              )}
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserRound className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro‑Se Individual</h3>
              <p className="text-sm text-gray-600 mb-4">For self‑represented individuals</p>
              <div className="mb-1 min-h-[3rem] flex items-center justify-center flex-col">
                <div>
                  <span className="text-3xl font-bold text-gray-900">${price.proSe.amount}</span>
                  <span className="text-gray-600">{price.proSe.suffix}</span>
                </div>
              </div>
              <p className="text-sm text-green-700 min-h-[2.5rem] flex items-center justify-center">{price.proSe.blurb}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Access to all self‑help legal forms</li>
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Step‑by‑step filing guidance</li>
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> AI‑powered document review</li>
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Email support</li>
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
              Start Pro‑Se Plan
            </button>
          </div>

          {/* Single Service */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full relative">
            <div className="absolute -top-2 -right-2 h-6">
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                First-time 20% OFF
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Single Service</h3>
              <p className="text-sm text-gray-600 mb-4">Per‑service access for focused needs</p>
              <div className="mb-2 min-h-[3rem] flex items-center justify-center flex-col">
                <div>
                  <span className="text-lg text-gray-500 line-through mr-2">$100</span>
                  <span className="text-3xl font-bold text-gray-900">$80</span>
                  <span className="text-gray-600">/service</span>
                </div>
              </div>
              <div className="min-h-[2.5rem] flex items-center justify-center flex-col">
                <p className="text-sm text-gray-600 mb-2">Complete access for 30 days</p>
                <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold">
                  Popular choice
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Any single legal service</li>
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> AI‑powered document generation</li>
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Professional attorney review</li>
              <li className="flex items-center text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Court‑ready PDF output</li>
            </ul>

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200">
              Get Started
            </button>
          </div>

          {/* Organization Pro */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-500 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">MOST POPULAR</span>
            </div>
            <div className="absolute -top-2 -right-2 h-6 z-20">
              {isYearly && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Save $59
                </span>
              )}
            </div>
            <div className="text-center mb-6 pt-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-blue-200">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Organization Pro</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">For law firms, corporations & non‑profits</p>
              <div className="mb-2 min-h-[4rem] flex items-center justify-center flex-col">
                <div className="mb-1">
                  <span className="text-4xl font-bold text-gray-900">${price.org.amount}</span>
                  <span className="text-lg text-gray-600">{price.org.suffix}</span>
                </div>
                <p className="text-sm text-green-700 font-medium">{price.org.blurb}</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-sm flex-grow">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Everything in Pro‑Se Individual</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Multi‑user access (up to 10 users)</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Advanced case management</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Bulk document processing</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span>API access for integrations</span>
              </li>
            </ul>

            <div className="mt-auto">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors duration-200 mb-3 shadow-lg hover:shadow-xl">
                Start {isYearly ? "Annual" : "Monthly"} Plan
              </button>
              <Link href="#" className="block text-center text-sm text-blue-700 hover:text-blue-800 hover:underline transition-colors">
                View full feature list
              </Link>
            </div>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full relative">
            <div className="absolute -top-2 -right-2 h-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                Free Consultation
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Legal Flow Pro A.I. Premium</h3>
              <p className="text-sm text-gray-600 mb-4">Custom solutions for large organizations</p>
              <div className="mb-2 min-h-[3rem] flex items-center justify-center flex-col">
                <div>
                  <span className="text-2xl font-bold text-gray-900">Contact</span>
                  <span className="text-gray-600">/sales</span>
                </div>
              </div>
              <div className="min-h-[2.5rem]"></div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow text-sm">
              <li className="flex items-center text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Everything in Enterprise</li>
              <li className="flex items-center text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Custom legal workflows</li>
              <li className="flex items-center text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> White‑label solutions</li>
              <li className="flex items-center text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> On‑premise deployment</li>
              <li className="flex items-center text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Dedicated infrastructure</li>
            </ul>

            <button className="w-full bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


