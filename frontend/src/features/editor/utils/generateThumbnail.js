import Konva from 'konva';

/**
 * Generates a thumbnail image from slide data
 * @param {Object} slide - The slide object containing elements
 * @returns {Promise<string>} - Base64 data URL of the thumbnail
 */
export const generateThumbnail = async (slide) => {
    if (!slide) return null;

    const thumbnailWidth = 320;
    const thumbnailHeight = 180;
    const scaleX = thumbnailWidth / 800;
    const scaleY = thumbnailHeight / 450;

    // Create an offscreen stage
    const stage = new Konva.Stage({
        container: document.createElement('div'),
        width: thumbnailWidth,
        height: thumbnailHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Background color
    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: thumbnailWidth,
        height: thumbnailHeight,
        fill: slide.background || '#ffffff',
    });
    layer.add(background);

    // Background image (optional)
    if (slide.backgroundImage) {
        await new Promise((resolve) => {
            const imageObj = new Image();
            imageObj.crossOrigin = 'Anonymous';
            imageObj.onload = () => {
                const fit = slide.backgroundImageFit || 'cover';
                const scale = fit === 'contain'
                    ? Math.min(thumbnailWidth / imageObj.width, thumbnailHeight / imageObj.height)
                    : Math.max(thumbnailWidth / imageObj.width, thumbnailHeight / imageObj.height);

                const width = imageObj.width * scale;
                const height = imageObj.height * scale;
                const x = (thumbnailWidth - width) / 2;
                const y = (thumbnailHeight - height) / 2;

                const bgImage = new Konva.Image({
                    x,
                    y,
                    width,
                    height,
                    image: imageObj,
                    listening: false,
                });
                layer.add(bgImage);
                resolve();
            };
            imageObj.onerror = () => resolve();
            imageObj.src = slide.backgroundImage;
        });
    }

    // Render elements
    const elements = slide.elements || [];

    for (const element of elements) {
        const commonProps = {
            x: element.x * scaleX,
            y: element.y * scaleY,
            rotation: element.rotation,
        };

        if (element.type === 'rect') {
            const rect = new Konva.Rect({
                ...commonProps,
                width: element.width * scaleX,
                height: element.height * scaleY,
                fill: element.fill,
            });
            layer.add(rect);
        } else if (element.type === 'circle') {
            const ellipse = new Konva.Ellipse({
                ...commonProps,
                radiusX: (element.radiusX || element.radius || 50) * scaleX,
                radiusY: (element.radiusY || element.radius || 50) * scaleY,
                fill: element.fill,
                stroke: element.stroke,
                strokeWidth: (element.strokeWidth || 0) * scaleX,
            });
            layer.add(ellipse);
        } else if (element.type === 'triangle') {
            const triangle = new Konva.Line({
                ...commonProps,
                points: [
                    (element.width / 2) * scaleX, 0,
                    element.width * scaleX, element.height * scaleY,
                    0, element.height * scaleY
                ],
                closed: true,
                fill: element.fill,
                stroke: element.stroke,
                strokeWidth: (element.strokeWidth || 0) * scaleX,
            });
            layer.add(triangle);
        } else if (element.type === 'star') {
            const star = new Konva.Star({
                ...commonProps,
                numPoints: element.numPoints || 5,
                innerRadius: (element.innerRadius || 30) * scaleX,
                outerRadius: (element.outerRadius || 50) * scaleX,
                fill: element.fill,
                stroke: element.stroke,
                strokeWidth: (element.strokeWidth || 0) * scaleX,
            });
            layer.add(star);
        } else if (element.type === 'ellipse') {
            const ellipse = new Konva.Ellipse({
                ...commonProps,
                radiusX: (element.radiusX || 60) * scaleX,
                radiusY: (element.radiusY || 40) * scaleY,
                fill: element.fill,
                stroke: element.stroke,
                strokeWidth: (element.strokeWidth || 0) * scaleX,
            });
            layer.add(ellipse);
        } else if (element.type === 'line') {
            const line = new Konva.Line({
                ...commonProps,
                points: (element.points || []).map((p, i) => i % 2 === 0 ? p * scaleX : p * scaleY),
                stroke: element.stroke,
                strokeWidth: (element.strokeWidth || 3) * scaleX,
            });
            layer.add(line);
        } else if (element.type === 'arrow') {
            const arrow = new Konva.Arrow({
                ...commonProps,
                points: (element.points || []).map((p, i) => i % 2 === 0 ? p * scaleX : p * scaleY),
                stroke: element.stroke,
                strokeWidth: (element.strokeWidth || 3) * scaleX,
                pointerLength: (element.pointerLength || 15) * scaleX,
                pointerWidth: (element.pointerWidth || 15) * scaleX,
                fill: element.stroke,
            });
            layer.add(arrow);
        } else if (element.type === 'text') {
            const text = new Konva.Text({
                ...commonProps,
                text: element.text,
                fontSize: element.fontSize * scaleX,
                fontFamily: element.fontFamily || 'Arial',
                fontStyle: element.fontStyle || 'normal',
                textDecoration: element.textDecoration || '',
                align: element.align || 'left',
                verticalAlign: element.verticalAlign || 'top',
                lineHeight: 1.2,
                fill: element.fill,
                width: element.width * scaleX,
                height: (element.height || element.fontSize || 24) * scaleY,
            });
            layer.add(text);
        } else if (element.type === 'image' && element.src) {
            // Load image and add to layer
            const imageObj = new Image();
            imageObj.crossOrigin = 'Anonymous';

            await new Promise((resolve) => {
                imageObj.onload = () => {
                    const konvaImage = new Konva.Image({
                        ...commonProps,
                        image: imageObj,
                        width: element.width * scaleX,
                        height: element.height * scaleY,
                    });
                    layer.add(konvaImage);
                    resolve();
                };
                imageObj.onerror = () => resolve(); // Skip on error
                imageObj.src = element.src;
            });
        }
    }

    layer.batchDraw();

    // Convert to data URL
    const dataURL = stage.toDataURL({
        pixelRatio: 2, // Higher quality
    });

    // Cleanup
    stage.destroy();

    return dataURL;
};
