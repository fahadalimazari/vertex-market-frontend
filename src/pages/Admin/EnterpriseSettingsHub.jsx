import { useState, useEffect } from 'react';
import { 
  FiSliders, FiPhoneCall, FiGlobe, FiDollarSign, FiFileText, 
  FiHelpCircle, FiMessageSquare, FiTruck, FiSave, FiPlus, 
  FiEdit3, FiTrash2, FiRefreshCw, FiCheck, FiX, FiActivity 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const EnterpriseSettingsHub = () => {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'languages', 'currencies', 'cms', 'faqs', 'support', 'shipping'
  const [loading, setLoading] = useState(false);

  // Data states
  const [contact, setContact] = useState({});
  const [languages, setLanguages] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [cmsPages, setCmsPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [shippingProviders, setShippingProviders] = useState([]);

  // Editing selections
  const [selectedCmsSlug, setSelectedCmsSlug] = useState('');
  const [cmsForm, setCmsForm] = useState({ title: '', content: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contRes, langRes, currRes, cmsRes, faqRes, tickRes, shipRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/contact'),
        fetch('http://localhost:5000/api/v1/languages'),
        fetch('http://localhost:5000/api/v1/currencies'),
        fetch('http://localhost:5000/api/v1/cms'),
        fetch('http://localhost:5000/api/v1/faqs'),
        fetch('http://localhost:5000/api/v1/support'),
        fetch('http://localhost:5000/api/v1/shipping/providers'),
      ]);

      const [contData, langData, currData, cmsData, faqData, tickData, shipData] = await Promise.all([
        contRes.json(), langRes.json(), currRes.json(), cmsRes.json(), faqRes.json(), tickRes.json(), shipRes.json()
      ]);

      if (contData.success) setContact(contData.data || {});
      if (langData.success) setLanguages(langData.data || []);
      if (currData.success) setCurrencies(currData.data || []);
      if (cmsData.success) {
        setCmsPages(cmsData.data || []);
        if (cmsData.data?.length > 0 && !selectedCmsSlug) {
          setSelectedCmsSlug(cmsData.data[0].slug);
          setCmsForm({ title: cmsData.data[0].title, content: cmsData.data[0].content });
        }
      }
      if (faqData.success) setFaqs(faqData.data || []);
      if (tickData.success) setTickets(tickData.data || []);
      if (shipData.success) setShippingProviders(shipData.data || []);
    } catch (error) {
      console.error('Failed fetching settings:', error);
      toast.error('Could not connect to Enterprise API server.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Save Contact Settings
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/v1/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Contact numbers & top bar hours updated across storefront!');
      } else {
        toast.error('Failed to update contact settings.');
      }
    } catch (e) {
      toast.error('Network error saving contact config.');
    }
  };

  // 2. Toggle Language Status
  const handleToggleLanguage = async (code, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/languages/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLanguages(prev => prev.map(l => l.code === code ? { ...l, isEnabled: !currentStatus } : l));
        toast.success(`Language ${code} status updated!`);
      }
    } catch (e) {
      toast.error('Could not update language state.');
    }
  };

  // 3. Update Currency Exchange Rate
  const handleUpdateCurrencyRate = async (code, newRate) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/currencies/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualOverrideRate: parseFloat(newRate), exchangeRate: parseFloat(newRate) })
      });
      const data = await res.json();
      if (data.success) {
        setCurrencies(prev => prev.map(c => c.code === code ? { ...c, exchangeRate: parseFloat(newRate) } : c));
        toast.success(`Updated exchange rate for ${code} to ${newRate}`);
      }
    } catch (e) {
      toast.error('Error saving currency exchange rate.');
    }
  };

  // 4. Save CMS Page Text
  const handleSaveCMS = async () => {
    if (!selectedCmsSlug) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/cms/${selectedCmsSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsForm)
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setCmsPages(prev => prev.map(p => p.slug === selectedCmsSlug ? { ...p, title: cmsForm.title, content: cmsForm.content } : p));
        toast.success('Policy document published directly to customer support portal!');
      } else {
        toast.error('Could not save policy page.');
      }
    } catch (e) {
      toast.error('Network failure updating CMS.');
    }
  };

  // 5. Create new FAQ
  const handleCreateFAQ = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) {
      toast.error('Provide question and answer text.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/v1/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq)
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(prev => [...prev, data.data]);
        setNewFaq({ question: '', answer: '', category: 'General' });
        toast.success('New FAQ item published instantly!');
      }
    } catch (e) {
      toast.error('Error saving FAQ item.');
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1400px]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 text-white p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6a00] block">Central Enterprise Controller</span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-0.5 flex items-center gap-2">
            <FiSliders className="text-[#ff6a00]" /> Marketplace Settings & Top Header Engine
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Configure dynamic telephone lines, multi-currency conversion overrides, RTL language dictionaries, legal CMS policies, and order tracking logistics without manual frontend redeployment.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-2xl border border-gray-700 transition-all flex items-center gap-2"
        >
          <FiRefreshCw className={loading ? 'animate-spin text-orange-400' : 'text-orange-400'} />
          <span>Refresh DB Sync</span>
        </button>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 text-xs font-black">
        {[
          { id: 'contact', label: '1. Contact & Help Info', icon: FiPhoneCall },
          { id: 'languages', label: '2. Languages & RTL', icon: FiGlobe },
          { id: 'currencies', label: '3. Currencies & Rates', icon: FiDollarSign },
          { id: 'cms', label: '4. CMS Policy Pages', icon: FiFileText },
          { id: 'faqs', label: '5. FAQ Knowledge Base', icon: FiHelpCircle },
          { id: 'support', label: '6. Support Tickets', icon: FiMessageSquare },
          { id: 'shipping', label: '7. Courier Partners', icon: FiTruck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
                isActive ? 'bg-[#ff6a00] text-white shadow-lg shadow-orange-500/20' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="text-base" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT BOARDS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* TAB 1: CONTACT SETTINGS */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Top Header & Telephone Support Popup</h3>
                <p className="text-xs text-gray-500 mt-0.5">Controls what shoppers see upon clicking "Need Help? 021-111-746-776" in the storefront navigation bar.</p>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#e65c00] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <FiSave className="text-base" /> Save Contact Settings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1.5">Primary Toll-Free Helpline</label>
                <input
                  type="text"
                  value={contact.supportPhone || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, supportPhone: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] font-mono text-gray-900 text-sm font-black outline-none"
                />
              </div>
              <div>
                <label className="block mb-1.5">Emergency After-Hours Hotline</label>
                <input
                  type="text"
                  value={contact.emergencyContact || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] font-mono text-gray-900 text-sm font-black outline-none"
                />
              </div>
              <div>
                <label className="block mb-1.5">WhatsApp Support Redirect URL</label>
                <input
                  type="text"
                  value={contact.whatsapp || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] text-gray-900 font-semibold outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1.5">Standard Working Business Hours</label>
                <input
                  type="text"
                  value={contact.workingHours || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, workingHours: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] text-gray-900 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block mb-1.5">Holiday & Weekend Roster Hours</label>
                <input
                  type="text"
                  value={contact.holidayHours || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, holidayHours: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] text-orange-600 font-bold outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block mb-1.5">Corporate Headquarters Office Address</label>
                <input
                  type="text"
                  value={contact.officeAddress || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, officeAddress: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] text-gray-800 outline-none font-medium"
                />
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: LANGUAGES & RTL */}
        {activeTab === 'languages' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900">Storefront Languages & RTL Dictionaries</h3>
              <p className="text-xs text-gray-500 mt-0.5">Manage international marketplace language choices, inspect translation completion percentages, and control Right-to-Left formatting triggers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <div key={lang._id || lang.code} className="p-5 rounded-3xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{lang.flag || '🌐'}</span>
                    <button
                      onClick={() => handleToggleLanguage(lang.code, lang.isEnabled)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${
                        lang.isEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'
                      }`}
                    >
                      {lang.isEnabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 text-base">{lang.nativeName} ({lang.name})</h4>
                    <span className="text-[11px] font-bold text-gray-400 block font-mono">Code: {lang.code} • Direction: {lang.isRtl || lang.code === 'ur' || lang.code === 'ar' ? 'RTL (Urdu/Arabic)' : 'LTR'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-gray-500">Translation Status</span>
                      <span className="text-orange-600 font-mono">{lang.translationProgress || 100}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6a00]" style={{ width: `${lang.translationProgress || 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CURRENCIES & EXCHANGE RATES */}
        {activeTab === 'currencies' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900">Global Currency Engine & Exchange Rates</h3>
              <p className="text-xs text-gray-500 mt-0.5">Define currency symbols, adjust manual exchange rate multipliers relative to USD ($1.00), and calibrate decimal rounding rules.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="p-4 pl-6">Currency Code & Symbol</th>
                    <th className="p-4">Official Currency Name</th>
                    <th className="p-4">Current Rate (vs 1 USD)</th>
                    <th className="p-4">Manual Rate Override</th>
                    <th className="p-4 text-center">Rounding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {currencies.map((c) => (
                    <tr key={c.code} className="hover:bg-gray-50/50">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6a00] font-black text-sm flex items-center justify-center border border-orange-200">
                          {c.symbol}
                        </span>
                        <strong className="font-black text-gray-900 text-sm">{c.code}</strong>
                      </td>
                      <td className="p-4 font-bold text-gray-700">{c.name}</td>
                      <td className="p-4 font-mono font-black text-green-700 text-sm">
                        {c.exchangeRate}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={c.exchangeRate}
                            onBlur={(e) => handleUpdateCurrencyRate(c.code, e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#ff6a00]"
                          />
                          <span className="text-[10px] text-gray-400 font-semibold">Save on exit</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-bold text-[10px]">
                          {c.roundingRule === 0 ? 'Integer (No Decimals)' : '2 Decimal Places'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CMS POLICY EDITOR */}
        {activeTab === 'cms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-2 border-r border-gray-100 pr-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 px-2 pb-1 block">Select Document to Edit</span>
              {cmsPages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => {
                    setSelectedCmsSlug(page.slug);
                    setCmsForm({ title: page.title, content: page.content });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                    selectedCmsSlug === page.slug ? 'bg-orange-50 text-[#ff6a00] border border-orange-200 shadow-sm font-black' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{page.title}</span>
                  <span className="font-mono text-[10px] text-gray-400">/{page.slug}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <h4 className="font-black text-gray-900 text-base">Policy Editor ({selectedCmsSlug})</h4>
                <button
                  onClick={handleSaveCMS}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <FiCheck className="text-base" /> Publish Changes
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={cmsForm.title}
                  onChange={(e) => setCmsForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3.5 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Policy Body text (Markdown & Plain text compatible)</label>
                <textarea
                  rows={12}
                  value={cmsForm.content}
                  onChange={(e) => setCmsForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 leading-relaxed outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FAQ KNOWLEDGE BASE */}
        {activeTab === 'faqs' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateFAQ} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                <FiPlus className="text-[#ff6a00]" /> Add New Customer Care FAQ Article
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-gray-700">
                <div className="sm:col-span-2">
                  <label className="block mb-1">Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., How do I exchange an item under warranty?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#ff6a00]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Support Category</label>
                  <select
                    value={newFaq.category}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white font-bold text-gray-800 outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Payments">Payments</option>
                    <option value="Returns & Refunds">Returns & Refunds</option>
                    <option value="Seller Onboarding">Seller Onboarding</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block mb-1">Answer explanation *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide clear step-by-step resolution steps..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-[#ff6a00]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  Publish Article
                </button>
              </div>
            </form>

            {/* List existing FAQs */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider">Published Support Articles ({faqs.length})</h4>
              {faqs.map((f, idx) => (
                <div key={f._id || idx} className="p-4 border border-gray-200 rounded-2xl flex items-start justify-between gap-4 bg-white hover:border-[#ff6a00] transition-colors">
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-600">{f.category}</span>
                    <h5 className="font-bold text-gray-900 text-sm">{f.question}</h5>
                    <p className="text-gray-600 font-medium">{f.answer}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-full text-[10px] shrink-0">Live</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SUPPORT TICKETS REVIEWS */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900">Customer Care Helpdesk & Support Tickets</h3>
              <p className="text-xs text-gray-500 mt-0.5">Review issues registered by shoppers via `/support`, monitor assigned engineer responses, and escalate disputes.</p>
            </div>
            {tickets.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-semibold text-xs border border-dashed rounded-3xl">
                No active unresolved support tickets found in the queue!
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t._id} className="p-5 border border-gray-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-white">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-sm">{t.subject}</span>
                        <span className="px-2 py-0.5 bg-orange-50 text-[#ff6a00] font-bold text-[10px] rounded-md border border-orange-200">{t.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">From: <strong className="text-gray-800">{t.messages?.[0]?.senderName || 'Customer'}</strong> • Opened on {new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-700 font-bold rounded-full text-xs uppercase border border-yellow-200">{t.status}</span>
                      <button className="px-4 py-2 bg-gray-900 hover:bg-[#ff6a00] text-white font-bold text-xs rounded-xl transition-colors">Inspect Ticket</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SHIPPING COURIERS */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900">Integrated Shipping & Courier Telemetry</h3>
              <p className="text-xs text-gray-500 mt-0.5">Active delivery partners synchronizing tracking waybills directly into `/track-order` timelines.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shippingProviders.map(sp => (
                <div key={sp._id || sp.code} className="p-5 rounded-3xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-gray-900 text-base flex items-center gap-2">
                      <FiTruck className="text-[#ff6a00]" /> {sp.name}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-green-200">
                      API Verified
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium space-y-1">
                    <p>Estimated Dispatch Cycle: <strong className="text-gray-900">{sp.estimatedDeliveryDays}</strong></p>
                    <p>Partner Support Helpline: <strong className="font-mono text-[#ff6a00]">{sp.contactPhone}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default EnterpriseSettingsHub;
