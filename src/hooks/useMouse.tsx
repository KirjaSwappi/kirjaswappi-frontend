import { useEffect, useRef, useState } from 'react';

export function useMouseClick<T extends HTMLElement = HTMLDivElement>() {
  const reference = useRef<T>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const handleClickOutSide = (event: MouseEvent) => {
    if (
      reference.current &&
      !reference.current.contains(event.target as Node) &&
      !(event.target instanceof HTMLButtonElement)
    ) {
      setClicked(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, [reference]);
  return { clicked, setClicked, reference };
}
