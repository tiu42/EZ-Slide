import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Star, Line, Arrow, Ellipse } from 'react-konva';
import useImage from 'use-image';

const URLImage = ({ src, crop, ...props }) => {
    const crossOrigin = src?.startsWith('http') ? 'anonymous' : undefined;
    const [image] = useImage(src, crossOrigin);
    if (!image) return null;

    const safeCrop = (() => {
        if (!crop) return { x: 0, y: 0, width: image.width, height: image.height };
        const x = Math.max(0, Math.min(crop.x ?? 0, image.width));
        const y = Math.max(0, Math.min(crop.y ?? 0, image.height));
        const w = Math.max(1, Math.min(crop.width ?? image.width, image.width - x));
        const h = Math.max(1, Math.min(crop.height ?? image.height, image.height - y));
        return { x, y, width: w, height: h };
    })();

    return <KonvaImage image={image} crop={safeCrop} {...props} />;
};

// Keep these in sync with the main editor canvas so scaling stays accurate
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const DEFAULT_THUMBNAIL_WIDTH = 200;
const DEFAULT_SCALE = DEFAULT_THUMBNAIL_WIDTH / CANVAS_WIDTH;
const DEFAULT_THUMBNAIL_HEIGHT = CANVAS_HEIGHT * DEFAULT_SCALE;

const SlideThumbnail = ({ slide }) => {
    const elements = slide?.elements || [];
    const background = slide?.background || '#ffffff';
    const [bgImage] = useImage(slide?.backgroundImage || null, 'anonymous');
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: DEFAULT_THUMBNAIL_WIDTH, height: DEFAULT_THUMBNAIL_HEIGHT, scale: DEFAULT_SCALE });

    // Resize Stage to parent width to avoid CSS scaling/cropping
    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth || DEFAULT_THUMBNAIL_WIDTH;
            const scale = width / CANVAS_WIDTH;
            setSize({
                width,
                height: CANVAS_HEIGHT * scale,
                scale
            });
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const { width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT, scale: SCALE } = size;

    return (
        <div ref={containerRef} className="w-full h-full">
            <Stage width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT}>
                <Layer>
                {/* Background */}
                <Rect
                    x={0}
                    y={0}
                    width={THUMBNAIL_WIDTH}
                    height={THUMBNAIL_HEIGHT}
                    fill={background}
                />

                {bgImage && (
                    (() => {
                        const scale = (slide?.backgroundImageFit || 'cover') === 'contain'
                            ? Math.min(THUMBNAIL_WIDTH / bgImage.width, THUMBNAIL_HEIGHT / bgImage.height)
                            : Math.max(THUMBNAIL_WIDTH / bgImage.width, THUMBNAIL_HEIGHT / bgImage.height);

                        const width = bgImage.width * scale;
                        const height = bgImage.height * scale;
                        const x = (THUMBNAIL_WIDTH - width) / 2;
                        const y = (THUMBNAIL_HEIGHT - height) / 2;

                        return (
                            <KonvaImage
                                image={bgImage}
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                            />
                        );
                    })()
                )}

                {/* Render all elements scaled down */}
                {elements.map((element) => {
                    const { id, x, y, rotation } = element;
                    const commonProps = {
                        x: x * SCALE,
                        y: y * SCALE,
                        rotation: rotation,
                        listening: false, // Disable interactions in thumbnail
                    };

                    if (element.type === 'rect') {
                        return (
                            <Rect
                                key={id}
                                {...commonProps}
                                width={element.width * SCALE}
                                height={element.height * SCALE}
                                fill={element.fill}
                            />
                        );
                    } else if (element.type === 'circle') {
                        return (
                            <Ellipse
                                key={id}
                                {...commonProps}
                                radiusX={(element.radiusX || element.radius || 50) * SCALE}
                                radiusY={(element.radiusY || element.radius || 50) * SCALE}
                                fill={element.fill}
                                stroke={element.stroke}
                                strokeWidth={(element.strokeWidth || 0) * SCALE}
                            />
                        );
                    } else if (element.type === 'triangle') {
                        return (
                            <Line
                                key={id}
                                {...commonProps}
                                points={[
                                    (element.width / 2) * SCALE, 0,
                                    element.width * SCALE, element.height * SCALE,
                                    0, element.height * SCALE
                                ]}
                                closed
                                fill={element.fill}
                                stroke={element.stroke}
                                strokeWidth={(element.strokeWidth || 0) * SCALE}
                            />
                        );
                    } else if (element.type === 'star') {
                        return (
                            <Star
                                key={id}
                                {...commonProps}
                                numPoints={element.numPoints || 5}
                                innerRadius={(element.innerRadius || 30) * SCALE}
                                outerRadius={(element.outerRadius || 50) * SCALE}
                                fill={element.fill}
                                stroke={element.stroke}
                                strokeWidth={(element.strokeWidth || 0) * SCALE}
                            />
                        );
                    } else if (element.type === 'ellipse') {
                        return (
                            <Ellipse
                                key={id}
                                {...commonProps}
                                radiusX={(element.radiusX || 60) * SCALE}
                                radiusY={(element.radiusY || 40) * SCALE}
                                fill={element.fill}
                                stroke={element.stroke}
                                strokeWidth={(element.strokeWidth || 0) * SCALE}
                            />
                        );
                    } else if (element.type === 'line') {
                        return (
                            <Line
                                key={id}
                                {...commonProps}
                                points={(element.points || []).map((p) => p * SCALE)}
                                stroke={element.stroke}
                                strokeWidth={(element.strokeWidth || 3) * SCALE}
                            />
                        );
                    } else if (element.type === 'arrow') {
                        return (
                            <Arrow
                                key={id}
                                {...commonProps}
                                points={(element.points || []).map((p) => p * SCALE)}
                                stroke={element.stroke}
                                strokeWidth={(element.strokeWidth || 3) * SCALE}
                                pointerLength={(element.pointerLength || 15) * SCALE}
                                pointerWidth={(element.pointerWidth || 15) * SCALE}
                                fill={element.stroke}
                            />
                        );
                    } else if (element.type === 'text') {
                        return (
                            <Text
                                key={id}
                                {...commonProps}
                                text={element.text}
                                fontSize={element.fontSize * SCALE}
                                fontFamily={element.fontFamily || 'Arial'}
                                fontStyle={element.fontStyle || 'normal'}
                                textDecoration={element.textDecoration || ''}
                                align={element.align || 'left'}
                                verticalAlign={element.verticalAlign || 'top'}
                                lineHeight={1.2}
                                fill={element.fill}
                                width={element.width * SCALE}
                                height={(element.height || element.fontSize || 24) * SCALE}
                            />
                        );
                    } else if (element.type === 'image') {
                        return (
                            <URLImage
                                key={id}
                                {...commonProps}
                                src={element.src}
                                width={element.width * SCALE}
                                height={element.height * SCALE}
                                crop={element.crop}
                            />
                        );
                    }
                    return null;
                })}
            </Layer>
            </Stage>
        </div>
    );
};

export default SlideThumbnail;
