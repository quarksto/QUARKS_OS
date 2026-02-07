import React, { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

export const StandardAvatar = ({ name, src, className = '', size = 'md', channel }) => {
    // Handling image loading errors
    const [imageError, setImageError] = useState(false);

    // Initial Logic
    const initials = name
        ?.split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '??';

    // Size Variants
    const baseSizeClasses = {
        sm: 'w-6 h-6 text-[9px]',
        md: 'w-10 h-10 text-[11px]',
        lg: 'w-12 h-12 text-[13px]',
        xl: 'w-16 h-16 text-[15px]',
    };

    const sizeClass = baseSizeClasses[size] || baseSizeClasses.md;

    // Common classes - DS Rule 3.25: Neutral Slate Background (bg-slate-100), Slate Text
    const containerClass = `rounded-lg flex items-center justify-center font-bold tracking-wide shrink-0 border border-slate-200 overflow-hidden ${sizeClass} bg-slate-100 text-slate-500 ${className}`;

    // Channel Indicator Setup
    const renderChannelBadge = () => {
        if (!channel) return null;

        const badgeConfig = {
            whatsapp: { icon: FaWhatsapp, color: 'bg-emerald-500' },
            email: { icon: MdEmail, color: 'bg-blue-500' },
            phone: { icon: FaPhone, color: 'bg-slate-500' },
        };

        const config = badgeConfig[channel.toLowerCase()] || badgeConfig.phone;
        const badgeSize = size === 'sm' ? 'w-3 h-3' : size === 'xl' ? 'w-6 h-6' : 'w-4 h-4';
        const IconComponent = config.icon;

        // Adjust icon size relative to badge
        const iconSize = size === 'sm' ? 8 : (size === 'xl' ? 14 : 10);

        return (
            <div className={`absolute -bottom-1 -right-1 ${badgeSize} ${config.color} rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm z-10 box-content`}>
                <IconComponent size={iconSize} />
            </div>
        );
    };

    // Render Logic
    if (src && !imageError) {
        return (
            <div className="relative inline-block">
                <img
                    src={src}
                    alt={name}
                    className={`${containerClass} object-cover`}
                    onError={() => setImageError(true)}
                />
                {renderChannelBadge()}
            </div>
        );
    }

    return (
        <div className="relative inline-block">
            <div className={containerClass}>
                {initials}
            </div>
            {renderChannelBadge()}
        </div>
    );
};

