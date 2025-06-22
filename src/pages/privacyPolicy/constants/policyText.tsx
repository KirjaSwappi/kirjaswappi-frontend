import React from 'react';

export const commonTextStyles = 'text-[15px] text-gray-700';

export const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className={`${commonTextStyles} mb-4`}>{children}</p>
);

export const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className={`${commonTextStyles} space-y-2 sm:pl-4 lg:pl-0`}>
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export const BoldText: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <p className={commonTextStyles}>
    <b>{title}:</b> {children}
  </p>
);
