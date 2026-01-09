import React from 'react'
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    ...props
}) => {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";

    const variants = {
        primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500 shadow-lg shadow-purple-500/30",
        secondary: "bg-white/10 text-white hover:bg-white/20 focus:ring-purple-500 border border-white/20 backdrop-blur-sm",
        outline: "bg-transparent border-2 border-purple-400/50 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 focus:ring-red-500",
        ghost: "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white"
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg"
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button