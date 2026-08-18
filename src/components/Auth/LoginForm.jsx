import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail } from 'react-icons/fi';
import PasswordInput from './PasswordInput';
import SocialLoginButtons from './SocialLoginButtons';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/account';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const session = await login(data.email, data.password, data.rememberMe);
      
      // Determine correct redirect based on role
      const user = session?.user;
      if (user?.role === 'Seller') {
        const status = user.sellerProfile?.status;
        if (status === 'Approved') {
          navigate('/seller/dashboard', { replace: true });
        } else {
          navigate('/seller/status', { replace: true });
        }
      } else if (user?.role === 'Admin' || user?.role === 'Super Admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Please enter your details to sign in to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
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
              className={`block w-full pl-10 pr-4 py-3 text-sm text-gray-900 border ${
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
            <p className="mt-1.5 text-xs text-red-500 font-medium animate-pulse">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
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
          })}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-gray-300 text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
              {...register('rememberMe')}
            />
            <span className="text-sm font-medium text-gray-600">Remember me</span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-sm font-semibold text-[#ff6a00] hover:text-[#e05e00] transition-colors"
          >
            Forgot password?
          </Link>
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
            'Sign In'
          )}
        </button>
      </form>

      <SocialLoginButtons />

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-[#ff6a00] hover:text-[#e05e00] transition-colors"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
