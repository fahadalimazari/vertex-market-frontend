import { useState, forwardRef } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const PasswordInput = forwardRef(({ 
  label = 'Password', 
  error, 
  placeholder = '••••••••', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <FiLock className="h-5 w-5" />
        </div>
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`block w-full pl-10 pr-11 py-3 text-sm text-gray-900 border ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:ring-[#ff6a00] focus:border-[#ff6a00]'
          } rounded-xl bg-white transition-all placeholder:text-gray-400 outline-none focus:ring-2`}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5" />
          ) : (
            <FiEye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-pulse">
          {error.message}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
