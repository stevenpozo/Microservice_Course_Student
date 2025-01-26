import React from 'react';

const Button = ({ onClick, children, className = '', variant = 'primary' }) => {
    const baseStyle = 'px-4 py-2 rounded font-semibold';
    const variantStyles = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };
