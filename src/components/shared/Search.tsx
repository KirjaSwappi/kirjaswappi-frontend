import { useEffect, useRef, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useMouseClick } from '../../hooks/useMouse';
import { useAppDispatch } from '../../redux/hooks';
import { setSearch } from '../../redux/feature/filter/filterSlice';
import useDebounce from '../../hooks/useDebounce';
import { IoSearch } from 'react-icons/io5';

export default function Search({
  query,
  setQuery,
  onClose,
}: {
  query: string;
  setQuery: (q: string) => void;
  onClose?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { clicked, reference } = useMouseClick();
  const dispatch = useAppDispatch();
  const debouncedSearch = useDebounce(query, 300);

  useEffect(() => {
    inputRef.current?.focus(); // Focus when component mounts
  }, []);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value || '';
    setQuery(newQuery);
  };

  return (
    <div ref={reference} className="relative w-full">
      <div className="w-full h-[48px] rounded-3xl bg-white border border-[#E5E5E5] shadow-sm flex items-center px-4 transition-all duration-300 ease-in-out gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="text"
          placeholder="Find Books"
          className="w-full h-full outline-none border-none px-3 py-1 placeholder:pl-3 md:placeholder:pl-8 placeholder:text-grayDark placeholder:font-poppins placeholder:text-xs"
        />
        <div
          className="flex items-center justify-between gap-1 rounded-full bg-primary-light h-[26px] px-2 text-primary py-1 transition-all duration-300 ease-in-out"
          style={{ height: '32px' }}
        >
          <FaLocationDot className="transition-transform duration-300 ease-in-out transform" />
          <p className="font-normal text-xs font-poppins">Helsinki</p>
          <MdKeyboardArrowDown
            className={`
            transition-transform duration-300 ease-in-out transform
            ${isFocused ? 'rotate-180' : 'rotate-0'}
          `}
          />
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-16 h-10 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 -mr-2"
            aria-label="Close search and return to menu"
          >
            <IoSearch className="w-4 h-4" />
          </button>
        )}
      </div>

      {clicked && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col gap-2"></div>
        </div>
      )}
    </div>
  );
}
