import { FiRefreshCcw, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ReturnPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Return Policy</h1>
          <p className="text-gray-500 text-lg">Everything you need to know about returning a product on Vertex Market.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        
        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
            <FiCheckCircle className="text-[#ff6a00]" /> Return Eligibility
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Products can be returned if they are defective, damaged, missing parts, or entirely incorrect. The product must be unused, in its original packaging, and accompanied by all original accessories and manuals.
          </p>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
            <FiClock className="text-[#ff6a00]" /> Return Window
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You have a standard <strong>14-day window</strong> from the date of delivery to initiate a return request. Certain certified refurbished electronics may have extended 30-day return windows as specified on their product pages.
          </p>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
            <FiRefreshCcw className="text-[#ff6a00]" /> How to Return
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded bg-gray-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div><p className="text-gray-600">Go to <strong>My Orders</strong> in your dashboard.</p></div>
            <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded bg-gray-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div><p className="text-gray-600">Select the specific order and item you wish to return.</p></div>
            <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded bg-gray-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div><p className="text-gray-600">Click <strong>Request Return</strong> and provide a reason (and photos if applicable).</p></div>
            <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded bg-gray-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</div><p className="text-gray-600">Wait for Seller/Admin Review (typically 24-48 hours).</p></div>
            <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded bg-gray-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">5</div><p className="text-gray-600">Once approved, drop off the package or wait for courier pickup.</p></div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
            <FiXCircle className="text-red-500" /> Non-Returnable Items
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Digital goods (software, licenses, game keys).</li>
            <li>Perishable items and grocery products.</li>
            <li>Personal hygiene and intimate apparel products.</li>
            <li>Customized or strictly made-to-order enterprise equipment.</li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-3xl border border-gray-800 text-white shadow-lg">
          <h2 className="text-xl font-black mb-4">Refund Information</h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            Once the returned item is received and inspected by the seller, your refund will be processed automatically. 
            Funds will be credited back to your original payment method (Credit Card, PayPal, Stripe) within <strong>3-7 business days</strong> depending on your bank's processing time.
          </p>
        </section>

      </div>
    </div>
  );
};

export default ReturnPolicy;
