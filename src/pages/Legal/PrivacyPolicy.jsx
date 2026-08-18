const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-lg">How we collect, use, and protect your data.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm max-w-none text-gray-600">
          
          <h3 className="text-xl font-bold text-gray-900 mt-0">1. Information We Collect</h3>
          <p>
            <strong>Account Information:</strong> When you register, we collect your name, email address, phone number, and delivery addresses.
            <br />
            <strong>Order Information:</strong> We keep records of your purchases, browsing history, wishlists, and interactions with our sellers.
            <br />
            <strong>Payment Information:</strong> Transactions are securely processed by our payment partners (e.g., Stripe, PayPal). We do not store full credit card numbers on our servers.
          </p>

          <h3 className="text-xl font-bold text-gray-900">2. How Data is Used</h3>
          <p>
            Your data is used strictly to provide and improve the Vertex Market experience:
          </p>
          <ul>
            <li>To process and fulfill your orders.</li>
            <li>To provide personalized AI-driven product recommendations.</li>
            <li>To communicate shipping updates and promotional offers (if opted-in).</li>
            <li>To prevent fraud, abuse, and secure your account.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900">3. Analytics & AI Features</h3>
          <p>
            We utilize anonymized interaction data to train our AI recommendation engines. This helps us suggest more relevant products to you based on your browsing behavior.
          </p>

          <h3 className="text-xl font-bold text-gray-900">4. Third-Party Services</h3>
          <p>
            We may share necessary data with third parties exclusively for operational purposes:
          </p>
          <ul>
            <li><strong>Sellers:</strong> Receive your shipping address and name to fulfill your order.</li>
            <li><strong>Logistics Partners:</strong> Receive your contact details for delivery updates.</li>
            <li><strong>Payment Gateways:</strong> securely process your financial data.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900">5. Data Security</h3>
          <p>
            We implement industry-standard encryption protocols (including HTTPS/SSL) to protect your personal data during transmission and at rest in our databases.
          </p>

          <h3 className="text-xl font-bold text-gray-900">6. User Rights</h3>
          <p>
            You have the right to access, correct, or request deletion of your personal data. You can manage your preferences directly from your Account Dashboard.
          </p>

          <h3 className="text-xl font-bold text-gray-900">7. Contact Information</h3>
          <p>
            If you have any questions regarding our Privacy Policy or data handling, please contact our Data Protection Officer at: <br />
            <a href="mailto:privacy@vertexmarket.com" className="text-[#ff6a00] font-bold">privacy@vertexmarket.com</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
