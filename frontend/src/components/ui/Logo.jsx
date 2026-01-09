import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Logo = ({ className = '', size = 'md', showText = true }) => {
    const navigate = useNavigate();

    const sizes = {
        sm: {
            box: 'w-7 h-7',
            icon: 'w-4 h-4',
            text: 'text-lg'
        },
        md: {
            box: 'w-10 h-10',
            icon: 'w-6 h-6',
            text: 'text-2xl'
        },
        lg: {
            box: 'w-12 h-12',
            icon: 'w-7 h-7',
            text: 'text-3xl'
        }
    };

    return (
        <div
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 cursor-pointer group ${className}`}
        >
            <div className={`${sizes[size].box} bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center`}>
                <Sparkles className={`${sizes[size].icon} text-white`} />
            </div>
            {showText && (
                <span className={`${sizes[size].text} font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                    Ez-Slide
                </span>
            )}
        </div>
    );
};

export default Logo;
