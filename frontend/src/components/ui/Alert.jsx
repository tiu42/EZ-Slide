import React from 'react'
import { AlertCircle } from 'lucide-react';

const Alert = ({ title, message, variant = 'error' }) => {
    return (
        <div className="flex w-full items-start gap-3 rounded-lg border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm p-4 text-red-400 shadow-lg">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
                <h5 className="font-semibold leading-none tracking-tight mb-1 text-red-300">{title}</h5>
                <div className="text-sm opacity-90">{message}</div>
            </div>
        </div>
    );
};

export default Alert;