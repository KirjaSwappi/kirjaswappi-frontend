import { Search } from 'lucide-react';
import { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';

interface ILocation {
  name: string;
  code: string;
}

const locations: ILocation[] = [
  { name: 'Helsinki', code: 'HE' },
  { name: 'Stockholm', code: 'ST' },
  { name: 'Copenhagen', code: 'CP' },
  { name: 'Oslo', code: 'OS' },
];

export default function BookSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ILocation>(locations[0]);

  return (
    <div className="space-y-4  ">
      <div className=" overflow-hidden flex flex-col sm:flex-row gap-2 sm:gap-3 bg-white rounded-full p-2  border  border-gray  ">
        <div className=" flex justify-between items-center ">
          <IoIosSearch size={24} className="text-grayDark block lg:hidden " />

          <Input
            type="text"
            placeholder="What book are you looking for ?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="  flex-1 border-0  py-2 text-sm sm:text-base focus-visible:ring-0 placeholder:text-gray-400 overflow-hidden bg-white lg:bg-white lg:bge "
          />
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-1 px-3 py-2 bg-[#dbedff] border border-[#badbfd] rounded-full text-[#3879E9]">
          <FaLocationDot className="size-4  " />
          <select
            value={selectedLocation.code}
            onChange={(e) => {
              const location = locations.find((l) => l.code === e.target.value);
              if (location) setSelectedLocation(location);
            }}
            className="bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer   "
          >
            {locations.map((loc) => (
              <option className="  " key={loc.code} value={loc.code}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 h-auto flex items-center gap-2 transition-colors"
        >
          <Search className="size-5 " />
        </Button>
      </div>
    </div>
  );
}
