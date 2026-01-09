import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditorProvider, useEditor } from '../features/editor/contexts/EditorContext'
import EditorHeader from '../features/editor/components/EditorHeader'
import EditorSidebar from '../features/editor/components/EditorSidebar'
import EditorToolbar from '../features/editor/components/EditorToolbar'
import EditorCanvas from '../features/editor/components/EditorCanvas'
import EditorFooter from '../features/editor/components/EditorFooter'
import PropertiesPanel from '../features/editor/components/PropertiesPanel'

const EditorContent = () => {
  const { presentation, loading, error } = useEditor();

  useEffect(() => {
    if (presentation?.title) {
      document.title = `${presentation.title} - Ez-Slide`;
    }
    return () => {
      document.title = 'Ez-Slide';
    }
  }, [presentation]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-slate-500">Loading editor...</div>
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-800 font-sans">
      <EditorHeader />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar />

        <main className="flex-1 flex flex-col relative bg-slate-100">
          <EditorToolbar />
          <div className="flex-1 flex overflow-hidden">
            <EditorCanvas />
            <PropertiesPanel />
          </div>
          {/* <EditorFooter /> */}
        </main>
      </div>
    </div>
  )
}

const Editor = () => {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  )
}


export default Editor