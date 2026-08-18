import { useLocalization } from '../../hooks/useLocalization';

const RTLWrapper = ({ children, className = '' }) => {
  const { rtl } = useLocalization();
  
  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default RTLWrapper;
