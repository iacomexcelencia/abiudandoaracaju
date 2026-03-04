import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
}

export function StarRating({ 
  value, 
  onChange, 
  maxRating = 5, 
  size = "md", 
  disabled = false,
  label = "Avalie este local"
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label id="star-rating-label" className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div 
        className="flex items-center gap-1" 
        role="radiogroup" 
        aria-labelledby="star-rating-label"
        aria-required="true"
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= (hoverRating || value);
          
          return (
            <button
              key={starNumber}
              type="button"
              role="radio"
              aria-checked={starNumber === value}
              aria-label={`${starNumber} de ${maxRating} estrelas`}
              onClick={() => handleClick(starNumber)}
              onMouseEnter={() => handleMouseEnter(starNumber)}
              onMouseLeave={handleMouseLeave}
              disabled={disabled}
              className={`
                transition-colors duration-150 
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
              `}
              data-testid={`star-${starNumber}`}
            >
              <Star 
                className={`${sizeClasses[size]} ${isFilled ? 'fill-current' : ''}`} 
              />
            </button>
          );
        })}
        {value > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {value} de {maxRating} estrela{value !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}