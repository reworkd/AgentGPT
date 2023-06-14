import React, { ChangeEvent, FC } from 'react';

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ setSearchQuery, setCategory }) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  return (
    <div className="mb-4 justify-center p-2 border-2 border-white/20 rounded-lg text-white bg-zinc-900 transition-colors hover:bg-zinc-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="flex-grow flex space-x-2 w-full">
        <input
          type="search"
          className="flex-grow py-1 border border-white/20 rounded-md placeholder-white shadow-sm focus:outline-none focus:ring-white focus:border-white bg-zinc-900 text-white"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="button-addon2"
          onChange={handleSearchChange}
        />
        <button className="hidden transition-colors duration-300 sm:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Enter
        </button>
      </div>
      <div className="w-full sm:w-auto">
        <select
          id="category"
          name="category"
          className="block w-full py-1 px-2 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white sm:text-sm bg-zinc-900 text-white"
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          <option>Health and Fitness</option>
          <option>Creative and social</option>
          <option>Academics and Professional</option>
          <option>Other</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
