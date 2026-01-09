import React, { useState, useRef } from 'react';
import Konva from 'konva';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Paintbrush,
    AlignJustify, ArrowUpFromLine as AlignVerticalTop, ArrowDownFromLine as AlignVerticalBottom, AlignCenterVertical as AlignVerticalCenter
} from 'lucide-react';

const COLOR_PRESETS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
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

const AlignDropdown = ({ element, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-700"
                title="Alignment"
            >
                {element.align === 'center' ? <AlignCenter size={18} /> :
                    element.align === 'right' ? <AlignRight size={18} /> :
                        element.align === 'justify' ? <AlignJustify size={18} /> :
                            <AlignLeft size={18} />}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[1002]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-[1003] w-48">
                        <div className="text-xs font-semibold text-gray-500 mb-2">Horizontal</div>
                        <div className="flex justify-between mb-3 bg-gray-50 rounded p-1">
                            <button onClick={() => onUpdate({ align: 'left' })} className={`p-1 rounded ${element.align === 'left' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Left"><AlignLeft size={16} /></button>
                            <button onClick={() => onUpdate({ align: 'center' })} className={`p-1 rounded ${element.align === 'center' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Center"><AlignCenter size={16} /></button>
                            <button onClick={() => onUpdate({ align: 'right' })} className={`p-1 rounded ${element.align === 'right' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Right"><AlignRight size={16} /></button>
                            <button onClick={() => onUpdate({ align: 'justify' })} className={`p-1 rounded ${element.align === 'justify' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Justify"><AlignJustify size={16} /></button>
                        </div>

                        <div className="text-xs font-semibold text-gray-500 mb-2">Vertical</div>
                        <div className="flex justify-between bg-gray-50 rounded p-1">
                            <button onClick={() => onUpdate({ verticalAlign: 'top' })} className={`p-1 rounded ${element.verticalAlign !== 'middle' && element.verticalAlign !== 'bottom' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Top"><AlignVerticalTop size={16} /></button>
                            <button onClick={() => onUpdate({ verticalAlign: 'middle' })} className={`p-1 rounded ${element.verticalAlign === 'middle' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Middle"><AlignVerticalCenter size={16} /></button>
                            <button onClick={() => onUpdate({ verticalAlign: 'bottom' })} className={`p-1 rounded ${element.verticalAlign === 'bottom' ? 'bg-white shadow text-violet-600' : 'text-gray-600'}`} title="Bottom"><AlignVerticalBottom size={16} /></button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const TextFormatToolbar = ({ element, onUpdate, position }) => {
    const fontFamilies = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS'];
    const fontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 120];

    const updateFormat = (updates) => {
        // If fontSize is being updated, calculate required height
        if (updates.fontSize && updates.fontSize !== element.fontSize) {
            // Create temporary Konva Text to measure required height
            const tempText = new Konva.Text({
                text: element.text,
                fontSize: updates.fontSize,
                fontFamily: element.fontFamily || 'Arial',
                fontStyle: element.fontStyle || 'normal',
                width: element.width,
                lineHeight: 1.2,
            });
            const requiredHeight = tempText.height();
            tempText.destroy();

            // Update height if needed
            if (requiredHeight > element.height) {
                updates.height = requiredHeight;
            }
        }

        onUpdate(element.id, updates);
    };

    const toggleBold = () => {
        const currentStyle = element.fontStyle || 'normal';
        const isBold = currentStyle.includes('bold');
        const isItalic = currentStyle.includes('italic');

        let newStyle = 'normal';
        if (!isBold && isItalic) newStyle = 'bold italic';
        else if (!isBold && !isItalic) newStyle = 'bold';
        else if (isBold && isItalic) newStyle = 'italic';

        updateFormat({ fontStyle: newStyle });
    };

    const toggleItalic = () => {
        const currentStyle = element.fontStyle || 'normal';
        const isBold = currentStyle.includes('bold');
        const isItalic = currentStyle.includes('italic');

        let newStyle = 'normal';
        if (isBold && !isItalic) newStyle = 'bold italic';
        else if (!isBold && !isItalic) newStyle = 'italic';
        else if (isBold && isItalic) newStyle = 'bold';

        updateFormat({ fontStyle: newStyle });
    };

    const toggleUnderline = () => {
        const current = element.textDecoration || '';
        updateFormat({ textDecoration: current === 'underline' ? '' : 'underline' });
    };

    const isBold = (element.fontStyle || '').includes('bold');
    const isItalic = (element.fontStyle || '').includes('italic');
    const isUnderline = element.textDecoration === 'underline';

    return (
        <div
            style={{
                position: 'absolute',
                top: `${position.y - 50}px`, // Reduced offset so toolbar is lower
                left: `${position.x}px`,
                transform: 'translateX(-50%)',
                zIndex: 1001,
            }}
            onMouseDown={(e) => {
                // Stop propagation to prevent EditorCanvas from handling the event
                // But don't preventDefault - we want inputs/selects to be clickable
                e.stopPropagation();
            }}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2 flex items-center gap-1"
        >
            {/* Font Family */}
            <select
                value={element.fontFamily || 'Arial'}
                onChange={(e) => updateFormat({ fontFamily: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-violet-500"
            >
                {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                ))}
            </select>

            {/* Font Size */}
            <select
                value={element.fontSize || 24}
                onChange={(e) => updateFormat({ fontSize: Number(e.target.value) })}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-violet-500 w-16"
            >
                {(() => {
                    // Create comprehensive size list
                    const allSizes = [...fontSizes];
                    const currentSize = element.fontSize || 24;

                    // Add current size if not in preset list
                    if (!allSizes.includes(currentSize)) {
                        allSizes.push(currentSize);
                        allSizes.sort((a, b) => a - b);
                    }

                    return allSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ));
                })()}
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Bold */}
            <button
                onClick={toggleBold}
                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${isBold ? 'bg-violet-100 text-violet-600' : 'text-gray-700'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>

            {/* Italic */}
            <button
                onClick={toggleItalic}
                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${isItalic ? 'bg-violet-100 text-violet-600' : 'text-gray-700'}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>

            {/* Underline */}
            <button
                onClick={toggleUnderline}
                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${isUnderline ? 'bg-violet-100 text-violet-600' : 'text-gray-700'}`}
                title="Underline"
            >
                <Underline size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text Color Picker */}
            <ColorPicker
                value={element.fill}
                onChange={(color) => updateFormat({ fill: color })}
                title="Text Color"
            />

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Alignment Dropdown */}
            <AlignDropdown
                element={element}
                onUpdate={updateFormat}
            />
        </div>
    );
};

export default TextFormatToolbar;
