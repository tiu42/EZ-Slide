import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import Button from '../../../components/ui/Button';
import InputField from '../../../components/ui/InputField';

export const SlideToolbar = ({ viewMode, setViewMode, onCreateNew, searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/20">

      {/* Search Bar */}
      <div className="w-full sm:w-80">
        <InputField
          placeholder="Tìm kiếm slide..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Actions Right */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">

        {/* View Toggle */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            title="Xem dạng lưới"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            title="Xem dạng danh sách"
          >
            <List size={18} />
          </button>
        </div>

        <Button onClick={onCreateNew}>
          + Slide mới
        </Button>
      </div>
    </div>
  );
};