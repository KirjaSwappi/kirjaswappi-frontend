import { useEffect, useRef, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import useDebounce from '../../hooks/useDebounce';
import { useMouseClick } from '../../hooks/useMouse';
import { useGetCitiesQuery } from '../../redux/feature/book/bookApi';
import { setCityFilter, setSearch } from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cn } from '../../utility/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './cusSelect/CustomSelect';
import Input from './Input';

export default function Search({
  onClose,
  className,
  placeholder,
}: {
  onClose?: () => void;
  className?: string;
  placeholder?: string;
}) {
  const { city, search } = useAppSelector((state) => state.filter.filter);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>(search);
  const debouncedSearch = useDebounce(query, 300);
  const { reference } = useMouseClick();
  const { data } = useGetCitiesQuery(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    setQuery(search);
  }, [search]);
  return (
    <div ref={reference} className="relative w-full">
      <div
        className={cn(
          'w-full h-[48px] rounded-3xl bg-white border border-platinumMix shadow-sm flex items-center px-4 transition-all duration-300 ease-in-out gap-2',
          className,
        )}
      >
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search Books...'}
          type="text"
          className="w-full h-full lg:bg-white outline-none border-none px-3 py-1 placeholder:pl-3 md:placeholder:pl-6 placeholder:text-grayDark placeholder:font-poppins placeholder:text-xs bg-transparent"
        />
        <div className="flex items-center gap-2">
          <Select
            value={city ?? ''}
            onValueChange={(val) => dispatch(setCityFilter(val === '__all' ? '' : val))}
          >
            <SelectTrigger
              className="flex items-center justify-between gap-1 rounded-full bg-primary-light h-[26px] px-2 text-primary py-1 transition-all duration-300 ease-in-out cursor-pointer"
              style={{ height: '32px' }}
            >
              <div className="flex items-center gap-2">
                <FaLocationDot className="transition-transform duration-300 ease-in-out transform" />
                <SelectValue placeholder="All cities" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All cities</SelectItem>
              {data?.map((c: { name: string }) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-16 h-10 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 -mr-2"
            aria-label="Close search and return to menu"
          >
            <IoSearch className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
