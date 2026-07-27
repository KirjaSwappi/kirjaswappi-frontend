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
  // Cache the fetched bytes as an object URL and serve those instead of the
  // original URL. Use for presigned/expiring URLs (e.g. chat images) so a
  // later repaint doesn't re-request an expired link and fail.
  persist?: boolean;
}

// Session cache keyed by object path (ignoring the rotating presigned
// signature). Object URLs are never revoked — chat images are few and the
// cache dies with the tab. ponytail: bounded by conversation size; if that
// ever grows large, add an LRU cap here.
const blobCache = new Map<string, string>();
const pathKey = (url: string) => url.split('?')[0];

const Image: React.FC<IImageProps> = (props) => {
  const { src, style, className, persist } = props;
  const domProps = { ...props };
  delete domProps.persist;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | undefined>(() =>
    persist && src ? blobCache.get(pathKey(src)) : undefined,
  );
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

  // Fetch-once-and-cache for persist mode: grab the bytes while the presigned
  // URL is still valid, then serve the object URL from then on.
  useEffect(() => {
    if (!persist || !src) return;
    const key = pathKey(src);
    const existing = blobCache.get(key);
    if (existing) {
      setCachedSrc(existing);
      return;
    }
    let revoked = false;
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
      .then((blob) => {
        if (revoked) return;
        const objectUrl = URL.createObjectURL(blob);
        blobCache.set(key, objectUrl);
        setCachedSrc(objectUrl);
      })
      .catch(() => {
        // CORS/expiry — fall back to the raw URL (existing behavior).
      });
    return () => {
      revoked = true;
    };
  }, [persist, src]);

  const handleError = () => {
    if (retryCount.current < 1 && src) {
      retryCount.current += 1;
      retryTimer.current = setTimeout(() => setHasError(false), 3000);
    }
    setHasError(true);
  };

  const effectiveSrc = cachedSrc || src;

  return (
    <picture>
      {!isLoaded && (
        <div className={cn('bg-platinum animate-pulse', className)} aria-hidden="true" />
      )}
      <img
        {...domProps}
        src={!effectiveSrc || hasError ? imagePlaceholder : effectiveSrc}
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
