import { SwapType } from '../../../types/enum';
import { blobToBase64, convertedURLToFile, urlToDataUrl } from '../../utility/helper';
import { IAddUpdateBook, IBookData } from './types/interface';

// DEFAULT VALUES
export const getDefaultValues = (bookData?: IBookData) => ({
  title: bookData?.title || '',
  author: bookData?.author || '',
  description: bookData?.description || '',
  language: bookData?.language || '',
  condition: bookData?.condition || '',
  genres: bookData?.genres || [],
  coverPhotos: bookData?.coverPhotoUrls || [],
  swapType: parseSwapType(bookData?.swapCondition?.swapType),
  swappableBooks: getDefaultSwappableBooks(bookData),
  swappableGenres: getDefaultSwappableGenres(bookData),
});

// SET DEFAULT SWAP TYPE
function parseSwapType(value: string | undefined): SwapType {
  if (!value) return SwapType.BYBOOKS;
  return Object.values(SwapType).includes(value as SwapType)
    ? (value as SwapType)
    : SwapType.BYBOOKS;
}

// SET DEFAULT SWAPPABLE BOOKS
const getDefaultSwappableBooks = (bookData?: IBookData) =>
  bookData?.swapCondition?.swappableBooks?.map(({ id, title, author, coverPhotoUrl }) => ({
    id: id || '',
    title: title || '',
    author: author || '',
    coverPhoto: coverPhotoUrl || null,
    flag: true,
  })) || [{ id: '', title: '', author: '', coverPhoto: null, flag: false }];

// SET DEFAULT SWAPPABLE GENRES
const getDefaultSwappableGenres = (bookData?: IBookData) =>
  bookData?.swapCondition?.swappableGenres?.map(({ name }) => name) || [];

// <========= BUILD CREATE AND UPDATE BOOK FORM DATA =========>
export const buildFormData = async (
  data: IAddUpdateBook,
  ownerId?: string,
  bookId?: string,
): Promise<FormData> => {
  const formData = new FormData();

  // SET USER ID & BOOK ID
  if (ownerId) formData.append('ownerId', ownerId);
  if (bookId) formData.append('id', bookId);

  // SET BASIC INFORMATION
  appendBasicBookInformation(formData, data);

  // SET BOOK COVER IMAGES
  await processBookCoversForBasicInformation(formData, data.coverPhotos);

  // SET SWAP CONDITION INFORMATION
  await appendSwapConditionInformation(formData, data);

  return formData;
};

//  PROCESS BOOK COVERS FOR BASIC INFORMATION
const processBookCoversForBasicInformation = async (
  formData: FormData,
  covers: (File | string)[],
) => {
  const processCover = async (cover: File | string) => {
    if (cover instanceof File) return cover;
    if (typeof cover === 'string') return convertedURLToFile(cover);
    return null;
  };
  const processedCovers = await Promise.all(covers.map(processCover));
  processedCovers.forEach((cover) => cover && formData.append('coverPhotos', cover));
};

// BASIC BOOK INFORMATION
const appendBasicBookInformation = (formData: FormData, data: IAddUpdateBook) => {
  formData.append('title', data.title);
  formData.append('author', data.author);
  formData.append('description', data.description);
  formData.append('genres', data.genres.join(','));
  formData.append('language', data.language);
  formData.append('condition', data.condition);
};

// BOOK SWAP CONDITION INFORMATION
export const appendSwapConditionInformation = async (formData: FormData, data: IAddUpdateBook) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swapCondition: Record<string, any> = {
    swapType: data.swapType,
    giveAway: false,
    openForOffers: false,
  };

  switch (data.swapType) {
    case SwapType.BYBOOKS:
      swapCondition.books = await Promise.all(
        data.swappableBooks.map(async (swappableBook) => ({
          title: swappableBook.title,
          author: swappableBook.author,
          coverPhoto:
            swappableBook.coverPhoto instanceof File
              ? await blobToBase64(swappableBook.coverPhoto)
              : await urlToDataUrl(swappableBook.coverPhoto || ''),
        })),
      );
      break;

    case SwapType.OPENTOOFFERS:
      swapCondition.openForOffers = true;
      break;

    case SwapType.BYGENRES:
      swapCondition.genres = data.swappableGenres.join(',');
      break;

    case SwapType.GIVEAWAY:
      swapCondition.giveAway = true;
      break;
  }

  formData.append('swapCondition', JSON.stringify(swapCondition));
};

export const SWAP_TYPES = [
  { value: SwapType.OPENTOOFFERS, label: 'Open To Offers' },
  { value: SwapType.BYBOOKS, label: 'By Books' },
  { value: SwapType.BYGENRES, label: 'By Genres' },
  { value: SwapType.GIVEAWAY, label: 'Give Away' },
];
