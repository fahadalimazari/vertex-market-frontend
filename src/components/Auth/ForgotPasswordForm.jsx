import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPasswordForm = () => {
  const { requestPasswordReset } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

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
      await requestPasswordReset(data.email);
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-50 p-3.5 text-green-500">
            <FiCheckCircle className="h-10 w-10" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            We have sent a password reset link to <strong className="text-gray-900">{submittedEmail}</strong>. Please check your inbox and spam folder.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/auth/reset-password"
            state={{ token: 'dummy-reset-token-xyz' }}
            className="flex w-full justify-center items-center rounded-xl bg-[#ff6a00] px-4 py-3 text-sm font-bold text-white hover:bg-[#e05e00] transition-colors shadow-md"
          >
            Go to Reset Password (Demo Link)
          </Link>
        </div>

        <div>
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
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Forgot Password?
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
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
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {errors.email.message}
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
            'Send Reset Link'
          )}
        </button>
      </form>

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

export default ForgotPasswordForm;
