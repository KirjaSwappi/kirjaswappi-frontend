import { useEffect, useRef, useState } from 'react';
import { FieldError, FieldErrors, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BiTargetLock } from 'react-icons/bi';
import addGenreIcon from '../../../assets/addGenre.png';
import closeIcon from '../../../assets/closeIcon.png';
import genreAddGenreIcon from '../../../assets/genreAddPlus.png';
import addmapIcon from '../../../assets/mapIcon.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import InputLabel from '../../../components/shared/InputLabel';
import { setOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { ISearchResult } from '../types/interface';
import LocationMap from './LocationMap';

export default function OtherDetailsStep({ errors }: { errors: FieldErrors }) {
  const { t } = useTranslation();
  const { open } = useAppSelector((state) => state.open);
  const dispatch = useAppDispatch();
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getValues, setValue, watch } = useFormContext();
  const genres = getValues('genres');
  const formAddress = watch('address');
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search query when form address changes
  useEffect(() => {
    if (formAddress?.address) {
      setSearchQuery(formAddress.address);
    }
  }, [formAddress?.address]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const displayName: string = data?.display_name || '';
      const addr = data?.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || '';
      const country = addr.country || '';
      const postalCode = addr.postcode || '';
      return { displayName, city, country, postalCode };
    } catch (e) {
      console.warn('Reverse geocode failed', e);
      return null;
    }
  };

  const forwardGeocode = async (query: string): Promise<ISearchResult[]> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data || [];
    } catch (e) {
      console.warn('Forward geocode failed', e);
      return [];
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    try {
      const results = await forwardGeocode(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSelect = (result: ISearchResult) => {
    const addressData = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name,
      city:
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        result.address?.county ||
        '',
      country: result.address?.country || '',
      postalCode: result.address?.postcode || '',
      radiusKm: 50,
    };

    setValue('address', addressData);
    setSearchQuery(result.display_name);
    setShowSearchDropdown(false);
    setSearchResults([]);
    setLocationError(null);
  };

  const handleCurrentLocation = async () => {
    setIsLoadingAddress(true);
    setLocationError(null);

    try {
      // Check if geolocation is available
      if (!('geolocation' in navigator)) {
        throw new Error(t('addBook.geoNotSupported'));
      }

      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        };

        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const { latitude, longitude } = position.coords;

      // Validate coordinates
      if (latitude == null || longitude == null) {
        throw new Error('Invalid coordinates received');
      }

      // Set basic address immediately
      const immediateAddress = {
        latitude,
        longitude,
        address: '',
        city: '',
        country: '',
        postalCode: '',
        radiusKm: 50,
      };

      setValue('address', immediateAddress);
      setSearchQuery(''); // Set search input immediately

      // Reverse geocode in background to get better address details
      try {
        const geo = await reverseGeocode(latitude, longitude);
        if (geo) {
          const updatedAddress = {
            ...immediateAddress,
            address: geo.displayName,
            city: geo.city,
            country: geo.country,
            postalCode: geo.postalCode,
          };
          setValue('address', updatedAddress);
          setSearchQuery(geo.displayName);
        }
      } catch (reverseError) {
        // Reverse geocoding failed, but we have coordinates
      }
    } catch (error) {
      console.error('Geolocation failed:', error);

      let errorMessage = '';

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('addBook.geoPermissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('addBook.geoPositionUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('addBook.geoTimeout');
            break;
          default:
            errorMessage = t('addBook.geoUnknownError');
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = t('addBook.geoUnknownError');
      }

      setLocationError(errorMessage);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleRemoveGenre = (genreValue: string) => {
    if (!genreValue) return;
    const genres = getValues('genres');
    setValue(
      'genres',
      genres?.filter((genre: string) => genre !== genreValue),
    );
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (formAddress && value !== formAddress.address) {
      setValue('address', null);
    }

    handleSearch(value);
  };

  return (
    <div className="pt-5 lg:pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-10 2xl:gap-20 md:gap-4">
        <div className="w-full">
          <div className="flex items-center justify-between border-b lg:border-b-0 border-platinumDark">
            <InputLabel label={t('common.genre')} required className="mb-0" />
          </div>
          <div>
            {genres && genres.length > 0 ? (
              <div className="flex flex-col gap-2 pt-4">
                {genres.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-4 bg-white lg:bg-AntiFlashWhite border border-platinum lg:border-gray rounded-lg"
                  >
                    <h3 className="font-poppins text-sm font-light">{item}</h3>
                    <Button onClick={() => handleRemoveGenre(item)}>
                      <Image src={closeIcon} alt="close" className="h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => dispatch(setOpen(!open))}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch(setOpen(!open))}
                className="h-40 lg:h-56 bg-[#F1F8FF] mt-3 flex items-center justify-center rounded-md border border-[#8CBEF2] border-dashed flex-col"
              >
                <div className="flex items-end mb-2">
                  <Image src={addGenreIcon} alt="genre" className="w-[68px] h-[60px]" />
                  <Image src={genreAddGenreIcon} alt="genre" className="w-4 h-4 mt-1" />
                </div>
                <p className="text-xs text-grayDark font-poppins">{t('addBook.clickToAddGenre')}</p>
              </div>
            )}
            {errors && errors['genres'] && (
              <div className="text-rose-500 text-xs mt-1 pl-2">
                {(errors['genres'] as FieldError)?.message}
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="border-b lg:border-b-0 border-platinumDark">
            <InputLabel label={t('editProfile.location')} required={false} className="mb-2" />
            <div ref={searchRef} className="relative">
              <div className="flex gap-2 bg-AntiFlashWhite border border-gray rounded-md">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchDropdown(true)}
                    placeholder={t('addBook.searchLocation')}
                    className="w-full px-4 py-3 bg-transparent 
  border-none focus:border-transparent 
  focus:ring-0 focus:outline-none 
  focus:shadow-none"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3879E9]"></div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  disabled={isLoadingAddress}
                  className="px-4 py-3  disabled:opacity-50 flex items-center justify-center min-w-[50px]"
                  title={t('addBook.useCurrentLocation')}
                >
                  {isLoadingAddress ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3879E9]"></div>
                  ) : (
                    <BiTargetLock />
                  )}
                </button>
              </div>

              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-platinum rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSearchSelect(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm text-gray-900">{result.display_name}</div>
                    </button>
                  ))}
                </div>
              )}

              {showSearchDropdown && searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-platinum rounded-lg shadow-lg z-10 p-4">
                  <div className="text-sm text-gray-500 text-center">
                    {t('addBook.noLocationsFound')}
                  </div>
                </div>
              )}
            </div>

            {locationError && (
              <div className="mt-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-xs text-rose-700">{locationError}</p>
              </div>
            )}
          </div>

          <div>
            {formAddress ? (
              <div className="flex flex-col gap-4">
                <LocationMap
                  position={[formAddress.latitude, formAddress.longitude]}
                  isEditing={true}
                  onPositionChange={async (newPos) => {
                    const [latitude, longitude] = newPos;
                    const baseUpdated = { ...formAddress, latitude, longitude };

                    try {
                      const geo = await reverseGeocode(latitude, longitude);
                      if (geo) {
                        const updatedAddress = {
                          ...baseUpdated,
                          address: geo.displayName,
                          city: geo.city,
                          country: geo.country,
                          postalCode: geo.postalCode,
                        };
                        setValue('address', updatedAddress);
                        setSearchQuery(geo.displayName);
                      } else {
                        setValue('address', baseUpdated);
                      }
                    } catch (e) {
                      setValue('address', baseUpdated);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 text-center">{t('addBook.dragMarker')}</p>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={handleCurrentLocation}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCurrentLocation()}
                className="h-40 lg:h-56 bg-[#F1F8FF] mt-3 flex items-center justify-center rounded-md border border-[#8CBEF2] border-dashed flex-col"
              >
                <div className="flex items-end mb-2">
                  <Image src={addmapIcon} alt="genre" className="w-[68px] h-[60px]" />
                  <Image src={genreAddGenreIcon} alt="genre" className="w-4 h-4 mt-1" />
                </div>
                <p className="text-xs text-grayDark font-poppins">
                  {t('addBook.clickToAddLocation')}
                </p>
              </div>
            )}
            {errors && errors['address'] && (
              <div className="text-rose-500 text-xs mt-1 pl-2">
                {(errors['address'] as FieldError)?.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
