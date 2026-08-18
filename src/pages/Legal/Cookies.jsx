const Cookies = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Cookies Policy</h1>
          <p className="text-gray-500 text-lg">Understanding how we use cookies to improve your experience.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-sm max-w-none text-gray-600">
          
          <h3 className="text-xl font-bold text-gray-900 mt-0">What are Cookies?</h3>
          <p>
            Cookies are small text files that are stored on your device when you visit Vertex Market. They help the platform function properly and provide us with insights into how you use the site.
          </p>

          <h3 className="text-xl font-bold text-gray-900">1. Essential Cookies</h3>
          <p>
            These cookies are strictly necessary to provide you with services available through our website. They include:
          </p>
          <ul>
            <li><strong>Authentication & Session:</strong> Keeping you securely logged in while you browse.</li>
            <li><strong>Cart & Checkout:</strong> Remembering the items you've added to your cart as you navigate between pages.</li>
            <li><strong>Security:</strong> Detecting and preventing fraudulent login attempts.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900">2. Analytics & Performance Cookies</h3>
          <p>
            We use these cookies to collect information about how visitors interact with our platform. This helps us optimize performance, identify bugs, and improve the overall user experience. Data collected includes page visits, load times, and click patterns. This data is anonymized.
          </p>

          <h3 className="text-xl font-bold text-gray-900">3. Preferences & Functionality</h3>
          <p>
            These cookies allow the website to remember choices you make (such as your preferred language, region, or currency) and provide enhanced, more personal features.
          </p>

          <h3 className="text-xl font-bold text-gray-900">Managing Your Preferences</h3>
          <p>
            You can configure your browser to reject all cookies or to indicate when a cookie is being sent. However, please note that disabling essential cookies will prevent core functionalities like logging in and adding items to your cart from working correctly.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Cookies;
