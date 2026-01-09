import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Transformer, Star, Line, Arrow, Ellipse, RegularPolygon } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'
import { useEditor } from '../contexts/EditorContext'
import TextEditOverlay from './TextEditOverlay'
import TextFormatToolbar from './TextFormatToolbar'
import LineAnchors from './LineAnchors'

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 450;
const SNAP_THRESHOLD = 8;

const URLImage = ({ src, crop, ...props }) => {
    // Only set crossOrigin for remote images; data URLs don't need it and some hosts block CORS
    const crossOrigin = src?.startsWith('http') ? 'anonymous' : undefined;
    const [image] = useImage(src, crossOrigin);

    if (!image) return null;

    // Clamp crop to actual image bounds at render time to avoid invalid boxes from stale metadata
    const safeCrop = (() => {
        if (!crop) return { x: 0, y: 0, width: image.width, height: image.height };
        const x = Math.max(0, Math.min(crop.x ?? 0, image.width));
        const y = Math.max(0, Math.min(crop.y ?? 0, image.height));
        const w = Math.max(1, Math.min(crop.width ?? image.width, image.width - x));
        const h = Math.max(1, Math.min(crop.height ?? image.height, image.height - y));
        return { x, y, width: w, height: h };
    })();

    return (
        <KonvaImage
            image={image}
            crop={safeCrop}
            {...props}
        />
    );
};

const BackgroundImage = ({ src, fit = 'cover' }) => {
    const [image] = useImage(src, 'anonymous');
    if (!image) return null;

    const scale = fit === 'contain'
        ? Math.min(STAGE_WIDTH / image.width, STAGE_HEIGHT / image.height)
        : Math.max(STAGE_WIDTH / image.width, STAGE_HEIGHT / image.height);

    const width = image.width * scale;
    const height = image.height * scale;
    const x = (STAGE_WIDTH - width) / 2;
    const y = (STAGE_HEIGHT - height) / 2;

    return (
        <KonvaImage
            image={image}
            x={x}
            y={y}
            width={width}
            height={height}
            listening={false}
        />
    );
};

// Approximate element bounding box for snapping calculations
const getElementSize = (element) => {
    if (!element) return { width: 0, height: 0 };

    if (element.type === 'circle') {
        const rx = element.radiusX || element.radius || 50;
        const ry = element.radiusY || element.radius || 50;
        return { width: rx * 2, height: ry * 2, anchor: 'center' };
    }

    if (element.type === 'star') {
        const r = element.outerRadius || 50;
        return { width: r * 2, height: r * 2, anchor: 'center' };
    }

    if (element.type === 'triangle') {
        return { width: element.width || 0, height: element.height || 0, anchor: 'topleft' };
    }

    if (element.type === 'line' || element.type === 'arrow') {
        // Skip snapping lines/arrow for now (no clear bounding box)
        return { width: 0, height: 0, anchor: 'none' };
    }

    // Default assumes width/height exist (rect, text, image)
    return { width: element.width || 0, height: element.height || 0, anchor: 'topleft' };
};

const getElementBounds = (element, x, y) => {
    const { width, height, anchor } = getElementSize(element);
    if (anchor === 'none') {
        return null;
    }

    if (anchor === 'center') {
        const left = x - width / 2;
        const top = y - height / 2;
        return {
            width,
            height,
            left,
            right: left + width,
            top,
            bottom: top + height,
            centerX: x,
            centerY: y
        };
    }

    // Default: top-left anchor
    return {
        width,
        height,
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
        centerX: x + width / 2,
        centerY: y + height / 2
    };
};

const EditorCanvas = () => {
    const {
        currentSlide,
        selectedElementId,
        setSelectedElementId,
        updateElement,
        deleteElement,
        copyElement,
        pasteElement
    } = useEditor();

    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const [editingTextId, setEditingTextId] = useState(null);
    const [rotationDisplay, setRotationDisplay] = useState(null); // { angle: number, x: number, y: number }
    const [snapGuides, setSnapGuides] = useState({ vertical: null, horizontal: null });

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts if editing text
            if (editingTextId) return;

            // Delete
            if (e.key === 'Delete' && selectedElementId) {
                e.preventDefault();
                deleteElement(selectedElementId);
            }
            // Copy (Ctrl+C / Cmd+C)
            else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementId) {
                e.preventDefault();
                copyElement(selectedElementId);
            }
            // Paste (Ctrl+V / Cmd+V)
            else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                pasteElement();
            }
            // Cut (Ctrl+X / Cmd+X)
            else if ((e.ctrlKey || e.metaKey) && e.key === 'x' && selectedElementId) {
                e.preventDefault();
                copyElement(selectedElementId);
                deleteElement(selectedElementId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, editingTextId, deleteElement, copyElement, pasteElement]);

    // Update transformer when selection changes
    useEffect(() => {
        if (selectedElementId && transformerRef.current && stageRef.current) {
            const element = currentSlide?.elements?.find(el => el.id === selectedElementId);

            // Skip transformer for line/arrow (they use custom anchors)
            if (element && (element.type === 'line' || element.type === 'arrow')) {
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer()?.batchDraw();
                return;
            }

            const node = stageRef.current.findOne('#' + selectedElementId);
            if (node) {
                transformerRef.current.nodes([node]);
                transformerRef.current.getLayer().batchDraw();
            }
        } else if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedElementId, currentSlide?.elements]); // Depend on elements to re-find node if re-rendered

    const handleStageMouseDown = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedElementId(null);
        }
    };

    const handleTextDoubleClick = (element) => {
        console.log('Double click detected on text element:', element.id);
        setEditingTextId(element.id);
        // Hide transformer while editing
        setSelectedElementId(null);
        // Force transformer to clear
        if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    };

    const handleTextEditClose = () => {
        console.log('Closing text edit');
        setEditingTextId(null);
    };

    const handleTextUpdate = (updates) => {
        console.log('Updating text element:', updates);
        if (editingTextId) {
            // updates can contain { text, height, etc. }
            updateElement(editingTextId, updates);
        }
    };

    if (!currentSlide) {
        return (
            <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400">
                Select a slide to edit
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-200 overflow-auto flex items-center justify-center p-8">
            <div className="bg-white shadow-lg relative" style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
                <Stage
                    width={STAGE_WIDTH}
                    height={STAGE_HEIGHT}
                    onMouseDown={handleStageMouseDown}
                    ref={stageRef}
                >
                    <Layer>
                        {/* Background */}
                        <Rect
                            x={0}
                            y={0}
                            width={STAGE_WIDTH}
                            height={STAGE_HEIGHT}
                            fill={currentSlide.background || '#ffffff'}
                            listening={false} // Don't trigger clicks
                        />

                        {currentSlide.backgroundImage ? (
                            <BackgroundImage
                                src={currentSlide.backgroundImage}
                                fit={currentSlide.backgroundImageFit || 'cover'}
                            />
                        ) : null}

                        {currentSlide.elements?.map((element) => {
                            const commonProps = {
                                id: element.id,
                                x: element.x,
                                y: element.y,
                                rotation: element.rotation,
                                draggable: true,
                                onClick: () => setSelectedElementId(element.id),
                                onTap: () => setSelectedElementId(element.id),
                                onDragMove: (e) => {
                                    const node = e.target;
                                    let nextX = node.x();
                                    let nextY = node.y();

                                    const bounds = getElementBounds(element, nextX, nextY);
                                    if (!bounds || bounds.width === 0 || bounds.height === 0) {
                                        return;
                                    }

                                    // Build snap targets: canvas center + other elements' edges/centers
                                    const verticalTargets = [STAGE_WIDTH / 2];
                                    const horizontalTargets = [STAGE_HEIGHT / 2];

                                    if (currentSlide?.elements) {
                                        currentSlide.elements.forEach((el) => {
                                            if (el.id === element.id) return;
                                            const b = getElementBounds(el, el.x, el.y);
                                            if (!b) return;
                                            verticalTargets.push(b.left, b.centerX, b.right);
                                            horizontalTargets.push(b.top, b.centerY, b.bottom);
                                        });
                                    }

                                    let vGuide = null;
                                    let hGuide = null;
                                    let bestVDiff = SNAP_THRESHOLD + 1;
                                    let bestHDiff = SNAP_THRESHOLD + 1;

                                    // Check vertical snaps (left/center/right)
                                    verticalTargets.forEach((target) => {
                                        // Center align
                                        const diffCenter = Math.abs(bounds.centerX - target);
                                        if (diffCenter < bestVDiff && diffCenter <= SNAP_THRESHOLD) {
                                            bestVDiff = diffCenter;
                                            vGuide = target;
                                            nextX += target - bounds.centerX;
                                        }

                                        // Left align
                                        const diffLeft = Math.abs(bounds.left - target);
                                        if (diffLeft < bestVDiff && diffLeft <= SNAP_THRESHOLD) {
                                            bestVDiff = diffLeft;
                                            vGuide = target;
                                            nextX += target - bounds.left;
                                        }

                                        // Right align
                                        const diffRight = Math.abs(bounds.right - target);
                                        if (diffRight < bestVDiff && diffRight <= SNAP_THRESHOLD) {
                                            bestVDiff = diffRight;
                                            vGuide = target;
                                            nextX += target - bounds.right;
                                        }
                                    });

                                    // Update bounds after vertical adjustment
                                    const newBoundsV = getElementBounds(element, nextX, nextY) || bounds;

                                    // Check horizontal snaps (top/center/bottom)
                                    horizontalTargets.forEach((target) => {
                                        // Center align
                                        const diffCenter = Math.abs(newBoundsV.centerY - target);
                                        if (diffCenter < bestHDiff && diffCenter <= SNAP_THRESHOLD) {
                                            bestHDiff = diffCenter;
                                            hGuide = target;
                                            nextY += target - newBoundsV.centerY;
                                        }

                                        // Top align
                                        const diffTop = Math.abs(newBoundsV.top - target);
                                        if (diffTop < bestHDiff && diffTop <= SNAP_THRESHOLD) {
                                            bestHDiff = diffTop;
                                            hGuide = target;
                                            nextY += target - newBoundsV.top;
                                        }

                                        // Bottom align
                                        const diffBottom = Math.abs(newBoundsV.bottom - target);
                                        if (diffBottom < bestHDiff && diffBottom <= SNAP_THRESHOLD) {
                                            bestHDiff = diffBottom;
                                            hGuide = target;
                                            nextY += target - newBoundsV.bottom;
                                        }
                                    });

                                    // Apply snapped position live
                                    if (vGuide !== null || hGuide !== null) {
                                        node.x(nextX);
                                        node.y(nextY);
                                    }

                                    setSnapGuides({ vertical: vGuide, horizontal: hGuide });
                                },
                                onDragEnd: (e) => {
                                    setSnapGuides({ vertical: null, horizontal: null });
                                    updateElement(element.id, {
                                        x: e.target.x(),
                                        y: e.target.y()
                                    });
                                },
                                onTransform: (e) => {
                                    const node = e.target;
                                    const rotation = node.rotation();

                                    // Show rotation angle tooltip
                                    if (rotation !== element.rotation) {
                                        const stage = stageRef.current;
                                        const pointerPos = stage.getPointerPosition();
                                        setRotationDisplay({
                                            angle: Math.round(rotation),
                                            x: pointerPos.x,
                                            y: pointerPos.y
                                        });
                                    }

                                    // For text elements, update dimensions in real-time to prevent stretching
                                    if (element.type === 'text') {
                                        const scaleX = node.scaleX();
                                        const scaleY = node.scaleY();

                                        // Immediately reset scale and apply to dimensions
                                        node.scaleX(1);
                                        node.scaleY(1);

                                        // Just resize bounds, don't change font size
                                        node.width(Math.max(5, node.width() * scaleX));
                                        node.height(Math.max(5, node.height() * scaleY));
                                    }
                                },
                                onTransformEnd: (e) => {
                                    // Hide rotation display
                                    setRotationDisplay(null);

                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();
                                    const rotation = node.rotation();

                                    // Reset scale to 1 (important for non-text elements)
                                    node.scaleX(1);
                                    node.scaleY(1);

                                    const newAttrs = {
                                        x: node.x(),
                                        y: node.y(),
                                        rotation: rotation
                                    };

                                    if (element.type === 'circle') {
                                        // Circle becomes ellipse with independent radii
                                        newAttrs.radiusX = Math.max(5, (element.radiusX || element.radius || 50) * scaleX);
                                        newAttrs.radiusY = Math.max(5, (element.radiusY || element.radius || 50) * scaleY);
                                    } else if (element.type === 'text') {
                                        // For text, onTransform already updated node properties in real-time
                                        // Just read width and height, fontSize stays the same
                                        const newWidth = node.width();
                                        newAttrs.width = newWidth;

                                        // Calculate required height for the text content
                                        // This prevents text from being cut off when width changes
                                        const tempText = new Konva.Text({
                                            text: element.text,
                                            fontSize: element.fontSize,
                                            fontFamily: element.fontFamily || 'Arial',
                                            fontStyle: element.fontStyle || 'normal',
                                            width: newWidth,
                                            lineHeight: 1.2,
                                        });
                                        const requiredHeight = tempText.height();
                                        tempText.destroy();

                                        // Use the larger of current height or required height
                                        newAttrs.height = Math.max(node.height(), requiredHeight);
                                    } else if (element.type === 'triangle') {
                                        // Triangle scales like rectangle
                                        newAttrs.width = Math.max(5, node.width() * scaleX);
                                        newAttrs.height = Math.max(5, node.height() * scaleY);
                                    } else if (element.type === 'star') {
                                        // Star: scale both radii
                                        newAttrs.innerRadius = Math.max(5, (element.innerRadius || 30) * ((scaleX + scaleY) / 2));
                                        newAttrs.outerRadius = Math.max(10, (element.outerRadius || 50) * ((scaleX + scaleY) / 2));
                                    } else if (element.type === 'line' || element.type === 'arrow') {
                                        // Lines/Arrows: scale points relative to position
                                        const points = element.points || [];
                                        newAttrs.points = points.map((p, i) => i % 2 === 0 ? p * scaleX : p * scaleY);
                                    } else {
                                        newAttrs.width = Math.max(5, node.width() * scaleX);
                                        newAttrs.height = Math.max(5, node.height() * scaleY);
                                    }

                                    updateElement(element.id, newAttrs);
                                }
                            };

                            if (element.type === 'rect') {
                                return (
                                    <Rect
                                        key={element.id}
                                        {...commonProps}
                                        width={element.width}
                                        height={element.height}
                                        fill={element.fill}
                                        stroke={element.stroke}
                                        strokeWidth={element.strokeWidth}
                                    />
                                );
                            } else if (element.type === 'circle') {
                                return (
                                    <Ellipse
                                        key={element.id}
                                        {...commonProps}
                                        radiusX={element.radiusX || element.radius || 50}
                                        radiusY={element.radiusY || element.radius || 50}
                                        fill={element.fill}
                                        stroke={element.stroke}
                                        strokeWidth={element.strokeWidth}
                                    />
                                );
                            } else if (element.type === 'text') {
                                return (
                                    <Text
                                        key={element.id}
                                        {...commonProps}
                                        text={element.text}
                                        fontSize={element.fontSize}
                                        fontFamily={element.fontFamily || 'Arial'}
                                        fontStyle={element.fontStyle || 'normal'}
                                        textDecoration={element.textDecoration || ''}
                                        fill={element.fill}
                                        width={element.width}
                                        height={element.height} // Pass height for vertical align
                                        align={element.align || 'left'}
                                        verticalAlign={element.verticalAlign || 'top'}
                                        lineHeight={1.2}
                                        visible={editingTextId !== element.id}
                                        onDblClick={(e) => {
                                            e.cancelBubble = true;
                                            handleTextDoubleClick(element);
                                        }}
                                    />
                                );
                            } else if (element.type === 'triangle') {
                                return (
                                    <Line
                                        key={element.id}
                                        {...commonProps}
                                        points={[
                                            element.width / 2, 0,  // Top center
                                            element.width, element.height,  // Bottom right
                                            0, element.height  // Bottom left
                                        ]}
                                        closed
                                        fill={element.fill}
                                        stroke={element.stroke}
                                        strokeWidth={element.strokeWidth}
                                    />
                                );
                            } else if (element.type === 'star') {
                                return (
                                    <Star
                                        key={element.id}
                                        {...commonProps}
                                        numPoints={element.numPoints || 5}
                                        innerRadius={element.innerRadius || 30}
                                        outerRadius={element.outerRadius || 50}
                                        fill={element.fill}
                                        stroke={element.stroke}
                                        strokeWidth={element.strokeWidth}
                                    />
                                );
                            } else if (element.type === 'line') {
                                return (
                                    <Line
                                        key={element.id}
                                        {...commonProps}
                                        points={element.points}
                                        stroke={element.stroke}
                                        strokeWidth={element.strokeWidth}
                                    />
                                );
                            } else if (element.type === 'arrow') {
                                return (
                                    <Arrow
                                        key={element.id}
                                        {...commonProps}
                                        points={element.points}
                                        stroke={element.stroke}
                                        strokeWidth={element.strokeWidth}
                                        pointerLength={element.pointerLength || 15}
                                        pointerWidth={element.pointerWidth || 15}
                                        fill={element.stroke}
                                    />
                                );
                            } else if (element.type === 'image') {
                                return (
                                    <URLImage
                                        key={element.id}
                                        {...commonProps}
                                        src={element.src}
                                        width={element.width}
                                        height={element.height}
                                        crop={element.crop}
                                    />
                                );
                            }
                            return null;
                        })}

                        <Transformer
                            ref={transformerRef}
                            rotateAnchorOffset={60}
                            boundBoxFunc={(oldBox, newBox) => {
                                // limit resize
                                if (newBox.width < 5 || newBox.height < 5) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />

                        {/* Line Anchors for editing endpoints */}
                        {selectedElementId && currentSlide.elements && (() => {
                            const selectedElement = currentSlide.elements.find(el => el.id === selectedElementId);
                            if (selectedElement && (selectedElement.type === 'line' || selectedElement.type === 'arrow')) {
                                return (
                                    <LineAnchors
                                        element={selectedElement}
                                        onUpdate={updateElement}
                                        stageRef={stageRef}
                                    />
                                );
                            }
                            return null;
                        })()}
                    </Layer>
                </Stage>

                {/* Text Edit Overlay */}
                {editingTextId && currentSlide.elements && (() => {
                    const editingElement = currentSlide.elements.find(el => el.id === editingTextId);
                    return editingElement ? (
                        <TextEditOverlay
                            element={editingElement}
                            onUpdate={handleTextUpdate}
                            onClose={handleTextEditClose}
                            stageRef={stageRef}
                        />
                    ) : null;
                })()}

                {/* Text Format Toolbar - Show if selected OR editing */}
                {(() => {
                    // Use editing element ID or selected element ID
                    const targetId = editingTextId || selectedElementId;
                    if (!targetId || !currentSlide.elements) return null;

                    const targetElement = currentSlide.elements.find(el => el.id === targetId);
                    if (targetElement?.type === 'text') {
                        return (
                            <TextFormatToolbar
                                element={targetElement}
                                onUpdate={updateElement}
                                position={{
                                    x: targetElement.x + (targetElement.width / 2),
                                    y: targetElement.y
                                }}
                            />
                        );
                    }
                    return null;
                })()}

                {/* Snap guides */}
                {(snapGuides.vertical !== null || snapGuides.horizontal !== null) && (
                    <Stage
                        width={STAGE_WIDTH}
                        height={STAGE_HEIGHT}
                        listening={false}
                        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                    >
                        <Layer listening={false}>
                            {snapGuides.vertical !== null && (
                                <Line
                                    points={[snapGuides.vertical, 0, snapGuides.vertical, STAGE_HEIGHT]}
                                    stroke="#8b5cf6"
                                    strokeWidth={1}
                                    dash={[6, 4]}
                                    listening={false}
                                />
                            )}
                            {snapGuides.horizontal !== null && (
                                <Line
                                    points={[0, snapGuides.horizontal, STAGE_WIDTH, snapGuides.horizontal]}
                                    stroke="#8b5cf6"
                                    strokeWidth={1}
                                    dash={[6, 4]}
                                    listening={false}
                                />
                            )}
                        </Layer>
                    </Stage>
                )}

                {/* Shape Format Toolbar - MOVED TO PropertiesPanel
                {(() => {
                    if (!selectedElementId || !currentSlide.elements) return null;

                    const selectedElement = currentSlide.elements.find(el => el.id === selectedElementId);
                    const shapeTypes = ['rect', 'circle', 'triangle', 'star', 'ellipse'];

                    if (selectedElement && shapeTypes.includes(selectedElement.type)) {
                        // Calculate position based on element type
                        let posX, posY;
                        if (selectedElement.type === 'circle' || selectedElement.type === 'ellipse') {
                            posX = selectedElement.x;
                            posY = selectedElement.y;
                        } else if (selectedElement.type === 'star') {
                            posX = selectedElement.x;
                            posY = selectedElement.y;
                        } else {
                            // rect, triangle
                            posX = selectedElement.x + (selectedElement.width / 2);
                            posY = selectedElement.y;
                        }

                        return (
                            <ShapeFormatToolbar
                                element={selectedElement}
                                onUpdate={updateElement}
                                position={{ x: posX, y: posY }}
                            />
                        );
                    }
                    return null;
                })()}
                */}

                {/* Rotation Angle Display */}
                {rotationDisplay && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${rotationDisplay.x + 15}px`,
                            top: `${rotationDisplay.y - 10}px`,
                            pointerEvents: 'none',
                            zIndex: 2000,
                        }}
                    >
                        <div className="bg-violet-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium">
                            {rotationDisplay.angle}°
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EditorCanvas 