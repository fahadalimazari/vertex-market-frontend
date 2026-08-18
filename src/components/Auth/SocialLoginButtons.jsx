import { useState } from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SocialLoginButtons = () => {
  const { socialLogin } = useAuth();
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialClick = async (provider) => {
    setLoadingProvider(provider);
    try {
      await socialLogin(provider);
      navigate('/account');
    } catch (err) {
      // Errors handled by toast inside AuthContext
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Or continue with
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialClick('google')}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] transition-all disabled:opacity-50"
          aria-label="Continue with Google"
        >
          {loadingProvider === 'google' ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <FaGoogle className="h-4 w-4 text-[#EA4335]" />
          )}
          <span>Google</span>
        </button>

        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialClick('github')}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6a00] transition-all disabled:opacity-50"
          aria-label="Continue with GitHub"
        >
          {loadingProvider === 'github' ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <FaGithub className="h-4 w-4 text-[#24292F]" />
          )}
          <span>GitHub</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
