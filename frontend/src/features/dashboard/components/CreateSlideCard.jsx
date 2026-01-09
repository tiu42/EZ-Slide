import React, { useState } from 'react'
import Card from '../../../components/ui/Card';
import { Plus } from 'lucide-react';

const CreateSlideCard = ({ onClick }) => {
    return (
        <Card interactive onClick={onClick} className="flex flex-col items-center justify-center p-6 h-40 md:h-48 border-dashed border-2 border-purple-400/30 hover:border-purple-400 hover:bg-purple-500/5 group bg-transparent backdrop-blur-none">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <h3 className="font-semibold text-white text-sm md:text-base">Tạo slide mới</h3>
        </Card>
    )
}

export default CreateSlideCard