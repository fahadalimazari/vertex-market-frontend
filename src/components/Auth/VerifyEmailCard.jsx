import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiCheckCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const VerifyEmailCard = () => {
  const { verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const email = location.state?.email || 'your-email@example.com';

  // Handles Cooldown Timer
  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await verifyEmail('dummy-verification-token');
      setIsVerified(true);
    } catch (err) {
      // Handled in Context
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendVerification(email);
      setCooldown(60); // 60 seconds cooldown
    } catch (err) {
      // Handled in Context
    }
  };

  if (isVerified) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-50 p-4 text-green-500 animate-pulse">
            <FiCheckCircle className="h-12 w-12" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Account Activated!
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Thank you! Your email <strong className="text-gray-900">{email}</strong> has been successfully verified. You can now log in to access your dashboard.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/auth/login"
            className="flex w-full justify-center items-center rounded-xl bg-[#ff6a00] px-4 py-3 text-sm font-bold text-white hover:bg-[#e05e00] transition-colors shadow-md hover:shadow-lg"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center sm:text-left">
      <div className="flex justify-center sm:justify-start">
        <div className="rounded-full bg-orange-50 p-3.5 text-[#ff6a00]">
          <FiMail className="h-8 w-8" />
        </div>
      </div>

      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Verify Your Email
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
          We've sent a verification email to <strong className="text-gray-900">{email}</strong>. Please check your inbox and click the verification button below or verify your account.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          disabled={isVerifying}
          onClick={handleVerify}
          className="flex w-full justify-center items-center rounded-xl bg-[#ff6a00] px-4 py-3 text-sm font-bold text-white hover:bg-[#e05e00] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 transition-all disabled:opacity-75 shadow-md"
        >
          {isVerifying ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Verify Email Address (Demo)'
          )}
        </button>

        <button
          type="button"
          disabled={cooldown > 0}
          onClick={handleResend}
          className={`flex w-full justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <FiRefreshCw className={`h-4 w-4 ${cooldown > 0 ? 'animate-spin' : ''}`} />
          <span>
            {cooldown > 0 ? `Resend Email in ${cooldown}s` : 'Resend Verification Email'}
          </span>
        </button>
      </div>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailCard;
