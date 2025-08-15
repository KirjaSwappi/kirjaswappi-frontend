import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import book3 from '../../../assets/book3.png';
import locationIcon from '../../../assets/location-icon.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import { resetChat } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch } from '../../../redux/hooks';
import ChatInfoDropdown from './ChatInfoDropdown';
import ConfirmModal from './ConfirmModal';
type IChatWindowTopBarProps = {
  bookOpen: boolean;
  setBookOpen: (open: boolean) => void;
};

export default function ChatWindowTopBar({ bookOpen, setBookOpen }: IChatWindowTopBarProps) {
  const [muteOpen, setMuteOpen] = useState<boolean>(false);
  const [blockOpen, setBlockOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div>
        <div id="topChatHeader" className="px-4 py-3 xl:py-4 flex items-center justify-between">
          <Button
            className="block xl:hidden"
            onClick={() => {
              dispatch(resetChat());
              navigate('/user/messages');
              setBookOpen(true);
            }}
          >
            <IoIosArrowBack size={20} className="text-black" />
          </Button>
          <h1 className="font-poppins text-sm">Minhazur Rahman</h1>
          <ChatInfoDropdown
            onViewProfile={() => alert('View Profile')}
            onMute={() => setMuteOpen(true)}
            onBlock={() => setBlockOpen(true)}
            onReport={() => alert('Report')}
          />
        </div>
        <div className="border-t border-platinumMix">
          <div className="flex gap-4 py-[11px] px-4">
            <Image src={book3} alt="Books" className="w-[37px]" />
            <div className="flex flex-col gap-1">
              <h3 className="font-poppins text-xs text-smokyBlack font-medium">
                Man’s search for meaning
              </h3>
              <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                by Rahat
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#DEE7F5] px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins text-xs text-grayDark font-normal">
              Rahat Hasan wants to swap with this book
            </h3>
            <Button
              onClick={() => setBookOpen(!bookOpen)}
              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-grayDark"
            >
              <IoIosArrowDown />
            </Button>
          </div>
          {bookOpen && (
            <div className="absolute left-0 w-full bg-[#DEE7F5] px-4 pb-3 mt-3">
              <div className="flex gap-4">
                <Image src={book3} alt="Books" className="w-[71px]" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-poppins text-xs text-smokyBlack font-medium">
                    Man’s search for meaning
                  </h3>
                  <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                    by Rahat
                  </p>
                  <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                    Book Condition:{' '}
                    <span className="text-[#3FBA49] bg-[#3FBA4914] py-0.5 px-1.5 rounded-md">
                      Used Like New
                    </span>
                  </p>
                  <div className="flex items-center mb-1.5 lg:mb-2">
                    <Image
                      src={locationIcon}
                      alt="Location"
                      className="mr-1 flex-shrink-0 w-4 h-4"
                    />
                    <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
                      Helsinki
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        open={muteOpen}
        onConfirm={() => {
          setMuteOpen(false);
          alert('Muted!');
        }}
        onCancel={() => setMuteOpen(false)}
        header="Are You Sure?"
        description="Are you sure you want to mute this person"
        btnValue={'Mute'}
      />
      <ConfirmModal
        open={blockOpen}
        onConfirm={() => {
          //   setBlockOpen(false);
          alert('Blocked!');
        }}
        btnValue="Block"
        onCancel={() => setBlockOpen(false)}
        header="Are You Sure?"
        description="Are you sure you want to block this person"
      />
    </div>
  );
}
