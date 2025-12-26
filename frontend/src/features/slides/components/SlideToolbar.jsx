import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import Button from '../../../components/ui/Button';
import InputField from '../../../components/ui/InputField';

export const SlideToolbar = ({ viewMode, setViewMode, onToggleMobileFilter }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      
      {/* Search Bar */}
      <div className="w-full sm:w-80">
        <InputField 
            placeholder="Search slides..." 
            icon={Search} 
            className="border-slate-200"
        />
      </div>

      {/* Actions Right */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Grid View"
            >
                <LayoutGrid size={18} />
            </button>
            <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="List View"
            >
                <List size={18} />
            </button>
        </div>

        <Button>
            + New Slide
        </Button>
      </div>
    </div>
  );
};