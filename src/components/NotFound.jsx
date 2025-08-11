"use client";

import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-800 mb-4">404</h1>
          <div className="w-24 h-1 bg-slate-600 mx-auto mb-8"></div>
        </div>

        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>

        <p className="text-slate-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-slate-300"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="mt-12 text-slate-500 text-sm">
          <p>
            Need help?{" "}
            <a
              href="/contact"
              className="text-slate-600 hover:text-slate-800 underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
