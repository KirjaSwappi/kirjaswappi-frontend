import React, { CSSProperties, RefObject, useEffect, useRef, useState } from 'react';
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
  const [hasError, setHasError] = useState(false);
  const hasEverLoaded = useRef(false);

  useEffect(() => {
    setHasError(false);
    if (!hasEverLoaded.current) {
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <picture>
      {!isLoaded && (
        <div className={cn('bg-platinum animate-pulse', className)} aria-hidden="true" />
      )}
      <img
        {...props}
        src={!src || hasError ? NotFoundImg : src}
        onError={() => setHasError(true)}
        onLoad={() => {
          setIsLoaded(true);
          hasEverLoaded.current = true;
        }}
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
