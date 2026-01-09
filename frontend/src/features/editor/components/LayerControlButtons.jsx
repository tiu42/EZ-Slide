import React from 'react';
import {
    ArrowUpToLine,
    ArrowDownToLine,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { useEditor } from '../contexts/EditorContext';

const LayerControlButtons = () => {
    const {
        selectedElementId,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward
    } = useEditor();

    if (!selectedElementId) return null;

    return (
        <div
            className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex gap-1 z-10"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button
                onClick={() => bringToFront(selectedElementId)}
                className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-violet-600 transition-colors"
                title="Bring to Front"
            >
                <ArrowUpToLine size={18} />
            </button>
            <button
                onClick={() => bringForward(selectedElementId)}
                className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-violet-600 transition-colors"
                title="Bring Forward"
            >
                <ArrowUp size={18} />
            </button>
            <button
                onClick={() => sendBackward(selectedElementId)}
                className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-violet-600 transition-colors"
                title="Send Backward"
            >
                <ArrowDown size={18} />
            </button>
            <button
                onClick={() => sendToBack(selectedElementId)}
                className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-violet-600 transition-colors"
                title="Send to Back"
            >
                <ArrowDownToLine size={18} />
            </button>
        </div>
    );
};

export default LayerControlButtons;
