import React from "react";
import { ShoppingBag, ShieldCheck, Truck, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[4%]">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Founded in {new Date().getFullYear()}, we're on a mission to redefine
          online shopping by combining exceptional products with unparalleled
          customer service.
        </p>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <ShoppingBag className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-3">Curated Selection</h3>
            <p className="text-gray-600">
              We handpick every product in our collection to ensure quality and
              value for our customers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-3">Secure Shopping</h3>
            <p className="text-gray-600">
              Your security is our priority. We use industry-leading encryption
              to protect your data.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <Truck className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-3">Fast Delivery</h3>
            <p className="text-gray-600">
              We partner with reliable logistics providers to get your orders to
              you quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Meet The Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              bio: "E-commerce veteran with 10+ years of experience in digital retail.",
            },
            {
              name: "Sarah Chen",
              role: "Head of Merchandising",
              bio: "Product expert with a keen eye for quality and trends.",
            },
            {
              name: "Michael Rodriguez",
              role: "Technology Lead",
              bio: "Ensures our platform is fast, secure, and easy to use.",
            },
            {
              name: "Priya Patel",
              role: "Customer Experience",
              bio: "Dedicated to making every interaction exceptional.",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                {/* Placeholder for team member photo */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-blue-600 mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Commitment */}
      <section className="bg-blue-50 rounded-xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Our Promise to You
          </h2>
          <p className="text-gray-600 mb-6">
            We're committed to providing an exceptional shopping experience from
            start to finish. If you're not completely satisfied, we'll make it
            right.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Contact Our Team
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
              Read Our Reviews
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
