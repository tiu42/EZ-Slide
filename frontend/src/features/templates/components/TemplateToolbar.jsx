import React from 'react';
import { Search, Filter } from 'lucide-react';
import InputField from '../../../components/ui/InputField';

export const TemplateToolbar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'creative', label: 'Creative' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'technology', label: 'Technology' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      
      {/* Search Bar */}
      <div className="w-full sm:w-80">
        <InputField 
            placeholder="Search templates..." 
            icon={Search} 
            className="border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <span className="text-sm text-slate-600 font-medium hidden sm:inline">Category:</span>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TemplateToolbar;
