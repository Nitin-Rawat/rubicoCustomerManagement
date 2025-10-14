import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-gradient-to-r from-[#00B1BE] to-[#0094C6] text-white hover:shadow-lg hover:scale-[1.02] focus:ring-[#00B1BE]',
      secondary: 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] hover:shadow-lg focus:ring-[#2563EB]',
      outline: 'border-2 border-gray-300 text-gray-700 hover:border-[#00B1BE] hover:text-[#00B1BE] focus:ring-[#00B1BE]',
      danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg focus:ring-red-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
