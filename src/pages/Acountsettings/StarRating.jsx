import React, { useState, useEffect } from 'react';
import { StarIcon } from 'lucide-react';

const StarRating = ({ rating, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleClick = (rate) => {
    setCurrentRating(rate);
    onRate(rate);
  };

  return (
    <div style={{ display: 'flex', gap: 4, cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={24}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => handleClick(star)}
          style={{
            color: (hovered >= star || currentRating >= star) ? '#FFD700' : '#ccc',
            transition: 'color 0.2s ease',
            userSelect: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
