import { useState } from 'react';

export default function BookDescription({ description }: { description: string }) {
  const MAX_LENGTH = 135;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div>
      <p className="text-xs font-light font-poppins text-grayDark hidden lg:block">{description}</p>
      <p className="text-xs font-light font-poppins text-grayDark lg:hidden text-left">
        {isExpanded || description?.length <= MAX_LENGTH
          ? description
          : `${description.substring(0, MAX_LENGTH)}...`}
        {description.length > MAX_LENGTH && (
          <button
            onClick={toggleReadMore}
            className="text-primary ml-1 text-sm font-normal font-poppins"
          >
            {isExpanded ? ' More Less' : ' More'}
          </button>
        )}
      </p>
    </div>
  );
}
