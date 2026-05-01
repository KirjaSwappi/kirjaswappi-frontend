import type { JSX } from 'react';
import DOMPurify from 'dompurify';

/**
 * Renders an HTML string after passing it through DOMPurify with a strict
 * allowlist. Use anywhere we previously called dangerouslySetInnerHTML on
 * developer-controlled (i18n) copy. Even though today's strings are safe,
 * one rogue translation PR is all it takes to flip this into stored XSS.
 */
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'a', 'br', 'p', 'span', 'ul', 'ol', 'li'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

let anchorHookInstalled = false;
if (typeof window !== 'undefined' && !anchorHookInstalled) {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  anchorHookInstalled = true;
}

export default function SafeHtml({
  html,
  className,
  as: Tag = 'span',
}: {
  html: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
