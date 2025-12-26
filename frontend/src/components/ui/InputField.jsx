import React from 'react'

const InputField = ({ label, error, icon: Icon, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
            w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default InputField