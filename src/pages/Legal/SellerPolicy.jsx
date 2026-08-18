const SellerPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Seller Policy</h1>
          <p className="text-gray-500 text-lg">Rules and guidelines for merchants operating on Vertex Market.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        
        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-4">Seller Requirements</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Registration:</strong> All sellers must complete KYC documentation and business verification before their store goes live.</li>
            <li><strong>Verification:</strong> Vertex Market reserves the right to request additional documentation at any time to verify inventory authenticity.</li>
            <li><strong>Product Standards:</strong> Sellers must only list products they have the legal right and authorization to sell.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-4">Product Rules</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Accurate Descriptions:</strong> Product listings must accurately describe the item condition, specifications, and warranty.</li>
            <li><strong>Genuine Products:</strong> Selling counterfeit, replica, or unauthorized branded products is strictly prohibited.</li>
            <li><strong>Pricing:</strong> Sellers must maintain fair pricing. Price gouging during emergencies is not allowed.</li>
            <li><strong>Images:</strong> Product images must be high-quality and accurately represent the actual product being sold.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-4">Order Rules</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Processing:</strong> Orders must be processed and handed over to logistics within the promised dispatch window (typically 24-48 hours).</li>
            <li><strong>Shipping:</strong> Sellers are responsible for secure packaging to prevent damage during transit.</li>
            <li><strong>Cancellation:</strong> High seller-initiated cancellation rates will negatively impact seller metrics and store visibility.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-4">Seller Performance</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Customer Reviews:</strong> Stores with consistently low ratings may face suspension or rank demotion in search results.</li>
            <li><strong>Order Fulfillment:</strong> Late shipments and high return rates will trigger account reviews.</li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-3xl border border-red-200 shadow-sm">
          <h2 className="text-xl font-black text-red-700 mb-4">Violations</h2>
          <p className="text-red-900 mb-4 text-sm font-medium">Violating marketplace policies may result in immediate store suspension, frozen funds, or permanent ban.</p>
          <ul className="list-disc pl-5 space-y-2 text-red-800 text-sm">
            <li>Fraudulent transactions or review manipulation.</li>
            <li>Selling counterfeit or illegal products.</li>
            <li>Misleading listings or bait-and-switch tactics.</li>
            <li>Taking transactions off-platform to avoid fees.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default SellerPolicy;
