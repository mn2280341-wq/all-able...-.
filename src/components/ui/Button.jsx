import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    ...props
}) => {
    const baseStyles = "w-full py-4 px-6 rounded-[24px] font-bold text-lg transition-transform active:scale-95 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-sky-blue to-blue-400 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02]",
        pink: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02]",
        success: "bg-gradient-to-r from-mint-green-dark to-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02]",
        secondary: "bg-lavender text-[#6A5ACD] hover:bg-[#dcdcf5]",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-50",
        outline: "bg-transparent border-2 border-sky-blue text-sky-blue",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed transform-none";

    return (
        <button
            className={`${baseStyles} ${variants[variant] || variants.primary} ${disabled ? disabledStyles : ''} ${className}`}
            onClick={disabled ? null : onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
