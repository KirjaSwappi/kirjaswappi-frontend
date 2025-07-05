import { FaRegUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bookDetailsBg from '../../../assets/bookdetailsbg.jpg';
import editIcon from '../../../assets/editBlue.png';
import rightMenu from '../../../assets/rightmenu.png';
import Image from '../../../components/shared/Image';
import {
  useGetUserCoverImageQuery,
  useGetUserProfileImageQuery,
} from '../../../redux/feature/auth/authApi';
import { setOpen } from '../../../redux/feature/open/openSlice';
import { useAppSelector } from '../../../redux/hooks';
import Settings from './MoreOptions';
import UserTabs from './UserTabs';

export default function UserProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open } = useAppSelector((state) => state.open);
  const {
    userInformation: { id, firstName, lastName, favGenres },
  } = useAppSelector((state) => state.auth);
  const { data: imageData, isLoading } = useGetUserProfileImageQuery({ userId: id }, { skip: !id });
  const { data: coverImage } = useGetUserCoverImageQuery({ userId: id }, { skip: !id });

  return (
    <div>
      <div className="absolute left-0 top-0 w-full flex justify-between px-4 h-14 bg-white">
        <div className="flex items-center gap-4">
          <h2>{t('profile.myProfile')}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Image src={rightMenu} alt="icon" onClick={() => dispatch(setOpen(!open))} />
        </div>
      </div>
      <Settings />
      <div className="w-full h-[88px] z-0 mt-14">
        {coverImage?.imageUrl === undefined ? (
          <Image src={bookDetailsBg} className="w-full h-full " />
        ) : (
          <Image src={coverImage?.imageUrl as string} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="absolute top-4/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white">
        {isLoading ? (
          <div className="w-full h-full bg-platinum animate-pulse rounded-full shadow-sm"></div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {imageData?.imageUrl === undefined ? (
              <FaRegUser size={72} className="text-night" />
            ) : (
              <Image
                src={imageData?.imageUrl as string}
                className="w-[120px] h-[120px] object-cover relative rounded-full"
              />
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/profile/edit-user')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/profile/edit-user');
                }
              }}
              className="w-7 h-7 bg-white cursor-pointer z-[99999999px] absolute bottom-0 right-2 rounded-full flex items-center justify-center"
            >
              <Image src={editIcon} alt="edit" />
            </div>
          </div>
        )}
      </div>
      <div className="container mt-20 pb-28">
        <div className="text-center my-5 ">
          <h1 className="font-medium text-black text-sm leading-none mb-2 font-poppins">
            {firstName + ' ' + lastName}
          </h1>
          <div className="flex items-center justify-center flex-wrap">
            {favGenres?.map((favItem, index) => (
              <div key={index} className="flex items-center">
                <p className="text-black font-light text-xs font-poppins">{favItem}</p>
                <span
                  className={`${
                    favGenres.length - 1 === index ? 'hidden' : 'block'
                  } inline-block mx-2 font-poppins font-light text-sm`}
                >
                  |
                </span>
              </div>
            ))}
          </div>
        </div>
        <UserTabs />
      </div>
    </div>
  );
}
