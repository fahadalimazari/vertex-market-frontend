import { 
  FaStar, FaCrown, FaTrophy, FaShieldAlt, FaCheckCircle, 
  FaFire, FaAward, FaMedal, FaStore, FaUsers, FaHandshake,
  FaSeedling
} from 'react-icons/fa';

// Strict whitelist registry mapped to actual React Components
const iconRegistry = {
  FaStar,
  FaCrown,
  FaTrophy,
  FaShieldAlt,
  FaCheckCircle,
  FaFire,
  FaAward,
  FaMedal,
  FaStore,
  FaUsers,
  FaHandshake,
  FaSeedling
};

const BadgeRenderer = ({ icon, className = '' }) => {
  // Lookup the icon in the registry
  const IconComponent = iconRegistry[icon];

  // Secure Fallback: if the icon string is not in our predefined registry, we render a default
  if (!IconComponent) {
    console.warn(`BadgeRenderer: Unrecognized icon key "${icon}". Falling back to FaAward.`);
    const FallbackIcon = iconRegistry['FaAward'];
    return <FallbackIcon className={className} />;
  }

  return <IconComponent className={className} />;
};

export default BadgeRenderer;
