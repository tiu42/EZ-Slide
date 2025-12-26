import React from 'react'
import { Sidebar } from '../ui/Sidebar'
import { MobileHeader } from '../ui/MobileHeader'
import { useState } from 'react'

const MainLayout = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 flex flex-col h-full lg:ml-64 transition-all duration-300">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                {children}
            </main>
        </div>
    )
}

export default MainLayout