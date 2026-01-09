import React from 'react'

const InputField = ({ label, error, icon: Icon, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
            w-full rounded-lg border bg-white/5 backdrop-blur-sm px-3 py-2 text-white placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50 bg-red-500/5' : 'border-white/20'}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
};

export default InputField