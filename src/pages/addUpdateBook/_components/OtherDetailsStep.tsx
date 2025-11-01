import { FieldError, FieldErrors, useFormContext } from 'react-hook-form';
import closeIcon from '../../../assets/closeIcon.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import InputLabel from '../../../components/shared/InputLabel';
import { setAddress, setMapCenter, setUserLocation } from '../../../redux/feature/map/mapSlice';
import { setOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import LocationMap from './LocationMap';

export default function OtherDetailsStep({ errors }: { errors: FieldErrors }) {
  const { open } = useAppSelector((state) => state.open);
  const dispatch = useAppDispatch();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { getValues, setValue, watch } = useFormContext();
  const genres = getValues('genres');
  const mapState = useAppSelector((state) => state.map);
  const formAddress = watch('address');

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      const displayName: string = data?.display_name || '';
      const addr = data?.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || '';
      const country = addr.country || '';
      const postalCode = addr.postcode || '';
      return { displayName, city, country, postalCode };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Reverse geocode failed', e);
      return null;
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

  return (
    <div className="pt-5 lg:pt-0">
      <div className="lg:grid lg:grid-cols-2 gap-9 xl:gap-10 2xl:gap-20 md:gap-4">
        <div className="w-full">
          <div className="flex items-center justify-between py-4 border-b lg:border-b-0 border-platinumDark">
            <InputLabel label="Genre" required className="mb-0" />
            <Button
              type="button"
              onClick={() => dispatch(setOpen(!open))}
              className="text-[#3879E9] font-poppins font-medium text-sm leading-none underline"
            >
              Add
            </Button>
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
              <div className="h-[50px] lg:h-56 bg-white lg:bg-AntiFlashWhite mt-3 flex items-center justify-center rounded-md">
                <p className="text-xs text-grayDark">Click ‘Add’ to add genre</p>
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
          <div className="flex items-center justify-between py-4 border-b lg:border-b-0 border-platinumDark">
            <InputLabel label="Address" required={false} className="mb-0" />
            <Button
              type="button"
              onClick={async () => {
                // Prefer existing redux address
                const reduxAddress = mapState?.address;
                if (reduxAddress) {
                  setValue('address', reduxAddress);
                  return;
                }

                // Next prefer authenticated user's profile address if available
                const hasProfileAddress =
                  userInformation &&
                  (userInformation.streetName ||
                    userInformation.houseNumber ||
                    userInformation.city ||
                    userInformation.country ||
                    userInformation.zipCode);

                if (hasProfileAddress) {
                  // Build a readable address string from profile info
                  const parts: string[] = [];
                  if (userInformation.houseNumber) parts.push(String(userInformation.houseNumber));
                  if (userInformation.streetName) parts.push(userInformation.streetName);
                  if (userInformation.city) parts.push(userInformation.city);
                  if (userInformation.zipCode) parts.push(String(userInformation.zipCode));
                  if (userInformation.country) parts.push(userInformation.country);
                  const addressText = parts.join(', ');

                  // Try geocoding the profile address to get lat/lon (Nominatim)
                  (async () => {
                    try {
                      const encoded = encodeURIComponent(addressText);
                      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encoded}&addressdetails=1&limit=1`;
                      const res = await fetch(url, { headers: { Accept: 'application/json' } });
                      if (res.ok) {
                        const results = await res.json();
                        if (Array.isArray(results) && results.length > 0) {
                          const best = results[0];
                          const latitude = parseFloat(best.lat);
                          const longitude = parseFloat(best.lon);
                          const addr = best.address || {};
                          const city =
                            addr.city ||
                            addr.town ||
                            addr.village ||
                            addr.county ||
                            userInformation.city ||
                            '';
                          const country = addr.country || userInformation.country || '';
                          const postalCode =
                            addr.postcode ||
                            (userInformation.zipCode ? String(userInformation.zipCode) : '');

                          const inferred = {
                            latitude,
                            longitude,
                            address: best.display_name || addressText,
                            city,
                            country,
                            postalCode,
                            radiusKm: 50,
                          };

                          setValue('address', inferred);
                          dispatch(setAddress(inferred));
                          dispatch(setUserLocation({ latitude, longitude }));
                          dispatch(setMapCenter({ latitude, longitude }));
                          return;
                        }
                      }
                    } catch (e) {
                      // ignore and fallback
                      // eslint-disable-next-line no-console
                      console.warn('Profile address geocode failed', e);
                    }

                    // Fallback if geocoding profile address failed: reverse-geocode map center to get a readable address
                    const center = mapState?.center || { latitude: 60.1699, longitude: 24.9384 };
                    try {
                      const geo = await reverseGeocode(center.latitude, center.longitude);
                      const fallback = {
                        latitude: center.latitude,
                        longitude: center.longitude,
                        address: geo?.displayName || addressText,
                        city: geo?.city || userInformation.city || '',
                        country: geo?.country || userInformation.country || '',
                        postalCode:
                          geo?.postalCode ||
                          (userInformation.zipCode ? String(userInformation.zipCode) : ''),
                        radiusKm: 50,
                      };
                      setValue('address', fallback);
                      dispatch(setAddress(fallback));
                      dispatch(
                        setMapCenter({
                          latitude: fallback.latitude,
                          longitude: fallback.longitude,
                        }),
                      );
                    } catch (e) {
                      const fallback = {
                        latitude: center.latitude,
                        longitude: center.longitude,
                        address: addressText,
                        city: userInformation.city || '',
                        country: userInformation.country || '',
                        postalCode: userInformation.zipCode ? String(userInformation.zipCode) : '',
                        radiusKm: 50,
                      };
                      setValue('address', fallback);
                      dispatch(setAddress(fallback));
                      dispatch(
                        setMapCenter({
                          latitude: fallback.latitude,
                          longitude: fallback.longitude,
                        }),
                      );
                    }
                  })();

                  return;
                }

                // Next prefer stored userLocation in redux state
                const userLoc = mapState?.userLocation;
                if (userLoc && userLoc.latitude !== null && userLoc.longitude !== null) {
                  const { latitude, longitude } = userLoc;
                  const geo = await reverseGeocode(latitude, longitude);
                  const inferredFromUser = {
                    latitude,
                    longitude,
                    address: geo?.displayName || '',
                    city: geo?.city || '',
                    country: geo?.country || '',
                    postalCode: geo?.postalCode || '',
                    radiusKm: 50,
                  };
                  setValue('address', inferredFromUser);
                  dispatch(setAddress(inferredFromUser));
                  return;
                }

                // If no redux user location, request browser geolocation permission now.
                if ('geolocation' in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      (async () => {
                        const { latitude, longitude } = position.coords;
                        const geo = await reverseGeocode(latitude, longitude);
                        const inferred = {
                          latitude,
                          longitude,
                          address: geo?.displayName || '',
                          city: geo?.city || '',
                          country: geo?.country || '',
                          postalCode: geo?.postalCode || '',
                          radiusKm: 50,
                        };
                        setValue('address', inferred);
                        dispatch(setAddress(inferred));
                        dispatch(setUserLocation({ latitude, longitude }));
                        dispatch(setMapCenter({ latitude, longitude }));
                      })();
                    },
                    () => {
                      (async () => {
                        const center = mapState?.center || {
                          latitude: 60.1699,
                          longitude: 24.9384,
                        };
                        const geo = await reverseGeocode(center.latitude, center.longitude);
                        const inferred = {
                          latitude: center.latitude,
                          longitude: center.longitude,
                          address: geo?.displayName || '',
                          city: geo?.city || '',
                          country: geo?.country || '',
                          postalCode: geo?.postalCode || '',
                          radiusKm: 50,
                        };
                        setValue('address', inferred);
                        dispatch(setAddress(inferred));
                      })();
                    },
                  );
                } else {
                  const center = mapState?.center || { latitude: 60.1699, longitude: 24.9384 };
                  const geo = await reverseGeocode(center.latitude, center.longitude);
                  const inferred = {
                    latitude: center.latitude,
                    longitude: center.longitude,
                    address: geo?.displayName || '',
                    city: geo?.city || '',
                    country: geo?.country || '',
                    postalCode: geo?.postalCode || '',
                    radiusKm: 50,
                  };
                  setValue('address', inferred);
                  dispatch(setAddress(inferred));
                }
              }}
              className="text-[#3879E9] font-poppins font-medium text-sm leading-none underline"
            >
              {mapState?.address ? 'Edit' : 'Add'}
            </Button>
          </div>
          <div className="pt-3">
            {formAddress ? (
              <div className="flex flex-col gap-2 pt-2">
                <div className="px-4 py-4 bg-white lg:bg-AntiFlashWhite border border-platinum lg:border-gray rounded-lg">
                  <h3 className="font-poppins text-sm font-light">
                    {formAddress.address || 'Current location'}
                  </h3>
                  <p className="text-xs text-grayDark mt-1">{`${formAddress.city || ''}${formAddress.city ? ', ' : ''}${formAddress.country || ''}`}</p>
                  <p className="text-xs text-grayDark mt-1">{`Lat: ${formAddress.latitude}, Lon: ${formAddress.longitude}`}</p>
                </div>
                <LocationMap
                  position={[formAddress.latitude, formAddress.longitude]}
                  isEditing={!!mapState?.address}
                  onPositionChange={async (newPos) => {
                    const [latitude, longitude] = newPos;

                    // base updated object
                    const baseUpdated = {
                      ...formAddress,
                      latitude,
                      longitude,
                    };

                    try {
                      // Use Nominatim reverse geocoding to get a readable address
                      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
                      const res = await fetch(url, { headers: { Accept: 'application/json' } });
                      if (res.ok) {
                        const data = await res.json();
                        const displayName: string = data?.display_name || '';
                        const addr = data?.address || {};
                        const city = addr.city || addr.town || addr.village || addr.county || '';
                        const country = addr.country || '';
                        const postalCode = addr.postcode || '';

                        const updatedAddress = {
                          ...baseUpdated,
                          address: displayName,
                          city,
                          country,
                          postalCode,
                        };

                        setValue('address', updatedAddress);
                        dispatch(setAddress(updatedAddress));
                        dispatch(setMapCenter({ latitude, longitude }));
                        return;
                      }
                    } catch (e) {
                      // ignore and fallback to baseUpdated
                      // eslint-disable-next-line no-console
                      console.warn('Reverse geocode failed', e);
                    }

                    // Fallback: just set lat/lon if reverse geocode fails
                    setValue('address', baseUpdated);
                    dispatch(setAddress(baseUpdated));
                    dispatch(setMapCenter({ latitude, longitude }));
                  }}
                />
              </div>
            ) : (
              <div className="h-[50px] lg:h-56 bg-white lg:bg-AntiFlashWhite mt-3 flex items-center justify-center rounded-md">
                <p className="text-xs text-grayDark">
                  No address added. Click ‘Add’ to use current location.
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
