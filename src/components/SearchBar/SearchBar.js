import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search posts...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-input"
      />
      {searchTerm && (
        <button
          className="search-clear"
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
