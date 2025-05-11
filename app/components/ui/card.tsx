import React from 'react';
export function Card({ children, className = '', ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded border p-4 bg-white shadow ${className}`} {...props}>{children}</div>;
} 