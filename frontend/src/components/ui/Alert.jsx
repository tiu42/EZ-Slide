import React from 'react'
import { AlertCircle } from 'lucide-react';

const Alert = ({ title, message, variant = 'error' }) => {
    return (
        <div className="flex w-full items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
                <h5 className="font-semibold leading-none tracking-tight mb-1">{title}</h5>
                <div className="text-sm opacity-90">{message}</div>
            </div>
        </div>
    );
};

export default Alert;