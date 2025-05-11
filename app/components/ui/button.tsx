import React from 'react';
export function Button({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button style={{padding:'6px 12px', borderRadius:4, border:'1px solid #ccc', background:'#f0f0f0'}} {...props}>{children}</button>;
} 