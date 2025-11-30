import { Search } from 'lucide-react';
import { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/shared/cusSelect/CustomSelect';

interface ILocation {
  label: string;
  value: string;
}

const locationOptions: ILocation[] = [
  { label: 'Helsinki', value: 'HE' },
  { label: 'Stockholm', value: 'ST' },
  { label: 'Copenhagen', value: 'CP' },
  { label: 'Oslo', value: 'OS' },
  { label: 'Oslo', value: 'OS1' },
  { label: 'Oslo', value: 'OS2' },
  { label: 'Oslo', value: 'OS3' },
  { label: 'Oslo', value: 'OS4' },
  { label: 'Oslo', value: 'OS5' },
  { label: 'Oslo', value: 'OS6' },
  { label: 'Oslo', value: 'OS7' },
];

export default function BookSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ILocation>(locationOptions[0]);

  return (
    <div className=" font-poppins overflow-hidden flex  justify-between items-center  bg-white rounded-full border  border-gray py-2 px-2  ">
      <div className="   pl-3 ">
        <Input
          type="text"
          placeholder="What book are you looking for ?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="  flex-1 border-0  py-2 text-sm sm:text-base focus-visible:ring-0 placeholder:text-gray-400 overflow-hidden bg-white lg:bg-white lg:bge "
        />
      </div>

      {/* Location Selector */}
      <div className=" flex items-center gap-2  ">
        <div className="SelectInputSection bg-[#BADBFD] border border-[#badbfd] rounded-2xl text-[#3879E9] flex items-center gap-2 py-1 px-3 relative ">
          <FaLocationDot className="size-4  " />

          <Select
            value={selectedLocation.value}
            onValueChange={(value) => {
              const loc = locationOptions.find((l) => l.value === value);
              if (loc) setSelectedLocation(loc);
            }}
          >
            <SelectTrigger className="bg-transparent shadow-none text-sm font-medium px-0 border-none outline-none focus:ring-0">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>

            <SelectContent className=" py-2 px-3 rounded-lg w-[215px] max-h-[294px] overflow-auto absolute top-4 -right-20 ">
              {locationOptions.map((loc) => (
                <SelectItem
                  key={loc.value}
                  value={loc.value}
                  className=" text-blackOlive hover:text-black cursor-pointer text-[15px] leading-[24px] py-1 border-b border-[#BADBFD] outline-none  "
                >
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2">
          <Search className="size-6 " />
        </Button>
      </div>
    </div>
  );
}
