import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Image
                src="/file.svg"
                alt="Legal Flow Pro Logo"
                width={24}
                height={24}
                className="invert"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Legal Flow Pro A.I.</h1>
              <p className="text-sm text-slate-300">Professional Legal Services</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              href="/generator"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Generator
            </Link>
            <Link
              href="/pricing"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Sign Up
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-slate-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Open main menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}