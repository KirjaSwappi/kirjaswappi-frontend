import React, { CSSProperties, RefObject, useState } from 'react';
import NotFoundImg from '../../assets/notFoundIcon.png';
import { cn } from '../../utility/cn';

interface IImageProps {
  src: string | undefined;
  className?: string;
  alt?: string;
  ref?: RefObject<HTMLImageElement>;
  onMouseOver?: () => void;
  onClick?: () => void;
  onKeyDown?: () => void;
  style?: CSSProperties;
}

const Image: React.FC<IImageProps> = (props) => {
  const { src, style, className } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  // Image Error Handling Function
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    img.src = NotFoundImg;
  };
  return (
    <picture>
      {!isLoaded && (
        <div className={cn('bg-platinum animate-pulse', className)} aria-hidden="true" />
      )}
      <img
        {...props}
        src={!src ? NotFoundImg : src}
        onError={handleImageError}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
        alt={props?.alt || 'image'}
        style={style}
        className={cn(
          `transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`,
          isLoaded && className,
        )}
      />
    </picture>
  );
};

export default Image;
