import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section = ({ children, className = "", id = "" }: SectionProps) => (
  <section id={id} className={`px-6 py-20 md:py-40 max-w-[1400px] mx-auto relative ${className}`}>
    {children}
  </section>
);
