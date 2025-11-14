"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Saved me hours on bankruptcy forms. The AI guidance made everything so much clearer.",
    name: "Pro Se User",
    location: "Florida",
    initials: "JS",
    color: "bg-blue-600",
    quoteColor: "text-blue-100 group-hover:text-blue-200"
  },
  {
    id: 2,
    quote: "Professional quality documents at a fraction of attorney costs. Highly recommend for any legal needs.",
    name: "Small Business Owner",
    location: "California",
    initials: "MR",
    color: "bg-green-600",
    quoteColor: "text-green-100 group-hover:text-green-200"
  },
  {
    id: 3,
    quote: "The foreclosure defense documents were exactly what we needed. Court-ready and professionally formatted.",
    name: "Legal Professional",
    location: "Texas",
    initials: "LF",
    color: "bg-orange-600",
    quoteColor: "text-orange-100 group-hover:text-orange-200"
  },
  {
    id: 4,
    quote: "Legal Flow saved our startup thousands in legal fees. The contract templates are comprehensive and easy to use.",
    name: "Tech Entrepreneur",
    location: "New York",
    initials: "AS",
    color: "bg-purple-600",
    quoteColor: "text-purple-100 group-hover:text-purple-200"
  },
  {
    id: 5,
    quote: "The estate planning documents were perfect. My family now has peace of mind knowing everything is in order.",
    name: "Retiree",
    location: "Arizona",
    initials: "DM",
    color: "bg-indigo-600",
    quoteColor: "text-indigo-100 group-hover:text-indigo-200"
  },
  {
    id: 6,
    quote: "As a paralegal, I appreciate the attention to detail in every document. Saves me hours of formatting work.",
    name: "Paralegal",
    location: "Illinois",
    initials: "KT",
    color: "bg-pink-600",
    quoteColor: "text-pink-100 group-hover:text-pink-200"
  }
];

export default function TestimonialsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialsPerPage = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * testimonialsPerPage;
    return testimonials.slice(startIndex, startIndex + testimonialsPerPage);
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by legal professionals and individuals nationwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 min-h-[400px]">
          {getCurrentTestimonials().map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative group animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-6 right-6 text-6xl ${testimonial.quoteColor} transition-colors`}>
                "
              </div>
              <div className="mb-8 relative z-10">
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center relative z-10">
                <div className={`w-14 h-14 ${testimonial.color} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm font-medium">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-blue-600" />
          </button>
          
          <div className="flex space-x-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-blue-600 shadow-sm"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentSlide === totalSlides - 1}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
