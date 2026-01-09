import React, { useState } from 'react';
import { X, Presentation } from 'lucide-react';
import Button from '../../../components/ui/Button';
import InputField from '../../../components/ui/InputField';

const CreatePresentationModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [title, setTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(title || 'Untitled Presentation');
        setTitle(''); // Reset after submit
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e1e2d] border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Presentation size={20} className="text-purple-400" />
                        Tạo slide mới
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-300 text-sm mb-6">
                        Đặt tên cho bài thuyết trình của bạn để bắt đầu.
                    </p>

                    <InputField
                        label="Tên bài thuyết trình"
                        placeholder="Nhập tên slide (VD: Kế hoạch kinh doanh Q1)..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        className="mb-8"
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                        >
                            Tạo mới
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePresentationModal;
