import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSeller } from '../../context/SellerContext';
import { 
  FiUser, FiBriefcase, FiCreditCard, FiFileText, FiCheckCircle, 
  FiUploadCloud, FiTrendingUp, FiShield, FiCpu, FiDollarSign,
  FiChevronDown, FiChevronUp, FiHelpCircle, FiCheck, FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SellerRegistration = () => {
  const { applyAsSeller } = useSeller();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    cnic: '',
    phone: '',
    email: '',
    password: '',
    
    // Step 2: Business Info
    storeName: '',
    businessType: 'Individual',
    businessCategory: 'Electronics',
    expectedProducts: '10-50 Products',
    monthlySales: 'Rs. 100,000 - 500,000',
    ntn: '',
    taxNumber: '',
    businessAddress: '',
    
    // Step 3: Bank Info
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    jazzCash: '',
    easyPaisa: '',
    
    // Step 4: Documents Upload
    cnicFront: '',
    cnicBack: '',
    businessCertificate: '',
    taxCertificate: '',
    utilityBill: '',
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create simulated URL or filename for submission
      const simUrl = `https://vertex-market.com/uploads/kyc/${Date.now()}_${file.name}`;
      setFormData(prev => ({ ...prev, [field]: simUrl }));
      toast.success(`${file.name} uploaded and verified securely!`);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('registration-form-portal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.phone || !formData.cnic) {
        toast.error('Please complete all personal information fields including password.');
        return;
      }
    }
    if (step === 2 && !formData.storeName) {
      toast.error('Store Name is required.');
      return;
    }
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('You must agree to Vertex Market Terms & Conditions before submitting.');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://vertex-market-backend.vercel.app/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'Seller',
          storeName: formData.storeName,
          cnic: formData.cnic,
          phone: formData.phone,
          businessType: formData.businessType,
          businessCategory: formData.businessCategory,
          expectedProducts: formData.expectedProducts,
          monthlySales: formData.monthlySales,
          ntn: formData.ntn,
          taxNumber: formData.taxNumber,
          businessAddress: formData.businessAddress,
          bankName: formData.bankName,
          accountTitle: formData.accountTitle,
          accountNumber: formData.accountNumber,
          iban: formData.iban,
          jazzCash: formData.jazzCash,
          easyPaisa: formData.easyPaisa,
          cnicFront: formData.cnicFront,
          cnicBack: formData.cnicBack,
          businessCertificate: formData.businessCertificate,
          taxCertificate: formData.taxCertificate,
          utilityBill: formData.utilityBill,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (applyAsSeller) {
          await applyAsSeller({ ...formData, status: 'Pending' });
        }
        toast.success(data.message || 'Application submitted successfully! Our Super Admin will review your KYC.');
        navigate('/seller/status', { state: { application: formData } });
      } else {
        toast.error(data.message || 'Registration failed. Email or ID might already be registered.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Submission failed. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Personal Info', icon: FiUser },
    { num: 2, label: 'Business & Category', icon: FiBriefcase },
    { num: 3, label: 'Bank Details', icon: FiCreditCard },
    { num: 4, label: 'Upload Documents', icon: FiFileText },
    { num: 5, label: 'Submit & Review', icon: FiCheckCircle }
  ];

  const faqs = [
    {
      q: 'How long does the seller verification process take?',
      a: 'Once you submit your KYC documents and business details, our Super Admin verification team reviews and activates approved accounts within 24 to 48 business hours.'
    },
    {
      q: 'Can I start selling without an NTN or Business Registration?',
      a: 'Yes! You can apply under the "Individual" business type using your valid National ID (CNIC) and bank account to start listing products immediately.'
    },
    {
      q: 'How and when do I receive payouts for my sales?',
      a: 'Payouts are securely transferred to your submitted Bank Account or IBAN every week for all delivered and completed orders.'
    },
    {
      q: 'What makes Vertex Market different from other eCommerce platforms?',
      a: 'We provide an integrated AI Shopping Assistant that promotes your catalog to relevant buyers, 0% listing fees for new stores, and real-time merchant analytics.'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 selection:bg-[#ff6a00] selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6a00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <FiTrendingUp className="text-base animate-pulse" /> Vertex Enterprise Marketplace Portal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              Sell to Millions. <br />
              <span className="bg-gradient-to-r from-orange-400 to-[#ff6a00] bg-clip-text text-transparent">
                Supercharged by AI.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 font-medium max-w-2xl">
              Join thousands of top brands and enterprise merchants on Vertex Market. Benefit from zero listing fees, automated AI promotions, and rapid weekly bank payouts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={scrollToForm}
                className="px-8 py-4 bg-gradient-to-r from-[#ff6a00] to-orange-600 hover:from-orange-600 hover:to-[#ff6a00] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1 sm:p-2 transform hover:-translate-y-0.5"
              >
                <span>Start Selling Now</span>
                <FiArrowRight className="text-lg" />
              </button>
              <Link
                to="/seller/status"
                className="px-8 py-4 bg-gray-800/80 hover:bg-gray-800 text-gray-200 font-bold text-sm rounded-2xl border border-gray-700 transition-all flex items-center justify-center"
              >
                Check Application Status
              </Link>
            </div>
          </div>

          {/* Hero Highlight Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md space-y-2 text-left">
              <span className="text-3xl font-black text-[#ff6a00] block">0%</span>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Commission on First 30 Days</p>
            </div>
            <div className="p-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md space-y-2 text-left">
              <span className="text-3xl font-black text-green-400 block">24h</span>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Fast KYC Verification</p>
            </div>
            <div className="p-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md space-y-2 text-left">
              <span className="text-3xl font-black text-purple-400 block">AI</span>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Automated Product Matching</p>
            </div>
            <div className="p-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md space-y-2 text-left">
              <span className="text-3xl font-black text-blue-400 block">100%</span>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Secure Direct Bank Transfers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff6a00]">Why Choose Vertex Market</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950">Engineered for Merchant Success</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100/80 hover:border-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/5 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ff6a00] mb-6 text-2xl group-hover:bg-[#ff6a00] group-hover:text-white transition-colors">
              <FiCpu />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Product Visibility</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our autonomous shopping assistant analyzes customer search intents and pushes your items to buyers who are actively searching for your catalog.
            </p>
          </div>
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100/80 hover:border-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/5 group">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 mb-6 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <FiDollarSign />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Rapid Weekly Payouts</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Never worry about cashflow bottlenecks. All settled proceeds are directly wired to your verified Bank Account or mobile wallet on a weekly basis.
            </p>
          </div>
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100/80 hover:border-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/5 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FiShield />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise KYC Protection</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our strict merchant onboarding protects our marketplace integrity, building massive trust among millions of repeat shoppers globally.
            </p>
          </div>
        </div>
      </section>

      {/* 3. REQUIREMENTS & COMMISSION SECTION */}
      <section className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-y border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Requirements checklist */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#ff6a00]">Preparation Checklist</span>
            <h3 className="text-3xl font-black text-white">What You Need to Get Started</h3>
            <p className="text-sm text-gray-400">
              Have these documents ready in digital format (JPG, PNG, or PDF) for instant upload during step 4 of the onboarding form:
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3 text-sm font-semibold text-gray-200">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400 mt-0.5"><FiCheck /></div>
                <div>
                  <span className="text-white block font-bold">Valid National ID (CNIC or Passport)</span>
                  <span className="text-xs text-gray-400 font-normal">Clear scan or photo of front and back of ID card.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm font-semibold text-gray-200">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400 mt-0.5"><FiCheck /></div>
                <div>
                  <span className="text-white block font-bold">Active Bank Account Details</span>
                  <span className="text-xs text-gray-400 font-normal">Account number or IBAN matching the applicant name for payouts.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm font-semibold text-gray-200">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400 mt-0.5"><FiCheck /></div>
                <div>
                  <span className="text-white block font-bold">Business Registration / NTN (Optional for Individuals)</span>
                  <span className="text-xs text-gray-400 font-normal">Required if applying as a Registered Company or Brand Manufacturer.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: Transparent Commission Table */}
          <div className="lg:col-span-6 bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h4 className="text-lg font-black text-white mb-2">Transparent Commission Rates</h4>
            <p className="text-xs text-gray-400 mb-6">Enjoy zero hidden charges. Commissions are only charged when an item successfully sells.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] sm:text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Product Category</th>
                    <th className="pb-3 text-right">Standard Fee</th>
                    <th className="pb-3 text-right">First 30 Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  <tr>
                    <td className="py-3.5 font-bold text-white">Electronics & Gadgets</td>
                    <td className="py-3.5 text-right font-medium text-gray-300">3.0%</td>
                    <td className="py-3.5 text-right font-black text-green-400">0% FREE</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">Fashion & Apparel</td>
                    <td className="py-3.5 text-right font-medium text-gray-300">5.0%</td>
                    <td className="py-3.5 text-right font-black text-green-400">0% FREE</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">Beauty & Personal Care</td>
                    <td className="py-3.5 text-right font-medium text-gray-300">4.0%</td>
                    <td className="py-3.5 text-right font-black text-green-400">0% FREE</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">Home, Kitchen & Living</td>
                    <td className="py-3.5 text-right font-medium text-gray-300">4.5%</td>
                    <td className="py-3.5 text-right font-black text-green-400">0% FREE</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">General Commerce & Others</td>
                    <td className="py-3.5 text-right font-medium text-gray-300">4.0%</td>
                    <td className="py-3.5 text-right font-black text-green-400">0% FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SELLER FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff6a00]">Need Answers?</span>
          <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 text-left font-bold text-sm text-gray-900 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <span>{f.q}</span>
                {openFaq === i ? <FiChevronUp className="text-[#ff6a00] text-lg" /> : <FiChevronDown className="text-gray-400 text-lg" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50/70 border-t border-gray-100 px-6 py-4 text-xs font-medium text-gray-600 leading-relaxed"
                  >
                    {f.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MULTI-STEP SELLER REGISTRATION FORM */}
      <section id="registration-form-portal" className="pt-8 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-orange-500/5">
          
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              Seller Registration Portal
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900">Apply to Open Your Store</h3>
            <p className="text-xs text-gray-500">Complete the onboarding steps below to undergo Admin KYC review and activate your dashboard.</p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 w-full -z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#ff6a00] transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
            />

            {stepsList.map((st) => {
              const Icon = st.icon;
              const isCompleted = step > st.num;
              const isCurrent = step === st.num;
              
              return (
                <div key={st.num} className="flex flex-col items-center relative z-10 bg-white px-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted ? 'bg-green-500 text-white shadow-md' : isCurrent ? 'bg-[#ff6a00] text-white shadow-lg shadow-orange-500/30 scale-110' : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    {isCompleted ? <FiCheck className="text-lg" /> : <Icon className="text-base" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase mt-2 hidden sm:block ${
                    isCurrent ? 'text-[#ff6a00]' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-base font-black text-gray-900">1. Personal Information</h4>
                  <p className="text-xs text-gray-500">We require your primary applicant identification details for legal verification.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fahad Mazari"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">National ID (CNIC / Passport) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 42101-1234567-9"
                      value={formData.cnic}
                      onChange={(e) => handleInputChange('cnic', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="merchant@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Account Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Choose a strong password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">This password will give you access to your Seller Portal once approved by Super Admin.</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: BUSINESS INFORMATION */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-base font-black text-gray-900">2. Business & Catalog Profile</h4>
                  <p className="text-xs text-gray-500">Provide details about your store brand and estimated inventory volume.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Store / Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Electronics Store"
                      value={formData.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white font-semibold text-gray-700"
                    >
                      <option value="Individual">Individual / Sole Proprietor</option>
                      <option value="Registered Company">Registered Private / Public Company</option>
                      <option value="Brand Distributor">Official Brand Distributor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Primary Category</label>
                    <select
                      value={formData.businessCategory}
                      onChange={(e) => handleInputChange('businessCategory', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white font-semibold text-gray-700"
                    >
                      <option value="Electronics">Electronics & Gadgets</option>
                      <option value="Fashion">Fashion & Apparel</option>
                      <option value="Beauty">Beauty & Health</option>
                      <option value="Home & Living">Home & Kitchen</option>
                      <option value="General Commerce">General Commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Expected Products</label>
                    <select
                      value={formData.expectedProducts}
                      onChange={(e) => handleInputChange('expectedProducts', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white font-semibold text-gray-700"
                    >
                      <option value="1-10 Products">1 - 10 Products</option>
                      <option value="10-50 Products">10 - 50 Products</option>
                      <option value="50-200 Products">50 - 200 Products</option>
                      <option value="200+ Enterprise">200+ Enterprise Catalog</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Monthly Sales Volume</label>
                    <select
                      value={formData.monthlySales}
                      onChange={(e) => handleInputChange('monthlySales', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-white font-semibold text-gray-700"
                    >
                      <option value="Under Rs. 100,000">Under Rs. 100,000</option>
                      <option value="Rs. 100,000 - 500,000">Rs. 100,000 - 500,000</option>
                      <option value="Rs. 500,000 - 2,000,000">Rs. 500,000 - 2,000,000</option>
                      <option value="Rs. 2,000,000+">Rs. 2,000,000+ Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">NTN / Business Registration No.</label>
                    <input
                      type="text"
                      placeholder="Optional for Individuals"
                      value={formData.ntn}
                      onChange={(e) => handleInputChange('ntn', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Sales Tax Registration (STRN)</label>
                    <input
                      type="text"
                      placeholder="Optional for exempt businesses"
                      value={formData.taxNumber}
                      onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Business / Warehouse Physical Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Complete street, area, and city address for returns & pickup"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: BANK DETAILS */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-base font-black text-gray-900">3. Bank & Settlement Details</h4>
                  <p className="text-xs text-gray-500">Provide your designated bank account or wallet where weekly proceeds will be deposited.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Bank Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meezan Bank / HBL / Standard Chartered"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Account Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Must match applicant or company name"
                      value={formData.accountTitle}
                      onChange={(e) => handleInputChange('accountTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Account Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 012345678910"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">IBAN (International Bank Account No.)</label>
                    <input
                      type="text"
                      placeholder="e.g. PK00MEZN0001234567890100"
                      value={formData.iban}
                      onChange={(e) => handleInputChange('iban', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">JazzCash Mobile Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="+92 300 1234567"
                      value={formData.jazzCash}
                      onChange={(e) => handleInputChange('jazzCash', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">EasyPaisa Mobile Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="+92 333 1234567"
                      value={formData.easyPaisa}
                      onChange={(e) => handleInputChange('easyPaisa', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: DOCUMENTS UPLOAD */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-base font-black text-gray-900">4. KYC Documents Upload</h4>
                  <p className="text-xs text-gray-500">Attach scans of required identification. Our Super Admin reviews these to prevent fraud.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* CNIC Front */}
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#ff6a00] rounded-2xl p-5 text-center transition-colors bg-gray-50/50 relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('cnicFront', e)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud className="text-3xl text-gray-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-800 block">CNIC / Passport (Front) *</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formData.cnicFront ? `✅ ${formData.cnicFront.split('/').pop()}` : 'Click or drop scan (JPG, PNG, PDF)'}</p>
                  </div>

                  {/* CNIC Back */}
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#ff6a00] rounded-2xl p-5 text-center transition-colors bg-gray-50/50 relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('cnicBack', e)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud className="text-3xl text-gray-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-800 block">CNIC / Passport (Back) *</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formData.cnicBack ? `✅ ${formData.cnicBack.split('/').pop()}` : 'Click or drop scan (JPG, PNG, PDF)'}</p>
                  </div>

                  {/* Business Certificate */}
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#ff6a00] rounded-2xl p-5 text-center transition-colors bg-gray-50/50 relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('businessCertificate', e)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud className="text-3xl text-gray-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-800 block">Business Certificate / NTN</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formData.businessCertificate ? `✅ ${formData.businessCertificate.split('/').pop()}` : 'Optional for Individual accounts'}</p>
                  </div>

                  {/* Utility Bill */}
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#ff6a00] rounded-2xl p-5 text-center transition-colors bg-gray-50/50 relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('utilityBill', e)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud className="text-3xl text-gray-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-800 block">Proof of Address / Utility Bill</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formData.utilityBill ? `✅ ${formData.utilityBill.split('/').pop()}` : 'Electricity or Gas bill within 3 months'}</p>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 5: SUBMIT & REVIEW */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-base font-black text-gray-900">5. Review & Submit Application</h4>
                  <p className="text-xs text-gray-500">Please review your submitted data before sending it to Super Admin for approval.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="font-bold text-gray-500 block uppercase text-[10px]">Applicant Name:</span> <strong className="text-gray-900">{formData.fullName}</strong></div>
                    <div><span className="font-bold text-gray-500 block uppercase text-[10px]">Store Title:</span> <strong className="text-gray-900">{formData.storeName}</strong></div>
                    <div><span className="font-bold text-gray-500 block uppercase text-[10px]">Category:</span> <strong className="text-gray-900">{formData.businessCategory} ({formData.expectedProducts})</strong></div>
                    <div><span className="font-bold text-gray-500 block uppercase text-[10px]">Bank Name:</span> <strong className="text-gray-900">{formData.bankName} ({formData.accountNumber})</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-xs text-gray-700 flex items-start gap-3">
                  <FiShield className="text-[#ff6a00] text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Enterprise Security Assurance</p>
                    <p className="text-[11px] text-gray-600">Your identification documents and bank details are highly encrypted. Only verified Super Admins have permission to inspect KYC proofs.</p>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff6a00] focus:ring-[#ff6a00]"
                  />
                  <span>
                    I confirm that all information and KYC documents provided above are truthful and agree to Vertex Market's <a href="#terms" className="text-[#ff6a00] underline">Seller Terms & Commission Agreements</a>.
                  </span>
                </label>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
              ) : <div />}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-[#ff6a00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                >
                  Continue Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className={`px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-green-600/25 transition-all flex items-center gap-2 ${
                    isSubmitting || !agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  <FiCheckCircle className="text-base" />
                </button>
              )}
            </div>

          </form>

        </div>
      </section>

    </div>
  );
};

export default SellerRegistration;
