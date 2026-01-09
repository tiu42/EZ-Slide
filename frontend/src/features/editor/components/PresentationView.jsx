import React, { useState, useEffect, useRef } from 'react'
import { useEditor } from '../contexts/EditorContext'
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Transformer, Star, Line, Arrow, Ellipse, RegularPolygon } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'

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

    return (
        <KonvaImage
            image={image}
            crop={safeCrop}
            {...props}
        />
    );
};

const BackgroundImage = ({ src, fit = 'cover', stageWidth, stageHeight }) => {
    const [image] = useImage(src, 'anonymous');
    if (!image) return null;

    const scale = fit === 'contain'
        ? Math.min(stageWidth / image.width, stageHeight / image.height)
        : Math.max(stageWidth / image.width, stageHeight / image.height);

    const width = image.width * scale;
    const height = image.height * scale;
    const x = (stageWidth - width) / 2;
    const y = (stageHeight - height) / 2;

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

const PresentationView = ({ onExit }) => {
    const { presentation, currentSlideId, setCurrentSlideId } = useEditor()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [stageSize, setStageSize] = useState({ width: 800, height: 450 })
    const stageRef = useRef(null)
    const containerRef = useRef(null)

    // Request fullscreen on mount
    useEffect(() => {
        const container = containerRef.current
        if (container) {
            if (container.requestFullscreen) {
                container.requestFullscreen().catch(err => console.log('Fullscreen request failed:', err))
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen()
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen()
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen()
            }
        }

        // Handle fullscreen exit
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && 
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement) {
                onExit()
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('mozfullscreenchange', handleFullscreenChange)
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.addEventListener('msfullscreenchange', handleFullscreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
            document.removeEventListener('msfullscreenchange', handleFullscreenChange)
        }
    }, [onExit])

    // Set initial index when component mounts
    useEffect(() => {
        if (presentation?.slides && currentSlideId) {
            const index = presentation.slides.findIndex(s => s._id === currentSlideId)
            if (index !== -1) {
                setCurrentIndex(index)
            }
        }
    }, [presentation, currentSlideId])

    // Handle window resize to fill entire screen
    useEffect(() => {
        const handleResize = () => {
            setStageSize({ width: window.innerWidth, height: window.innerHeight })
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Calculate scale factor to fit 800x450 canvas to viewport
    const scaleX = stageSize.width / 800
    const scaleY = stageSize.height / 450

    const totalSlides = presentation?.slides?.length || 0
    const currentSlide = presentation?.slides?.[currentIndex]

    const renderElement = (element) => {
        const commonProps = {
            key: element._id,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation || 0,
            opacity: element.opacity ?? 1,
            listening: false,
        };

        switch (element.type) {
            case 'text':
                return (
                    <Text
                        {...commonProps}
                        text={element.text}
                        fontSize={element.fontSize || 16}
                        fontFamily={element.fontFamily || 'Arial'}
                        fill={element.fill || '#000000'}
                        align={element.align || 'left'}
                        verticalAlign={element.verticalAlign || 'top'}
                        fontStyle={element.fontStyle}
                        fontVariant={element.fontVariant}
                        textDecoration={element.textDecoration}
                        wrap={element.wrap || 'word'}
                        ellipsis={element.ellipsis}
                        lineHeight={element.lineHeight}
                        letterSpacing={element.letterSpacing}
                    />
                );
            case 'rect':
                return (
                    <Rect
                        {...commonProps}
                        fill={element.fill || '#ffffff'}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                        cornerRadius={element.cornerRadius}
                    />
                );
            case 'rectangle':
                return (
                    <Rect
                        {...commonProps}
                        fill={element.fill || '#ffffff'}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                        cornerRadius={element.cornerRadius}
                    />
                );
            case 'circle':
                return (
                    <Ellipse
                        key={element._id}
                        x={element.x}
                        y={element.y}
                        radiusX={element.radiusX || element.radius || (element.width || 0) / 2}
                        radiusY={element.radiusY || element.radius || (element.height || 0) / 2}
                        rotation={element.rotation || 0}
                        opacity={element.opacity ?? 1}
                        listening={false}
                        fill={element.fill || '#ffffff'}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                    />
                );
            case 'star':
                const outerRadius = element.outerRadius || Math.max((element.width || 0) / 2, (element.height || 0) / 2, 40)
                const innerRadius = element.innerRadius || outerRadius * 0.5
                return (
                    <Star
                        {...commonProps}
                        numPoints={element.numPoints || 5}
                        innerRadius={isNaN(innerRadius) ? 20 : innerRadius}
                        outerRadius={isNaN(outerRadius) ? 40 : outerRadius}
                        fill={element.fill || '#ffffff'}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                    />
                );
            case 'line':
                return (
                    <Line
                        {...commonProps}
                        points={element.points || []}
                        stroke={element.stroke || '#000000'}
                        strokeWidth={element.strokeWidth || 2}
                        lineCap={element.lineCap || 'round'}
                        lineJoin={element.lineJoin || 'round'}
                    />
                );
            case 'arrow':
                return (
                    <Arrow
                        {...commonProps}
                        points={element.points || []}
                        stroke={element.stroke || '#000000'}
                        strokeWidth={element.strokeWidth || 2}
                        fill={element.stroke || '#000000'}
                        pointerLength={element.pointerLength || 15}
                        pointerWidth={element.pointerWidth || 15}
                    />
                );
            case 'image':
                return (
                    <URLImage
                        {...commonProps}
                        src={element.src}
                        crop={element.crop}
                    />
                );
            case 'triangle':
                return (
                    <Line
                        {...commonProps}
                        points={[
                            element.width / 2, 0,
                            element.width, element.height,
                            0, element.height
                        ]}
                        closed
                        fill={element.fill || '#ffffff'}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                    />
                );
            case 'polygon':
                return (
                    <RegularPolygon
                        {...commonProps}
                        sides={element.sides || 5}
                        radius={(element.width || 0) / 2}
                        fill={element.fill || '#ffffff'}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                    />
                );
            default:
                return null;
        }
    };

    const handleNextSlide = () => {
        if (currentIndex < totalSlides - 1) {
            const nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
            setCurrentSlideId(presentation.slides[nextIndex]._id)
        }
    }

    const handlePreviousSlide = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1
            setCurrentIndex(prevIndex)
            setCurrentSlideId(presentation.slides[prevIndex]._id)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onExit()
        } else if (e.key === 'ArrowRight') {
            handleNextSlide()
        } else if (e.key === 'ArrowLeft') {
            handlePreviousSlide()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentIndex, totalSlides])

    if (!currentSlide) {
        return null
    }

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
            <Stage 
                ref={stageRef}
                width={stageSize.width} 
                height={stageSize.height}
                scaleX={scaleX}
                scaleY={scaleY}
            >
                <Layer>
                    {/* Background */}
                    <Rect
                        x={0}
                        y={0}
                        width={800}
                        height={450}
                        fill={currentSlide?.background || '#ffffff'}
                        listening={false}
                    />

                    {/* Background Image */}
                    {currentSlide?.backgroundImage && (
                        <BackgroundImage
                            src={currentSlide.backgroundImage}
                            fit={currentSlide.backgroundImageFit}
                            stageWidth={800}
                            stageHeight={450}
                        />
                    )}

                    {/* Elements */}
                    {currentSlide?.elements && currentSlide.elements.length > 0 && currentSlide.elements.map(element => renderElement(element))}
                </Layer>
            </Stage>
        </div>
    )
}

export default PresentationView
