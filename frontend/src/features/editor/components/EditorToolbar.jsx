import React, { useRef } from 'react'
import { useEditor } from '../contexts/EditorContext'

const EditorToolbar = () => {
    const { addElement } = useEditor();
    const imageInputRef = useRef(null);

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

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            event.target.value = '';
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            const meta = await getImageMeta(dataUrl);

            // Keep the image reasonably sized on drop
            const maxWidth = 500;
            const scale = meta.width > maxWidth ? maxWidth / meta.width : 1;
            const width = Math.round(meta.width * scale);
            const height = Math.round(meta.height * scale);

            addElement('image', {
                src: dataUrl,
                width,
                height,
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
            console.error('Failed to load image', err);
        } finally {
            event.target.value = '';
        }
    };

    const triggerImagePicker = () => {
        imageInputRef.current?.click();
    };

    return (
        <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 space-x-2 shrink-0 z-20">
            <button
                onClick={() => addElement('text')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Text"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button
                onClick={() => addElement('rect')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Rectangle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /></svg>
            </button>
            <button
                onClick={() => addElement('circle')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Circle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
            </button>
            <button
                onClick={() => addElement('triangle')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Triangle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z" /></svg>
            </button>
            <button
                onClick={() => addElement('star')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Star"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button
                onClick={() => addElement('line')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Line"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="20" x2="20" y2="4" /></svg>
            </button>
            <button
                onClick={() => addElement('arrow')}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Arrow"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></svg>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button
                onClick={triggerImagePicker}
                className="p-2 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors"
                title="Add Image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
            </button>
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
        </div>
    )
}

export default EditorToolbar