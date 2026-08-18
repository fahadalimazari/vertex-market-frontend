import { memo } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = memo(({ rating, size = 16, color = '#ffb800' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} color={color} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color={color} />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color="#e5e7eb" />);
    }
  }
  return <div className="flex items-center gap-1">{stars}</div>;
});

RatingStars.displayName = 'RatingStars';
export default RatingStars;
