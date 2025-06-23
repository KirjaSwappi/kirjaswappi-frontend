import { useEffect, useRef, useState } from 'react';

export function useMouseClick<T extends HTMLElement = HTMLDivElement>(onOutsideClick?: () => void) {
  const reference = useRef<T>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const handleClickOutSide = (event: MouseEvent) => {
    if (
      reference.current &&
      !reference.current.contains(event.target as Node) &&
      !(event.target instanceof HTMLButtonElement)
    ) {
      onOutsideClick?.();
      setClicked(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, [onOutsideClick]);
  return { clicked, setClicked, reference };
}
