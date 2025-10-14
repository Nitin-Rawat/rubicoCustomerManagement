import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 ${className}`}>
      {children}
    </div>
  );
};
