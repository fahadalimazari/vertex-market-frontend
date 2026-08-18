import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiHelpCircle, FiFileText, FiRefreshCw, FiShield, 
  FiTruck, FiCreditCard, FiMessageSquare, FiSend, FiPlusCircle, 
  FiCheckCircle, FiPhoneCall, FiChevronDown, FiChevronUp, FiPaperclip 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const SupportCenter = () => {
  const [faqs, setFaqs] = useState([]);
  const [cmsPages, setCmsPages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs', 'ticket', or dynamic CMS slug like 'return-policy'
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Order Delay & Shipping',
    priority: 'Normal',
    customerName: '',
    customerEmail: '',
    message: '',
    attachment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [faqsRes, cmsRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/faqs'),
          fetch('http://localhost:5000/api/v1/cms')
        ]);
        const faqsData = await faqsRes.json();
        const cmsData = await cmsRes.json();

        if (faqsData.success) setFaqs(faqsData.data || []);
        if (cmsData.success) setCmsPages(cmsData.data || []);
      } catch (error) {
        console.error('Error fetching support content:', error);
        toast.error('Could not connect to support database.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }, [faqs, searchQuery]);

  const activeCmsPage = useMemo(() => {
    return cmsPages.find(p => p.slug === activeTab);
  }, [cmsPages, activeTab]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulatedUrl = `https://vertex-market.com/attachments/${Date.now()}_${file.name}`;
      setTicketForm(prev => ({ ...prev, attachment: simulatedUrl }));
      toast.success(`Attachment "${file.name}" uploaded successfully!`);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message || !ticketForm.customerEmail) {
      toast.error('Please complete all required ticket fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm)
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success(data.message || 'Ticket registered! An agent has been assigned.');
        setTicketForm({ subject: '', category: 'Order Delay & Shipping', priority: 'Normal', customerName: '', customerEmail: '', message: '', attachment: '' });
      } else {
        toast.error(data.message || 'Failed to generate ticket.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred while submitting ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 font-bold text-gray-600 text-sm">
          <FiRefreshCw className="text-2xl animate-spin text-[#ff6a00]" />
          <span>Loading Enterprise Support Knowledge Base...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#ff6a00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <FiHelpCircle className="text-base" /> Vertex Marketplace Customer Care
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            How can we assist you today?
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Explore our instant knowledge base, verify legal store terms & warranty protocols, or open an interactive ticket directly with our engineering & logistics agents.
          </p>
          
          {/* Live Search Bar */}
          <div className="max-w-xl mx-auto relative pt-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'faqs') setActiveTab('faqs');
              }}
              placeholder="Search answers for shipping costs, order tracking, warranties or returns..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 text-gray-900 text-xs font-bold shadow-xl outline-none focus:ring-2 focus:ring-[#ff6a00] placeholder-gray-500 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: SIDEBAR TAB NAVIGATION */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-3 py-1 block">
              Support Modules & Legal
            </span>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                activeTab === 'faqs' 
                  ? 'bg-[#ff6a00] text-white shadow-md shadow-orange-500/20 font-black' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5"><FiHelpCircle className="text-base" /> FAQs & Help Center</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 font-black">{faqs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('ticket')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                activeTab === 'ticket' 
                  ? 'bg-[#ff6a00] text-white shadow-md shadow-orange-500/20 font-black' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5"><FiPlusCircle className="text-base" /> Open Support Ticket</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-black animate-pulse">24/7 Live</span>
            </button>

            <div className="border-t border-gray-100 my-2 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-3 pb-1 block">
                CMS Policy Documents
              </span>
              {cmsPages.map(page => (
                <button
                  key={page._id || page.slug}
                  onClick={() => setActiveTab(page.slug)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors mb-1 ${
                    activeTab === page.slug ? 'bg-orange-50 text-[#ff6a00] border border-orange-200/80' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiFileText className={activeTab === page.slug ? 'text-[#ff6a00]' : 'text-gray-400'} />
                  <span>{page.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Contact Help Box */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-3xl text-white border border-gray-800 space-y-4 shadow-lg">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <FiPhoneCall className="text-[#ff6a00]" /> Need Instant Agent Help?
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              If your inquiry involves immediate shipment dispatch stoppage or payment disputes, call our toll-free hotline:
            </p>
            <a href="tel:021111746776" className="block text-center py-3 bg-gray-800 hover:bg-gray-700 text-white font-black font-mono text-base rounded-2xl border border-gray-700 transition-all shadow-inner">
              021-111-746-776
            </a>
          </div>
        </aside>

        {/* RIGHT: CONTENT BODY (FAQS, TICKET FORM, OR CMS PAGE) */}
        <main className="lg:col-span-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm min-h-[500px]">
            
            {/* VIEW 1: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Knowledge Base & FAQs</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Instant solutions for order deliveries, returns, settlements, and warranty claims.</p>
                  </div>
                  {searchQuery && (
                    <span className="text-xs font-bold bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-200">
                      Filtering "{searchQuery}"
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <FiHelpCircle className="text-4xl mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold">No FAQ articles match your search term.</p>
                      <button onClick={() => setSearchQuery('')} className="mt-2 text-xs font-bold text-[#ff6a00] underline">Reset Filter</button>
                    </div>
                  ) : (
                    filteredFaqs.map((faq, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">{faq.category}</span>
                            <span>{faq.question}</span>
                          </span>
                          {openFaqIndex === idx ? <FiChevronUp className="text-[#ff6a00] text-lg shrink-0" /> : <FiChevronDown className="text-gray-400 text-lg shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {openFaqIndex === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-gray-50/80 border-t border-gray-100 px-6 py-4 text-xs text-gray-600 font-medium leading-relaxed"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: CREATE SUPPORT TICKET */}
            {activeTab === 'ticket' && (
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FiMessageSquare className="text-[#ff6a00]" /> Open an Interactive Support Ticket
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Submit your query below. Our automated dispatcher assigns priority tickets directly to live engineers & logistics managers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={ticketForm.customerName}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="e.g. Fahad Mazari"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={ticketForm.customerEmail}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="shopper@domain.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Ticket Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white font-bold text-gray-800"
                    >
                      <option value="Order Delay & Shipping">Order Delay & Shipping Checkpoint</option>
                      <option value="Refund & Return Claim">Refund & Return Claim</option>
                      <option value="Product Warranty Defect">Product Warranty Defect</option>
                      <option value="Seller Store Dispute">Seller Store Dispute</option>
                      <option value="Technical Bug / Account Issue">Technical Bug / Account Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Urgency & Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white font-bold text-gray-800"
                    >
                      <option value="Normal">Normal (Response within 12 hours)</option>
                      <option value="Urgent">Urgent / High (Response within 2 hours)</option>
                      <option value="Low">Low (General suggestion or query)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Ticket Subject *</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Delay in delivery for order VTX-89021"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Detailed Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Please specify order item details, timestamps, or courier remarks..."
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium leading-relaxed"
                  />
                </div>

                {/* Attachment Upload Box */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Attach Supporting Photo or Invoice (Optional)</span>
                  <label className="flex items-center justify-between p-3.5 border border-dashed border-gray-300 hover:border-[#ff6a00] rounded-2xl bg-gray-50 cursor-pointer transition-colors">
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                    <span className="text-xs text-gray-600 flex items-center gap-2 font-semibold">
                      <FiPaperclip className="text-lg text-[#ff6a00]" />
                      {ticketForm.attachment ? `Attached: ${ticketForm.attachment.split('/').pop()}` : 'Select screenshot or invoice file (JPG, PNG, PDF)'}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 font-bold text-[11px]">Browse File</span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#ff6a00] to-orange-600 hover:from-orange-600 hover:to-[#ff6a00] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
                  >
                    <span>{submitting ? 'Registering Ticket...' : 'Submit Support Ticket'}</span>
                    <FiSend className="text-base" />
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 3: DYNAMIC CMS PAGE */}
            {activeTab !== 'faqs' && activeTab !== 'ticket' && activeCmsPage && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-[10px] font-bold text-[#ff6a00] uppercase tracking-widest block">Vertex Market Enterprise Policy</span>
                  <h2 className="text-2xl font-black text-gray-900 mt-0.5">{activeCmsPage.title}</h2>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {activeCmsPage.content}
                </div>
                <div className="pt-6 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Policy Document ID: {activeCmsPage._id || activeCmsPage.slug}</span>
                  <span>Last verified by Super Admin Compliance</span>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};

export default SupportCenter;
