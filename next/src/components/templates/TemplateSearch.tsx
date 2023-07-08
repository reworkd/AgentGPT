import type { ChangeEvent, FC } from "react";
import React from "react";

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
    <div className="flex flex-row items-center gap-2 py-2">
      <div className="flex w-full flex-grow space-x-2">
        <input
          type="search"
          className="background-color-1 text-color-primary placeholder:text-color-tertiary border-color-2 border-focusVisible-1 flex-grow rounded-md py-1 shadow-sm"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="button-addon2"
          onChange={handleSearchChange}
        />
      </div>
      <div className="w-full sm:w-auto">
        <select
          id="category"
          name="category"
          className="background-color-1 text-color-primary border-color-2 border-focusVisible-1 block w-full rounded-md px-2 py-1 shadow-sm sm:text-sm"
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
