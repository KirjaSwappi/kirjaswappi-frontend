import { IconType } from 'react-icons';
import { BsPerson } from 'react-icons/bs';
import {
  GiBookCover,
  GiCastle,
  GiCompass,
  GiDramaMasks,
  GiMagnifyingGlass,
  GiSpellBook,
} from 'react-icons/gi';
import { IoHeartOutline } from 'react-icons/io5';
import {
  LuBook,
  LuBookMarked,
  LuBookOpen,
  LuBrain,
  LuClock,
  LuFlame,
  LuLightbulb,
} from 'react-icons/lu';
import { MdChildCare } from 'react-icons/md';

const genreIconMap: Record<string, IconType> = {
  Fiction: LuBookOpen,
  'Non-Fiction': LuBookMarked,
  Adventure: GiCompass,
  Biography: BsPerson,
  Thriller: LuFlame,
  Fantasy: GiCastle,
  Productivity: LuLightbulb,
  Romance: IoHeartOutline,
  History: LuClock,
  Science: LuBrain,
  Children: MdChildCare,
  Mystery: GiMagnifyingGlass,
  Drama: GiDramaMasks,
  'Science Fiction': GiSpellBook,
  'Self-Help': GiBookCover,
};

export const defaultGenreIcon: IconType = LuBook;

export function getGenreIcon(name: string): IconType {
  return genreIconMap[name] ?? defaultGenreIcon;
}
