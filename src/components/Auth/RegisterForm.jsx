import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiUser, FiPhone, FiShoppingBag, FiBriefcase } from 'react-icons/fi';
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import SocialLoginButtons from './SocialLoginButtons';

const RegisterForm = () => {
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState(null); // null -> 'customer' or 'seller'

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const passwordVal = watch('password', '');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'customer'
      });
      // Skip verify-email and login the user automatically
      await login(data.email, data.password);
      navigate('/account');
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === 'seller') {
      // Redirect to the enterprise seller wizard
      navigate('/seller/register');
    } else {
      setRole('customer');
    }
  };

  if (!role) {
    return (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Join Vertex Market
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            How would you like to join our marketplace?
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Customer Option */}
          <button
            onClick={() => handleRoleSelect('customer')}
            className="w-full flex items-center justify-between p-5 border-2 border-gray-100 hover:border-[#ff6a00] rounded-2xl bg-white hover:bg-orange-50/30 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-[#ff6a00]">
                <FiShoppingBag className="text-xl text-[#ff6a00] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">I am a Customer</h3>
                <p className="text-xs text-gray-500 mt-1">Buy products, earn rewards, track orders</p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#ff6a00]" />
          </button>

          {/* Seller Option */}
          <button
            onClick={() => handleRoleSelect('seller')}
            className="w-full flex items-center justify-between p-5 border-2 border-gray-100 hover:border-indigo-500 rounded-2xl bg-white hover:bg-indigo-50/30 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-600">
                <FiBriefcase className="text-xl text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">I am a Seller / Brand</h3>
                <p className="text-xs text-gray-500 mt-1">Setup shop, add products, manage sales</p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-600" />
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-semibold text-[#ff6a00] hover:text-[#e05e00] transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  // Render Customer Registration Flow
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setRole(null)} className="text-sm font-bold text-[#ff6a00] hover:underline">
            &larr; Change Role
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Create Customer Account
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Get started with Vertex Market and explore premium deals.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiUser className="h-5 w-5" />
            </div>
            <input
              type="text"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 border ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-[#ff6a00] focus:border-[#ff6a00]'
              } rounded-xl bg-white transition-all placeholder:text-gray-400 outline-none focus:ring-2`}
              placeholder="Fahad Mazari"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters long',
                },
              })}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiMail className="h-5 w-5" />
            </div>
            <input
              type="email"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 border ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-[#ff6a00] focus:border-[#ff6a00]'
              } rounded-xl bg-white transition-all placeholder:text-gray-400 outline-none focus:ring-2`}
              placeholder="name@example.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone Number
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiPhone className="h-5 w-5" />
            </div>
            <input
              type="tel"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 border ${
                errors.phone 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-[#ff6a00] focus:border-[#ff6a00]'
              } rounded-xl bg-white transition-all placeholder:text-gray-400 outline-none focus:ring-2`}
              placeholder="03001234567"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+() -]{10,15}$/,
                  message: 'Invalid phone number format',
                },
              })}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            disabled={isSubmitting}
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              validate: {
                hasUpper: (val) => /[A-Z]/.test(val) || 'Must contain at least one uppercase letter',
                hasLower: (val) => /[a-z]/.test(val) || 'Must contain at least one lowercase letter',
                hasNumber: (val) => /[0-9]/.test(val) || 'Must contain at least one number',
                hasSpecial: (val) => /[@$!%*?&]/.test(val) || 'Must contain at least one special character (@$!%*?&)',
              }
            })}
          />
          {/* Live Password Strength Meter */}
          <PasswordStrengthMeter password={passwordVal} />
        </div>

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          disabled={isSubmitting}
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === passwordVal || 'Passwords do not match',
          })}
        />

        {/* Accept Terms */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
              {...register('terms', {
                required: 'You must accept the Terms & Conditions to proceed',
              })}
            />
            <span className="text-xs font-semibold text-gray-500 leading-normal">
              I agree to the{' '}
              <a href="#terms" className="text-[#ff6a00] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-[#ff6a00] hover:underline">
                Privacy Policy
              </a>.
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.terms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center rounded-xl bg-[#ff6a00] px-4 py-3 text-sm font-bold text-white hover:bg-[#e05e00] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <SocialLoginButtons />

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-semibold text-[#ff6a00] hover:text-[#e05e00] transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
