import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowUpToLine,
    ArrowDownToLine,
    ArrowUp,
    ArrowDown,
    Trash2
} from 'lucide-react';
import { useEditor } from '../contexts/EditorContext';

const COLOR_PRESETS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
    '#a0aec0', '#e2e8f0', '#cbd5e0', '#4a5568', '#2d3748'
];

const ColorPicker = ({ value, onChange, label }) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);

    const handleColorSelect = (color) => {
        onChange(color);
        setShowPicker(false);
    };

    return (
        <div className="mb-4">
            <label className="text-xs font-medium text-gray-700 mb-2 block">{label}</label>
            <div className="relative" ref={pickerRef}>
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="w-full p-2 border border-gray-300 rounded hover:border-violet-500 transition-colors flex items-center gap-2"
                >
                    <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value || '#000000' }}
                    />
                    <span className="text-sm">{value || '#000000'}</span>
                </button>

                {showPicker && (
                    <>
                        <div
                            className="fixed inset-0 z-[100]"
                            onClick={() => setShowPicker(false)}
                        />
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 z-[101]">
                            <div className="grid grid-cols-5 gap-2 mb-2">
                                {COLOR_PRESETS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => handleColorSelect(color)}
                                        className="w-full aspect-square rounded border-2 border-gray-300 hover:border-violet-500 transition-colors"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <label className="text-xs text-gray-600 mb-1 block">Custom</label>
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
        </div>
    );
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const getImageMeta = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
});

const ASPECT_PRESETS = [
    { value: 'original', label: 'Original' },
    { value: 'free', label: 'Free' },
    { value: '1:1', label: '1:1' },
    { value: '4:3', label: '4:3' },
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
];

const parseAspect = (value) => {
    if (!value || value === 'free' || value === 'original') return null;
    const parts = value.split(':');
    if (parts.length !== 2) return null;
    const w = Number(parts[0]);
    const h = Number(parts[1]);
    if (!w || !h) return null;
    return w / h;
};

const clampCrop = (crop, natW, natH) => {
    const safe = { ...crop };
    safe.x = Math.max(0, Math.min(safe.x ?? 0, natW));
    safe.y = Math.max(0, Math.min(safe.y ?? 0, natH));
    safe.width = Math.max(1, Math.min(safe.width ?? natW, natW - safe.x));
    safe.height = Math.max(1, Math.min(safe.height ?? natH, natH - safe.y));
    return safe;
};

const PropertiesPanel = () => {
    const {
        selectedElementId,
        currentSlide,
        currentSlideId, // Need current slide ID
        updateElement,
        updateSlide, // Need updateSlide function
        deleteElement,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward
    } = useEditor();

    const backgroundFileInputRef = useRef(null);
    const replaceImageInputRef = useRef(null);
    const [cropAspect, setCropAspect] = useState('original');
    const applyCropAndSize = (crop) => {
        const selected = currentSlide?.elements?.find(el => el.id === selectedElementId);
        if (!selected || selected.type !== 'image') return;

        const natW = selected.naturalWidth || selected.width || 1;
        const natH = selected.naturalHeight || selected.height || 1;
        const safe = clampCrop(crop, natW, natH);
        const aspect = safe.width / safe.height;

        // Maintain display aspect to avoid stretch: keep width, adjust height
        const newWidth = selected.width || safe.width;
        const newHeight = Math.max(1, Math.round(newWidth / aspect));

        updateElement(selectedElementId, {
            crop: safe,
            width: newWidth,
            height: newHeight
        });
    };

    useEffect(() => {
        setCropAspect('original');
    }, [selectedElementId]);

    const handleBackgroundFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            event.target.value = '';
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            const meta = await getImageMeta(dataUrl);

            updateSlide(currentSlideId, {
                backgroundImage: dataUrl,
                backgroundImageMeta: meta,
                backgroundImageFit: 'cover'
            });
        } catch (err) {
            console.error('Failed to set background image', err);
        } finally {
            event.target.value = '';
        }
    };

    const clearBackgroundImage = () => {
        updateSlide(currentSlideId, {
            backgroundImage: '',
            backgroundImageMeta: null
        });
    };

    const handleReplaceImage = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !selectedElementId) return;
        if (!file.type.startsWith('image/')) {
            event.target.value = '';
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            const meta = await getImageMeta(dataUrl);
            const selectedElement = currentSlide?.elements?.find(el => el.id === selectedElementId);

            const targetWidth = selectedElement?.width || meta.width;
            const scale = targetWidth / meta.width;

            updateElement(selectedElementId, {
                src: dataUrl,
                width: targetWidth,
                height: Math.round(meta.height * scale),
                naturalWidth: meta.width,
                naturalHeight: meta.height,
                crop: {
                    x: 0,
                    y: 0,
                    width: meta.width,
                    height: meta.height
                }
            });
        } catch (err) {
            console.error('Failed to replace image', err);
        } finally {
            event.target.value = '';
        }
    };

    const setImageAsBackground = () => {
        const selectedElement = currentSlide?.elements?.find(el => el.id === selectedElementId);
        if (!selectedElement || selectedElement.type !== 'image') return;

        updateSlide(currentSlideId, {
            backgroundImage: selectedElement.src,
            backgroundImageMeta: selectedElement.width && selectedElement.height
                ? { width: selectedElement.width, height: selectedElement.height }
                : null,
            backgroundImageFit: 'cover'
        });
    };

    if (!selectedElementId || !currentSlide?.elements) {
        // Show Slide Properties when no element is selected
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-4 shrink-0 overflow-y-auto">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Slide Properties</h3>
                </div>

                <ColorPicker
                    label="BACKGROUND COLOR"
                    value={currentSlide?.background || '#ffffff'}
                    onChange={(color) => updateSlide(currentSlideId, { background: color })}
                />

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">BACKGROUND IMAGE</span>
                        {currentSlide?.backgroundImage && (
                            <button
                                onClick={clearBackgroundImage}
                                className="text-xs text-red-500 hover:text-red-600"
                            >
                                Xóa
                            </button>
                        )}
                    </div>

                    {currentSlide?.backgroundImage ? (
                        <div className="space-y-3">
                            <div className="border border-gray-200 rounded overflow-hidden">
                                <img
                                    src={currentSlide.backgroundImage}
                                    alt="Slide background"
                                    className="w-full h-32 object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => backgroundFileInputRef.current?.click()}
                                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors"
                                >
                                    Thay ảnh nền
                                </button>
                                <select
                                    value={currentSlide.backgroundImageFit || 'cover'}
                                    onChange={(e) => updateSlide(currentSlideId, { backgroundImageFit: e.target.value })}
                                    className="px-2 py-2 text-sm border border-gray-300 rounded"
                                >
                                    <option value="cover">Cover</option>
                                    <option value="contain">Contain</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => backgroundFileInputRef.current?.click()}
                            className="w-full px-4 py-2 text-sm border border-dashed border-gray-300 rounded text-slate-600 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-colors"
                        >
                            Tải ảnh làm nền
                        </button>
                    )}

                    <input
                        ref={backgroundFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBackgroundFile}
                    />
                </div>
            </div>
        );
    }

    const selectedElement = currentSlide.elements.find(el => el.id === selectedElementId);
    if (!selectedElement) return null;

    const isShape = ['rect', 'circle', 'triangle', 'star', 'ellipse'].includes(selectedElement.type);
    const isLine = ['line', 'arrow'].includes(selectedElement.type);

    const updateProperty = (updates) => {
        updateElement(selectedElementId, updates);
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 p-4 shrink-0 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                    {selectedElement.type} Properties
                </h3>
            </div>

            {/* Layer Controls */}
            <div className="mb-6">
                <label className="text-xs font-medium text-gray-700 mb-2 block">LAYER ORDER</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => bringToFront(selectedElementId)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowUpToLine size={16} />
                        To Front
                    </button>
                    <button
                        onClick={() => sendToBack(selectedElementId)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowDownToLine size={16} />
                        To Back
                    </button>
                    <button
                        onClick={() => bringForward(selectedElementId)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowUp size={16} />
                        Forward
                    </button>
                    <button
                        onClick={() => sendBackward(selectedElementId)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowDown size={16} />
                        Backward
                    </button>
                </div>
            </div>

            {/* Shape-specific properties */}
            {isShape && (
                <>
                    <ColorPicker
                        label="FILL COLOR"
                        value={selectedElement.fill}
                        onChange={(color) => updateProperty({ fill: color })}
                    />

                    <ColorPicker
                        label="STROKE COLOR"
                        value={selectedElement.stroke}
                        onChange={(color) => updateProperty({ stroke: color })}
                    />

                    <div className="mb-4">
                        <label className="text-xs font-medium text-gray-700 mb-2 block">STROKE WIDTH</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={selectedElement.strokeWidth || 0}
                                onChange={(e) => updateProperty({ strokeWidth: Number(e.target.value) })}
                                className="flex-1"
                            />
                            <span className="text-sm text-gray-600 w-8 text-right">
                                {selectedElement.strokeWidth || 0}px
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* Line-specific properties */}
            {isLine && (
                <>
                    <ColorPicker
                        label="LINE COLOR"
                        value={selectedElement.stroke}
                        onChange={(color) => updateProperty({ stroke: color })}
                    />

                    <div className="mb-4">
                        <label className="text-xs font-medium text-gray-700 mb-2 block">LINE WIDTH</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={selectedElement.strokeWidth || 3}
                                onChange={(e) => updateProperty({ strokeWidth: Number(e.target.value) })}
                                className="flex-1"
                            />
                            <span className="text-sm text-gray-600 w-8 text-right">
                                {selectedElement.strokeWidth || 3}px
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* Position & Size */}
            {!isLine && (
                <div className="mb-6 pt-4 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-700 mb-2 block">POSITION</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                            <label className="text-xs text-gray-500">X</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.x)}
                                onChange={(e) => updateProperty({ x: Number(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Y</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.y)}
                                onChange={(e) => updateProperty({ y: Number(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    {/* Width & Height for shapes with dimensions */}
                    {(selectedElement.width !== undefined || selectedElement.height !== undefined) && (
                        <>
                            <label className="text-xs font-medium text-gray-700 mb-2 block">SIZE</label>
                            <div className="grid grid-cols-2 gap-2">
                                {selectedElement.width !== undefined && (
                                    <div>
                                        <label className="text-xs text-gray-500">Width</label>
                                        <input
                                            type="number"
                                            value={Math.round(selectedElement.width)}
                                            onChange={(e) => updateProperty({ width: Number(e.target.value) })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                )}
                                {selectedElement.height !== undefined && (
                                    <div>
                                        <label className="text-xs text-gray-500">Height</label>
                                        <input
                                            type="number"
                                            value={Math.round(selectedElement.height)}
                                            onChange={(e) => updateProperty({ height: Number(e.target.value) })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Rotation */}
                    <div className="mt-4">
                        <label className="text-xs font-medium text-gray-700 mb-2 block">ROTATION</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={Math.round(selectedElement.rotation || 0)}
                                onChange={(e) => updateProperty({ rotation: Number(e.target.value) })}
                                className="flex-1"
                            />
                            <input
                                type="number"
                                min="0"
                                max="360"
                                value={Math.round(selectedElement.rotation || 0)}
                                onChange={(e) => updateProperty({ rotation: Number(e.target.value) })}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-right"
                            />
                            <span className="text-xs text-gray-600">°</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Image utilities */}
            {selectedElement.type === 'image' && (
                <div className="pt-4 border-t border-gray-200 mb-4">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                            onClick={() => replaceImageInputRef.current?.click()}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors"
                        >
                            Đổi ảnh
                        </button>
                        <button
                            onClick={setImageAsBackground}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors"
                        >
                            Đặt làm nền
                        </button>
                    </div>

                    <input
                        ref={replaceImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleReplaceImage}
                    />

                    {/* Crop controls */}
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-700">CROP</label>
                            <select
                                value={cropAspect}
                                onChange={(e) => setCropAspect(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                                {ASPECT_PRESETS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                const natW = selectedElement.naturalWidth || selectedElement.width || 1;
                                const natH = selectedElement.naturalHeight || selectedElement.height || 1;
                                const ratio = parseAspect(cropAspect);

                                if (!ratio || cropAspect === 'original') {
                                    applyCropAndSize({ x: 0, y: 0, width: natW, height: natH });
                                    return;
                                }

                                let cropW = natW;
                                let cropH = natH;
                                const naturalRatio = natW / natH;
                                if (ratio > naturalRatio) {
                                    // limit by width
                                    cropW = natW;
                                    cropH = Math.round(natW / ratio);
                                } else {
                                    // limit by height
                                    cropH = natH;
                                    cropW = Math.round(natH * ratio);
                                }

                                const cropX = Math.round((natW - cropW) / 2);
                                const cropY = Math.round((natH - cropH) / 2);

                                applyCropAndSize({ x: cropX, y: cropY, width: cropW, height: cropH });
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-violet-100 hover:text-violet-600 rounded transition-colors"
                        >
                            Áp dụng tỉ lệ
                        </button>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label className="text-gray-500">Crop X</label>
                                <input
                                    type="number"
                                    value={Math.round(selectedElement.crop?.x ?? 0)}
                                    onChange={(e) => {
                                        const natW = selectedElement.naturalWidth || selectedElement.width || 1;
                                        const natH = selectedElement.naturalHeight || selectedElement.height || 1;
                                        const next = clampCrop({
                                            ...(selectedElement.crop || { x: 0, y: 0, width: natW, height: natH }),
                                            x: Number(e.target.value)
                                        }, natW, natH);
                                        applyCropAndSize(next);
                                    }}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500">Crop Y</label>
                                <input
                                    type="number"
                                    value={Math.round(selectedElement.crop?.y ?? 0)}
                                    onChange={(e) => {
                                        const natW = selectedElement.naturalWidth || selectedElement.width || 1;
                                        const natH = selectedElement.naturalHeight || selectedElement.height || 1;
                                        const next = clampCrop({
                                            ...(selectedElement.crop || { x: 0, y: 0, width: natW, height: natH }),
                                            y: Number(e.target.value)
                                        }, natW, natH);
                                        applyCropAndSize(next);
                                    }}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500">Crop W</label>
                                <input
                                    type="number"
                                    value={Math.round(selectedElement.crop?.width ?? (selectedElement.naturalWidth || selectedElement.width || 1))}
                                    onChange={(e) => {
                                        const natW = selectedElement.naturalWidth || selectedElement.width || 1;
                                        const natH = selectedElement.naturalHeight || selectedElement.height || 1;
                                        const next = clampCrop({
                                            ...(selectedElement.crop || { x: 0, y: 0, width: natW, height: natH }),
                                            width: Number(e.target.value)
                                        }, natW, natH);
                                        applyCropAndSize(next);
                                    }}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500">Crop H</label>
                                <input
                                    type="number"
                                    value={Math.round(selectedElement.crop?.height ?? (selectedElement.naturalHeight || selectedElement.height || 1))}
                                    onChange={(e) => {
                                        const natW = selectedElement.naturalWidth || selectedElement.width || 1;
                                        const natH = selectedElement.naturalHeight || selectedElement.height || 1;
                                        const next = clampCrop({
                                            ...(selectedElement.crop || { x: 0, y: 0, width: natW, height: natH }),
                                            height: Number(e.target.value)
                                        }, natW, natH);
                                        applyCropAndSize(next);
                                    }}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Button */}
            <div className="pt-4 border-t border-gray-200">
                <button
                    onClick={() => deleteElement(selectedElementId)}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} />
                    Delete Element
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
