import { useCallback, useEffect, useRef } from 'react';

interface UseModalOptions {
  open: boolean;
  onClose: () => void;
}

export function useModal({ open, onClose }: UseModalOptions) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Focus trap + restore focus on close
  useEffect(() => {
    if (!open) return;
    previousActiveElement.current = document.activeElement as HTMLElement;

    const timer = requestAnimationFrame(() => {
      modalRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(timer);
      previousActiveElement.current?.focus();
    };
  }, [open]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return {
    modalRef,
    modalProps: {
      role: 'dialog' as const,
      'aria-modal': true as const,
      tabIndex: -1,
      onKeyDown: handleKeyDown,
    },
    backdropProps: {
      onClick: handleBackdropClick,
    },
  };
}
