import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const ResetPasswordForm = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = location.state?.token || 'dummy-token';

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
      await resetPassword(token, data.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 2500);
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-50 p-3.5 text-green-500">
            <FiCheckCircle className="h-10 w-10 animate-bounce" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Password Updated!
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Your password has been successfully reset. Redirecting you to the Login page in a moment...
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/auth/login"
            className="flex w-full justify-center items-center rounded-xl bg-[#ff6a00] px-4 py-3 text-sm font-bold text-white hover:bg-[#e05e00] transition-colors shadow-md"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Reset Password
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter a strong, secure password that satisfies all the security criteria.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Password */}
        <div>
          <PasswordInput
            label="New Password"
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
          label="Confirm New Password"
          placeholder="••••••••"
          disabled={isSubmitting}
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === passwordVal || 'Passwords do not match',
          })}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center rounded-xl bg-[#ff6a00] px-4 py-3 text-sm font-bold text-white hover:bg-[#e05e00] focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Reset Password'
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

export default ResetPasswordForm;
