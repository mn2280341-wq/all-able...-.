import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
