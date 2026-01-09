import React from 'react';
import { Search, Filter } from 'lucide-react';
import InputField from '../../../components/ui/InputField';

export const TemplateToolbar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'business', label: 'Kinh doanh' },
    { value: 'education', label: 'Giáo dục' },
    { value: 'creative', label: 'Sáng tạo' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'technology', label: 'Công nghệ' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/20">

      {/* Search Bar */}
      <div className="w-full sm:w-80">
        <InputField
          placeholder="Tìm kiếm mẫu thiết kế..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <span className="text-sm text-gray-300 font-medium hidden sm:inline">Danh mục:</span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white text-sm font-medium hover:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-slate-800 text-white">
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TemplateToolbar;
