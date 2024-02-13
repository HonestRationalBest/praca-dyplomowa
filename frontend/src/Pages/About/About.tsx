import React from "react";

export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">About Us</h1>
      <p className="text-md text-gray-600 mb-4">
        Our application is designed to simplify financial management for
        individuals and businesses alike. With a user-friendly interface and a
        comprehensive set of tools, users can easily track their income,
        expenses, and overall budget.
      </p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Features</h2>
      <ul className="list-disc pl-5 mb-4 text-gray-600">
        <li>Seamless category management for income and expenses</li>
        <li>Interactive financial reporting dashboards</li>
        <li>Real-time updates</li>
        <li>Secure data protection and backup options</li>
        <li>Multi-platform accessibility</li>
      </ul>
    </div>
  );
};
