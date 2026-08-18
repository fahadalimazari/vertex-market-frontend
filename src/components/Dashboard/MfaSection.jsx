import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSmartphone, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { authService } from '../../services/auth/authService';
import { sessionService } from '../../services/auth/sessionService';

const MfaSection = () => {
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [token, setToken] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  useEffect(() => {
    // Check initial status from user profile
    const fetchStatus = async () => {
      try {
        const user = await authService.getProfile();
        setIsMfaEnabled(user.isMfaEnabled || false);
      } catch (error) {
        console.error('Failed to fetch MFA status', error);
      }
    };
    fetchStatus();
  }, []);

  const handleSetup = async () => {
    try {
      setIsLoading(true);
      const res = await authService.setupMfa();
      setSetupData(res.data);
    } catch (error) {
      toast.error(error.message || 'Failed to initialize MFA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Please enter the verification code');
    
    try {
      setIsLoading(true);
      await authService.verifyMfa(token);
      toast.success('MFA enabled successfully');
      setIsMfaEnabled(true);
      setSetupData(null);
      setToken('');
    } catch (error) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async (e) => {
    e.preventDefault();
    if (!currentPassword || !token) return toast.error('Please fill in all fields');
    
    try {
      setIsLoading(true);
      await authService.disableMfa(currentPassword, token);
      toast.success('MFA disabled successfully');
      setIsMfaEnabled(false);
      setShowDisableModal(false);
      setCurrentPassword('');
      setToken('');
    } catch (error) {
      toast.error(error.message || 'Failed to disable MFA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="bg-orange-50 p-2 rounded-xl text-[#ff6a00]">
          <FiShield className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isMfaEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
              {isMfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-[13px] text-gray-500">
            Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.
          </p>
        </div>
        
        <div className="shrink-0">
          {!isMfaEnabled ? (
            <button
              onClick={handleSetup}
              disabled={isLoading || setupData}
              className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors text-[14px]"
            >
              {isLoading ? 'Loading...' : 'Enable MFA'}
            </button>
          ) : (
            <button
              onClick={() => setShowDisableModal(true)}
              className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors text-[14px]"
            >
              Disable MFA
            </button>
          )}
        </div>
      </div>

      {setupData && !isMfaEnabled && (
        <div className="mt-6 p-6 border border-gray-100 rounded-2xl">
          <h4 className="font-bold text-gray-900 mb-4">Configure Authenticator App</h4>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0 bg-white p-2 border border-gray-200 rounded-xl">
              <img src={setupData.qrCodeUrl} alt="MFA QR Code" className="w-40 h-40" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] text-gray-600 mb-4">
                1. Install an authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator) on your mobile device.<br/><br/>
                2. Scan this QR code with the app.<br/><br/>
                3. Enter the 6-digit code generated by the app below to verify.
              </p>
              
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="000000"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none"
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#ff6a00] text-white px-6 py-2.5 rounded-xl font-bold hover:brightness-95 transition-all text-[14px]"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => setSetupData(null)}
                  className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors text-[14px]"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Disable MFA</h3>
              <button onClick={() => setShowDisableModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleDisable} className="flex flex-col gap-4">
              <p className="text-[14px] text-gray-600 mb-2">
                Disabling MFA will make your account less secure. To confirm, please enter your password and a current authenticator code.
              </p>
              
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Current Password</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none" 
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Authenticator Code</label>
                <input 
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#ff6a00] focus:bg-white rounded-xl text-[14px] transition-colors focus:outline-none" 
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowDisableModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  {isLoading ? 'Disabling...' : 'Confirm Disable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MfaSection;
