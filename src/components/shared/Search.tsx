import { forwardRef, useEffect, useRef, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import useDebounce from '../../hooks/useDebounce';
import { useMouseClick } from '../../hooks/useMouse';
import { useGetCitiesQuery } from '../../redux/feature/book/bookApi';
import { setCityFilter, setSearch } from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cn } from '../../utility/cn';
import Button from './Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './cusSelect/CustomSelect';
import Input from './Input';

type SearchProps = {
  onClose?: () => void;
  className?: string;
  placeholder?: string;
  isShowSearchButton?: boolean;
  isShowSearchInput?: boolean;
  isShowSearchCity?: boolean;
};

const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      onClose,
      className,
      placeholder,
      isShowSearchButton = true,
      isShowSearchInput = true,
      isShowSearchCity = true,
    },
    forwardedRef,
  ) => {
    const { city, search } = useAppSelector((state) => state.filter.filter);
    const dispatch = useAppDispatch();

    const internalInputRef = useRef<HTMLInputElement | null>(null);
    const { reference } = useMouseClick();
    const { data } = useGetCitiesQuery(undefined);

    const [query, setQuery] = useState<string>(search);
    const debouncedSearch = useDebounce(query, 300);

    /** 🔹 Sync debounced search */
    useEffect(() => {
      dispatch(setSearch(debouncedSearch));
    }, [debouncedSearch, dispatch]);

    /** 🔹 Sync redux → local */
    useEffect(() => {
      setQuery(search);
    }, [search]);

    /** 🔹 Merge forwarded ref + internal ref */
    const setRefs = (el: HTMLInputElement | null) => {
      internalInputRef.current = el;

      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };

    return (
      <div ref={reference} className="relative w-full">
        <div
          className={cn(
            'w-full h-[48px] rounded-3xl bg-white border border-platinumMix shadow-sm flex items-center justify-between px-4 gap-2 transition-all duration-300 ease-in-out',
            className,
          )}
        >
          {isShowSearchInput && (
            <Input
              ref={setRefs}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder || 'Search Books...'}
              type="text"
              className="w-full h-full outline-none border-none px-3 py-1 !bg-white placeholder:text-grayDark placeholder:text-xs"
            />
          )}

          <div className="flex items-center gap-2 shrink-0">
            {isShowSearchCity && (
              <Select
                value={city ?? ''}
                onValueChange={(val) => dispatch(setCityFilter(val === '__all' ? '' : val))}
              >
                <SelectTrigger className="flex items-center gap-1 rounded-full bg-primary-light h-8 px-2 text-primary">
                  <FaLocationDot />
                  <SelectValue placeholder="All cities" />
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
            )}

            {isShowSearchButton && (
              <Button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-primary text-white hover:bg-blue-600 flex items-center justify-center shrink-0"
                aria-label="Close search"
              >
                <IoSearch className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Search.displayName = 'Search';

export default Search;
