import { useMemo } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const PasswordStrengthMeter = ({ password = '' }) => {
  const requirements = useMemo(() => {
    return [
      { id: 'length', label: 'Minimum 8 characters', test: (pw) => pw.length >= 8 },
      { id: 'uppercase', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
      { id: 'lowercase', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
      { id: 'number', label: 'One number', test: (pw) => /[0-9]/.test(pw) },
      { id: 'special', label: 'One special character (@$!%*?&)', test: (pw) => /[@$!%*?&]/.test(pw) },
    ];
  }, []);

  const score = useMemo(() => {
    if (!password) return 0;
    return requirements.reduce((acc, req) => (req.test(password) ? acc + 1 : acc), 0);
  }, [password, requirements]);

  const strength = useMemo(() => {
    if (score === 0) return { label: 'Empty', color: 'bg-gray-200', text: 'text-gray-400', width: 'w-0' };
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: 'w-1/3' };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-green-500', text: 'text-green-600', width: 'w-full' };
  }, [score]);

  return (
    <div className="mt-3.5 space-y-3">
      {/* Strength Label and Progress Bar */}
      {password && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-gray-500">Password Strength:</span>
            <span className={strength.text}>{strength.label}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`} />
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {requirements.map((req) => {
          const isMet = req.test(password);
          return (
            <div 
              key={req.id} 
              className={`flex items-center gap-1.5 transition-colors ${
                isMet ? 'text-green-600 font-medium' : 'text-gray-400'
              }`}
            >
              {isMet ? (
                <FiCheck className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <FiX className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
              )}
              <span>{req.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
