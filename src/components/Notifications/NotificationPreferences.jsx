import { useNotifications } from '../../context/NotificationContext';
import { FiMail, FiBell, FiMessageSquare } from 'react-icons/fi';

const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useNotifications();

  const handleToggle = (key) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-gray-900">Notification Preferences</h3>
        <p className="text-xs text-gray-500 mt-1">Configure how and when you receive communications from Vertex Market.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Settings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
            Categories Configuration
          </h4>

          {[
            { key: 'orders', label: 'Order Updates', desc: 'Alerts about placements, packed items, shipping and delivery.' },
            { key: 'payments', label: 'Payment Receipts', desc: 'Alerts regarding invoices, successful payments, and refunds.' },
            { key: 'promotions', label: 'Promotional Offers', desc: 'Discounts, seasonal sales, and custom promotion alerts.' },
            { key: 'wishlist', label: 'Wishlist & Price Drops', desc: 'Notifications when saved wishlist products decrease in price.' },
            { key: 'aiSuggestions', label: 'AI Shopping Advice', desc: 'Receive price recommendations and custom shopping recommendations.' },
            { key: 'security', label: 'Security & Account alerts', desc: 'Crucial account recovery, password changes, and login warnings.' },
            { key: 'newsletter', label: 'Marketing Newsletters', desc: 'Regular newsletters and brand news digests.' },
          ].map((item) => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!preferences[item.key]}
                onChange={() => handleToggle(item.key)}
                className="mt-1 h-4.5 w-4.5 rounded border-gray-300 text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">{item.label}</span>
                <span className="text-[11px] text-gray-500">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Channel Settings (Email, Push, SMS) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
            Delivery Methods (Future Ready)
          </h4>

          {[
            { key: 'emailEnabled', label: 'Email Notifications', desc: 'Receive summaries directly to your inbox.', icon: FiMail },
            { key: 'pushEnabled', label: 'Web Push Messages', desc: 'Receive live alerts within the browser window.', icon: FiBell },
            { key: 'smsEnabled', label: 'SMS Warnings (Placeholder)', desc: 'Mobile alerts sent directly via phone network.', icon: FiMessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-100">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{item.label}</span>
                    <span className="text-[10px] text-gray-400">{item.desc}</span>
                  </div>
                </div>

                {/* Switch toggle styled button */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    preferences[item.key] ? 'bg-[#ff6a00]' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={!!preferences[item.key]}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences[item.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default NotificationPreferences;
