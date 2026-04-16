import React, { CSSProperties, RefObject, useEffect, useRef, useState } from 'react';
import imagePlaceholder from '../../assets/imagePlaceholder.svg';
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
  const retryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setHasError(false);
    retryCount.current = 0;
    if (!hasEverLoaded.current) {
      setIsLoaded(false);
    }
    return () => clearTimeout(retryTimer.current);
  }, [src]);

  const handleError = () => {
    if (retryCount.current < 1 && src) {
      retryCount.current += 1;
      retryTimer.current = setTimeout(() => setHasError(false), 3000);
    }
    setHasError(true);
  };

  return (
    <picture>
      {!isLoaded && (
        <div className={cn('bg-platinum animate-pulse', className)} aria-hidden="true" />
      )}
      <img
        {...props}
        src={!src || hasError ? imagePlaceholder : src}
        onError={handleError}
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
