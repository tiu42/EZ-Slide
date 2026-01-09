import React, { useRef } from 'react';
import { Circle } from 'react-konva';

const LineAnchors = ({ element, onUpdate, stageRef }) => {
    if (!element || (element.type !== 'line' && element.type !== 'arrow')) {
        return null;
    }

    const points = element.points || [0, 0, 100, 100];
    const [x1, y1, x2, y2] = points;

    const isDragging = useRef(false);

    // Handle anchor drag
    const handleAnchorDragMove = (index, e) => {
        isDragging.current = true;
        const stage = stageRef.current;
        if (!stage) return;

        // Get stage position to calculate offset
        const stageBox = stage.container().getBoundingClientRect();

        // Get the pointer position relative to the page
        const pointerPos = stage.getPointerPosition();

        // Pointer position is already relative to stage, no need to adjust
        // Convert to relative coordinates (relative to line element position)
        const relX = pointerPos.x - element.x;
        const relY = pointerPos.y - element.y;

        const newPoints = [...points];
        if (index === 0) {
            // Start point
            newPoints[0] = relX;
            newPoints[1] = relY;
        } else {
            // End point
            newPoints[2] = relX;
            newPoints[3] = relY;
        }

        // Update line points
        onUpdate(element.id, { points: newPoints });
    };

    const handleDragEnd = () => {
        isDragging.current = false;
    };

    const anchorProps = {
        radius: 6,
        fill: '#fff',
        stroke: '#5b21b6',
        strokeWidth: 2,
        draggable: true,
        hitStrokeWidth: 20,
    };

    return (
        <>
            {/* Start anchor */}
            <Circle
                x={element.x + x1}
                y={element.y + y1}
                {...anchorProps}
                dragBoundFunc={function (pos) {
                    // Allow free movement
                    return pos;
                }}
                onDragMove={(e) => handleAnchorDragMove(0, e)}
                onDragEnd={handleDragEnd}
                onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage && !isDragging.current) stage.container().style.cursor = 'default';
                }}
            />

            {/* End anchor */}
            <Circle
                x={element.x + x2}
                y={element.y + y2}
                {...anchorProps}
                dragBoundFunc={function (pos) {
                    // Allow free movement
                    return pos;
                }}
                onDragMove={(e) => handleAnchorDragMove(1, e)}
                onDragEnd={handleDragEnd}
                onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage && !isDragging.current) stage.container().style.cursor = 'default';
                }}
            />
        </>
    );
};

export default LineAnchors;
