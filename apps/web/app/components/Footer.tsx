import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Legal Flow Pro A.I. Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Legal Flow Pro A.I.</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Professional legal document services powered by artificial intelligence. Democratizing access to legal services nationwide.
            </p>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Connect With Us</h4>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Bankruptcy Filing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Divorce Proceedings
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Foreclosure Defense
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Property Title Search
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Estate Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Coverage Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Coverage</h3>
            <ul className="space-y-3 text-blue-100">
              <li>All 50 United States</li>
              <li>Federal Court Systems</li>
              <li>State Court Systems</li>
              <li>County-Level Filings</li>
              <li>Municipal Courts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-blue-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-blue-200 text-sm">
            © 2025 Legal Flow Pro A.I. All rights reserved. Professional legal document services.
          </div>
        </div>
      </div>

      {/* Military & DOD Section */}
      <div className="border-t border-blue-600/30 bg-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Military JAG CORPS Automation Workflows
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Department of Defense Transformational LLMs
            </div>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="border-t border-blue-600/30 bg-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Encrypted & Secure
            </div>
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}