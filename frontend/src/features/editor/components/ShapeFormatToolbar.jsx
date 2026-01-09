import React, { useState, useRef } from 'react';
import { Paintbrush } from 'lucide-react';

const COLOR_PRESETS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
    '#a0aec0', '#e2e8f0', '#cbd5e0', '#4a5568', '#2d3748'
];

const ColorPicker = ({ value, onChange, title }) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);

    const handleColorSelect = (color) => {
        onChange(color);
        setShowPicker(false);
    };

    return (
        <div className="relative" ref={pickerRef}>
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-700 relative"
                title={title}
            >
                <Paintbrush size={18} />
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded"
                    style={{ backgroundColor: value || '#000000' }}
                />
            </button>

            {showPicker && (
                <>
                    <div
                        className="fixed inset-0 z-[1002]"
                        onClick={() => setShowPicker(false)}
                    />
                    <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 z-[1003] w-64">
                        <div className="grid grid-cols-5 gap-2 mb-2">
                            {COLOR_PRESETS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleColorSelect(color)}
                                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-violet-500 transition-colors"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                            <label className="text-xs text-gray-600 mb-1 block">Custom Color</label>
                            <input
                                type="color"
                                value={value || '#000000'}
                                onChange={(e) => handleColorSelect(e.target.value)}
                                className="w-full h-8 rounded cursor-pointer border border-gray-300"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const ShapeFormatToolbar = ({ element, onUpdate, position }) => {
    const updateFormat = (updates) => {
        onUpdate(element.id, updates);
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: `${position.y - 50}px`,
                left: `${position.x}px`,
                transform: 'translateX(-50%)',
                zIndex: 1001,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2 flex items-center gap-1"
        >
            {/* Fill Color */}
            <ColorPicker
                value={element.fill}
                onChange={(color) => updateFormat({ fill: color })}
                title="Fill Color"
            />

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Stroke Color */}
            <ColorPicker
                value={element.stroke}
                onChange={(color) => updateFormat({ stroke: color })}
                title="Stroke Color"
            />

            {/* Stroke Width */}
            <input
                type="range"
                min="0"
                max="20"
                value={element.strokeWidth || 0}
                onChange={(e) => updateFormat({ strokeWidth: Number(e.target.value) })}
                className="w-20"
                title="Stroke Width"
            />
            <span className="text-xs text-gray-600 w-6 text-center">{element.strokeWidth || 0}</span>
        </div>
    );
};

export default ShapeFormatToolbar;
