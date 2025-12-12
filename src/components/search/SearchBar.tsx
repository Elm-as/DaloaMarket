import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { CATEGORIES } from '../../lib/utils';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  selectedCategory?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '', 
  className = '',
  selectedCategory
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const location = useLocation();
  // Si la prop selectedCategory est fournie, on l'utilise, sinon fallback URL
  const params = new URLSearchParams(location.search);
  const activeCategory = (selectedCategory ?? params.get('category') ?? '') + '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <input
            type="text"
            placeholder="Que recherchez-vous ?"
            className="w-full py-3 sm:py-3.5 lg:py-4 pl-10 sm:pl-12 lg:pl-14 pr-24 sm:pr-28 lg:pr-32 text-sm sm:text-base lg:text-lg rounded-xl lg:rounded-2xl border-2 border-grey-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-md group-hover:shadow-lg transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-3 sm:left-4 lg:left-5 top-3 sm:top-3.5 lg:top-4.5 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-grey-400" />
          <button 
            type="submit"
            className="absolute right-2 sm:right-2.5 lg:right-3 top-1.5 sm:top-2 lg:top-2 bg-primary text-white py-1.5 sm:py-2 lg:py-2.5 px-3 sm:px-4 lg:px-6 rounded-lg lg:rounded-xl hover:bg-primary-600 transition-colors font-semibold shadow-md hover:shadow-lg text-xs sm:text-sm lg:text-base"
          >
            Rechercher
          </button>
        </div>
      </form>
      
      {/* Quick filters */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 justify-center">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams(location.search);
                const current = params.get('category');
                if (current === cat.id) {
                  params.delete('category');
                  navigate(`/search?${params.toString()}`, { replace: true });
                } else {
                  params.set('category', cat.id);
                  navigate(`/search?${params.toString()}`, { replace: true });
                }
              }}
              className={
                `px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm font-medium transition-all ` +
                (isActive
                  ? 'bg-primary text-white border-primary-500 shadow-md'
                  : 'bg-white border-grey-200 text-grey-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary')
              }
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;