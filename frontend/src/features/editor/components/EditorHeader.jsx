import React, { useState, useEffect, useRef } from 'react'
import { useEditor } from '../contexts/EditorContext'
import PresentationView from './PresentationView'

const EditorHeader = () => {
    const { presentation, updateTitle } = useEditor();
    const [titleInput, setTitleInput] = useState(presentation?.title || "Untitled");
    const [isPresenting, setIsPresenting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const exportMenuRef = useRef(null);

    useEffect(() => {
        setTitleInput(presentation?.title || "Untitled");
    }, [presentation?.title]);

    const handleTitleChange = (e) => {
        setTitleInput(e.target.value);
    };

    const handleTitleBlur = () => {
        if (titleInput !== presentation?.title) {
            updateTitle(titleInput);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    const handlePresent = async () => {
        setIsPresenting(true);
    };

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const { jsPDF } = await import('jspdf');
            const Konva = (await import('konva')).default;

            // Helper to load image
            const loadImage = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            };

            // Get all slides from presentation
            const slides = presentation?.slides || [];
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [800, 450]
            });

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];

                // Create a temporary Konva stage to render the slide
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.width = '800px';
                container.style.height = '450px';
                document.body.appendChild(container);

                const stage = new Konva.Stage({
                    container: container,
                    width: 800,
                    height: 450
                });

                const layer = new Konva.Layer();
                stage.add(layer);

                // Add background
                const bgRect = new Konva.Rect({
                    width: 800,
                    height: 450,
                    fill: slide.background || '#ffffff'
                });
                layer.add(bgRect);

                // Add background image if exists
                if (slide.backgroundImage) {
                    try {
                        const imgObj = await loadImage(slide.backgroundImage);

                        // Calculate fit
                        const stageWidth = 800;
                        const stageHeight = 450;
                        const fit = slide.backgroundImageFit || 'cover';

                        const scale = fit === 'contain'
                            ? Math.min(stageWidth / imgObj.width, stageHeight / imgObj.height)
                            : Math.max(stageWidth / imgObj.width, stageHeight / imgObj.height);

                        const width = imgObj.width * scale;
                        const height = imgObj.height * scale;
                        const x = (stageWidth - width) / 2;
                        const y = (stageHeight - height) / 2;

                        const bgImage = new Konva.Image({
                            image: imgObj,
                            x: x,
                            y: y,
                            width: width,
                            height: height
                        });
                        layer.add(bgImage);
                    } catch (e) {
                        console.warn('Could not load background image:', e);
                    }
                }

                // Render each element
                for (const element of (slide.elements || [])) {
                    try {
                        switch (element.type) {
                            case 'text':
                                layer.add(new Konva.Text({
                                    x: element.x,
                                    y: element.y,
                                    width: element.width,
                                    height: element.height,
                                    text: element.text || '',
                                    fontSize: element.fontSize || 16,
                                    fontFamily: element.fontFamily || 'Arial',
                                    fill: element.fill || '#000000',
                                    align: element.align || 'left',
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'rect':
                                layer.add(new Konva.Rect({
                                    x: element.x,
                                    y: element.y,
                                    width: element.width,
                                    height: element.height,
                                    fill: element.fill || '#ffffff',
                                    stroke: element.stroke,
                                    strokeWidth: element.strokeWidth || 1,
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'circle':
                                layer.add(new Konva.Ellipse({
                                    x: element.x,
                                    y: element.y,
                                    radiusX: element.radiusX || element.radius || 50,
                                    radiusY: element.radiusY || element.radius || 50,
                                    fill: element.fill || '#ffffff',
                                    stroke: element.stroke,
                                    strokeWidth: element.strokeWidth || 1,
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'star':
                                layer.add(new Konva.Star({
                                    x: element.x,
                                    y: element.y,
                                    numPoints: element.numPoints || 5,
                                    innerRadius: element.innerRadius || 20,
                                    outerRadius: element.outerRadius || Math.max((element.width || 0) / 2, (element.height || 0) / 2, 40),
                                    fill: element.fill || '#ffffff',
                                    stroke: element.stroke,
                                    strokeWidth: element.strokeWidth || 1,
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'triangle':
                                layer.add(new Konva.Line({
                                    x: element.x,
                                    y: element.y,
                                    points: element.points || [0, 0, element.width || 50, element.height || 50, 0, element.height || 50, 0, 0],
                                    fill: element.fill || '#ffffff',
                                    stroke: element.stroke,
                                    strokeWidth: element.strokeWidth || 1,
                                    closed: true,
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'line':
                                layer.add(new Konva.Line({
                                    x: element.x,
                                    y: element.y,
                                    points: element.points || [0, 0, 100, 0],
                                    stroke: element.stroke || '#000000',
                                    strokeWidth: element.strokeWidth || 2,
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'arrow':
                                layer.add(new Konva.Arrow({
                                    x: element.x,
                                    y: element.y,
                                    points: element.points || [0, 0, 100, 0],
                                    stroke: element.stroke || '#000000',
                                    strokeWidth: element.strokeWidth || 2,
                                    fill: element.stroke || '#000000',
                                    pointerLength: element.pointerLength || 10,
                                    pointerWidth: element.pointerWidth || 10,
                                    rotation: element.rotation || 0,
                                    opacity: element.opacity ?? 1
                                }));
                                break;
                            case 'image':
                                if (element.src) {
                                    try {
                                        const imgObj = await loadImage(element.src);

                                        // Handle crop similar to URLImage in PresentationView
                                        const crop = element.crop;
                                        const safeCrop = (() => {
                                            if (!crop) return { x: 0, y: 0, width: imgObj.width, height: imgObj.height };
                                            const x = Math.max(0, Math.min(crop.x ?? 0, imgObj.width));
                                            const y = Math.max(0, Math.min(crop.y ?? 0, imgObj.height));
                                            const w = Math.max(1, Math.min(crop.width ?? imgObj.width, imgObj.width - x));
                                            const h = Math.max(1, Math.min(crop.height ?? imgObj.height, imgObj.height - y));
                                            return { x, y, width: w, height: h };
                                        })();

                                        layer.add(new Konva.Image({
                                            x: element.x,
                                            y: element.y,
                                            width: element.width,
                                            height: element.height,
                                            image: imgObj,
                                            crop: safeCrop,
                                            rotation: element.rotation || 0,
                                            opacity: element.opacity ?? 1
                                        }));
                                    } catch (e) {
                                        console.warn("Could not load element image", e);
                                    }
                                }
                                break;
                        }
                    } catch (e) {
                        console.warn('Could not render element:', e);
                    }
                }

                layer.draw();

                // Convert stage to image
                const imageData = stage.toDataURL();

                if (i > 0) {
                    pdf.addPage([800, 450]);
                }
                pdf.addImage(imageData, 'PNG', 0, 0, 800, 450);

                stage.destroy();
                document.body.removeChild(container);
            }

            pdf.save(`${presentation?.title || 'presentation'}.pdf`);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Failed to export PDF');
        } finally {
            setIsExporting(false);
            setShowExportMenu(false);
        }
    };

    const handleExportPPTX = async () => {
        setIsExporting(true);
        try {
            const PptxGenJS = (await import('pptxgenjs')).default;
            const prs = new PptxGenJS();

            // Set slide size to 16:9
            prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 5.625 });
            prs.defaultLayout = 'LAYOUT1';

            const slides = presentation?.slides || [];

            for (const slide of slides) {
                const pptSlide = prs.addSlide();

                // Add background
                pptSlide.background = { color: slide.background || 'ffffff' };

                // Add background image if exists
                if (slide.backgroundImage) {
                    try {
                        pptSlide.addImage({
                            path: slide.backgroundImage,
                            x: 0,
                            y: 0,
                            w: 10,
                            h: 5.625,
                            rasterize: true
                        });
                    } catch (e) {
                        console.warn('Could not add background image:', e);
                    }
                }

                // Add elements
                for (const element of (slide.elements || [])) {
                    try {
                        const x = element.x / 80; // Convert from canvas px to inches
                        const y = element.y / 80;
                        const w = element.width / 80;
                        const h = element.height / 80;

                        switch (element.type) {
                            case 'text':
                                pptSlide.addText(element.text || '', {
                                    x, y, w, h,
                                    fontSize: (element.fontSize || 16) * 0.9,
                                    color: element.fill?.replace('#', '') || '000000',
                                    align: element.align || 'left',
                                    fontFace: element.fontFamily || 'Arial'
                                });
                                break;
                            case 'rect':
                                pptSlide.addShape('rect', {
                                    x, y, w, h,
                                    fill: { color: element.fill?.replace('#', '') || 'ffffff' },
                                    line: element.stroke ? { color: element.stroke.replace('#', ''), width: element.strokeWidth || 1 } : undefined
                                });
                                break;
                            case 'circle':
                                {
                                    const rx = element.radiusX || element.radius || (element.width || 0) / 2 || 50;
                                    const ry = element.radiusY || element.radius || (element.height || 0) / 2 || 50;
                                    const circleW = (rx * 2) / 80;
                                    const circleH = (ry * 2) / 80;
                                    const circleX = (element.x - rx) / 80;
                                    const circleY = (element.y - ry) / 80;

                                    pptSlide.addShape('ellipse', {
                                        x: circleX,
                                        y: circleY,
                                        w: circleW,
                                        h: circleH,
                                        fill: { color: element.fill?.replace('#', '') || 'ffffff' },
                                        line: element.stroke ? { color: element.stroke.replace('#', ''), width: element.strokeWidth || 1 } : undefined
                                    });
                                }
                                break;
                            case 'star':
                                pptSlide.addShape('star5', {
                                    x, y, w, h,
                                    fill: { color: element.fill?.replace('#', '') || 'ffffff' },
                                    line: element.stroke ? { color: element.stroke.replace('#', ''), width: element.strokeWidth || 1 } : undefined
                                });
                                break;
                            case 'triangle':
                                pptSlide.addShape('triangle', {
                                    x, y, w, h,
                                    fill: { color: element.fill?.replace('#', '') || 'ffffff' },
                                    line: element.stroke ? { color: element.stroke.replace('#', ''), width: element.strokeWidth || 1 } : undefined
                                });
                                break;
                            case 'image':
                                if (element.src) {
                                    pptSlide.addImage({
                                        path: element.src,
                                        x, y, w, h
                                    });
                                }
                                break;
                        }
                    } catch (e) {
                        console.warn('Could not add element:', e);
                    }
                }
            }

            prs.writeFile({ fileName: `${presentation?.title || 'presentation'}.pptx` });
        } catch (error) {
            console.error('Error exporting PPTX:', error);
            alert('Failed to export PPTX');
        } finally {
            setIsExporting(false);
            setShowExportMenu(false);
        }
    };

    return (
        <>
            {isPresenting && (
                <PresentationView onExit={() => setIsPresenting(false)} />
            )}

            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </button>

                    <div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={titleInput}
                                onChange={handleTitleChange}
                                onBlur={handleTitleBlur}
                                onKeyDown={handleKeyDown}
                                className="text-base font-semibold text-slate-800 border-none focus:ring-2 focus:ring-violet-500 p-1 -ml-1 rounded w-64 truncate bg-transparent hover:bg-slate-50 transition-colors"
                            />
                        </div>
                        <div className="text-xs text-slate-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            {presentation?.updatedAt ? `Last edit was ${new Date(presentation.updatedAt).toLocaleString()}` : 'Unsaved'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handlePresent}
                        disabled={isPresenting}
                        className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3z" /></svg>
                        {isPresenting ? 'Presenting...' : 'Present'}
                    </button>

                    <div className="relative" ref={exportMenuRef}>
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={isExporting}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 shadow-sm shadow-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            {isExporting ? 'Exporting...' : 'Export'}
                        </button>

                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2 border border-slate-200">
                                <button
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    Export as PDF
                                </button>
                                <button
                                    onClick={handleExportPPTX}
                                    disabled={isExporting}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    Export as PPTX
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-1"></div>

                    <button className="relative group">
                        <div className="h-9 w-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white">
                            H
                        </div>
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
                    </button>
                </div>
            </header>
        </>
    )
}

export default EditorHeader
