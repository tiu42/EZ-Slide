import React, { useEffect, useRef } from 'react';

const TextEditOverlay = ({ element, onUpdate, onClose, stageRef }) => {
    // onUpdate now accepts an object with updates like { text, height }
    const textareaRef = useRef(null);
    const overlayRef = useRef(null);

    // Auto-resize textarea
    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
            resizeTextarea();
        }
    }, []);

    // Calculate position based on element position
    const getPosition = () => {
        if (!element) return { top: 0, left: 0 };
        return {
            top: `${element.y}px`,
            left: `${element.x}px`,
        };
    };

    const handleBlur = (e) => {
        // If clicking on toolbar (which might have its own focus logic), we might want to delay?
        // But with onMouseDown preventDefault in toolbar, blur shouldn't happen for buttons.
        // However, inputs (like color picker) might need focus.

        // Check if the new focus target is inside the toolbar (we can't easily check ref here without context)
        // But preventing default on toolbar start is key.

        if (textareaRef.current) {
            const newText = textareaRef.current.value;
            // Calculate the height needed for the content
            const contentHeight = textareaRef.current.scrollHeight;

            // Update both text and height if changed
            if (newText !== element.text || contentHeight > element.height) {
                // Update with new text and expanded height if needed
                const updates = { text: newText };
                if (contentHeight > element.height) {
                    updates.height = contentHeight;
                }
                onUpdate(updates);
            }
        }

        // If related target is the stage or something else, close. 
        // We rely on standard blur for now.
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleInput = () => {
        resizeTextarea();
    };

    const position = getPosition();

    // Vertical align mapping
    const justifyContentMap = {
        'top': 'flex-start',
        'middle': 'center',
        'bottom': 'flex-end',
    };
    const justifyContent = justifyContentMap[element.verticalAlign] || 'flex-start';

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'absolute',
                ...position,
                zIndex: 1000,
                width: `${element.width}px`,
                // Use minHeight to replicate frame, allow expansion
                minHeight: element.height ? `${element.height}px` : 'auto',
                border: '1px dashed #94a3b8',
                background: 'rgba(255, 255, 255, 0.1)',
                boxSizing: 'content-box',
                margin: '-1px', // Offset border
                display: 'flex',
                flexDirection: 'column',
                justifyContent: justifyContent,
            }}
        >
            <textarea
                ref={textareaRef}
                defaultValue={element.text}
                rows={1}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                style={{
                    width: '100%',
                    // Height is auto-controlled by resizeTextarea
                    background: 'transparent',
                    border: 'none',
                    padding: '0px',
                    margin: '0px',
                    outline: 'none',
                    resize: 'none',
                    overflow: 'hidden',

                    // Text Styles
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.fontFamily || 'Arial',
                    fontWeight: element.fontStyle?.includes('bold') ? 'bold' : 'normal',
                    fontStyle: element.fontStyle?.includes('italic') ? 'italic' : 'normal',
                    textDecoration: element.textDecoration || 'none',
                    color: element.fill || '#000000',
                    textAlign: element.align || 'left',
                    lineHeight: 1.2,
                }}
            />
        </div>
    );
};

export default TextEditOverlay;
