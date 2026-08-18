const TermsOfService = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 text-lg">The rules that govern your use of Vertex Market.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm max-w-none text-gray-600">
          
          <h3 className="text-xl font-bold text-gray-900 mt-0">1. Customer Terms</h3>
          <p>
            <strong>Account Usage:</strong> You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to make purchases on Vertex Market.
            <br />
            <strong>Orders & Payments:</strong> By placing an order, you agree to pay the stated price, including applicable taxes and shipping fees. Vertex Market acts as an intermediary for transactions between you and third-party sellers.
            <br />
            <strong>Product Listings & Reviews:</strong> You agree to provide honest and accurate reviews. Abusive language or review manipulation is strictly prohibited.
          </p>

          <h3 className="text-xl font-bold text-gray-900">2. Seller Terms</h3>
          <p>
            <strong>Seller Responsibilities:</strong> Sellers are independent contractors. Sellers must comply with all local commerce laws, ensure product authenticity, and handle customer data securely in accordance with our Privacy Policy.
            <br />
            <strong>Order Fulfillment:</strong> Sellers must dispatch items within the designated timeframe. Failure to do so may result in account penalties.
          </p>

          <h3 className="text-xl font-bold text-gray-900 text-red-600">3. Prohibited Activities</h3>
          <p>
            Users (both buyers and sellers) are strictly forbidden from:
          </p>
          <ul>
            <li>Engaging in fraud, chargeback abuse, or payment manipulation.</li>
            <li>Selling, distributing, or purchasing fake, counterfeit, or prohibited items.</li>
            <li>Harassing other users or customer support agents.</li>
            <li>Using automated bots to scrape platform data without explicit API authorization.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900">4. Platform Rights</h3>
          <p>
            Vertex Market provides the platform technology but is not the manufacturer of third-party goods sold. We reserve the right to suspend or terminate any account that violates these Terms of Service without prior notice. We also reserve the right to modify these terms at any time; continued use constitutes acceptance of the new terms.
          </p>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
