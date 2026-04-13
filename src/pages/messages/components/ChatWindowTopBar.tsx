import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import book3 from '../../../assets/book3.png';
import OwnerAvatar from '../../../components/shared/OwnerAvatar';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import { resetChat } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
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
  const { selectedChatId, chats } = useAppSelector((state) => state.chat);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  if (!selectedChat) {
    return null;
  }

  const partnerName =
    selectedChat.conversationType === 'sent'
      ? selectedChat.receiver?.name
      : selectedChat.sender?.name;

  const partnerId =
    selectedChat.conversationType === 'sent' ? selectedChat.receiver?.id : selectedChat.sender?.id;

  const goPartnerProfile = () => {
    if (partnerId) navigate(`/profile/user-profile/${partnerId}`);
  };

  const bookTitle = selectedChat.bookToSwapWith?.title || 'Unknown Book';
  const bookAuthor = selectedChat.bookToSwapWith?.author || 'Unknown Author';
  const bookCondition = selectedChat.bookToSwapWith?.condition || 'N/A';

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
          {partnerId ? (
            <button
              type="button"
              className="font-poppins text-sm cursor-pointer hover:underline text-left bg-transparent border-0 p-0"
              onClick={goPartnerProfile}
            >
              {partnerName || 'Chat'}
            </button>
          ) : (
            <h1 className="font-poppins text-sm">{partnerName || 'Chat'}</h1>
          )}
          <ChatInfoDropdown
            onViewProfile={goPartnerProfile}
            onMute={() => setMuteOpen(true)}
            onBlock={() => setBlockOpen(true)}
            onReport={() => alert('Report')}
          />
        </div>
        <div className="border-t border-platinumMix">
          <div className="flex gap-4 py-[11px] px-4">
            <Image
              src={selectedChat.bookToSwapWith?.coverPhotoUrl || book3}
              alt="Book"
              className="w-[37px] h-[37px] object-cover rounded"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-poppins text-xs text-smokyBlack font-medium">{bookTitle}</h3>
              <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                by {bookAuthor}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#DEE7F5] px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins text-xs text-grayDark font-normal">
              {selectedChat.conversationType === 'sent'
                ? `You want to swap with this book`
                : `${partnerName} wants to swap with this book`}
            </h3>
            <Button
              onClick={() => setBookOpen(!bookOpen)}
              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-grayDark"
            >
              <IoIosArrowDown className={`transition-transform ${bookOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          {bookOpen && (
            <div className="absolute left-0 w-full bg-[#DEE7F5] px-4 pb-3 mt-3">
              <div className="flex gap-4">
                <Image
                  src={selectedChat.bookToSwapWith?.coverPhotoUrl || book3}
                  alt="Book"
                  className="w-[71px] h-[71px] object-cover rounded"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-poppins text-xs text-smokyBlack font-medium">{bookTitle}</h3>
                  <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                    by {bookAuthor}
                  </p>
                  <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                    Book Condition:{' '}
                    <span className="text-[#3FBA49] bg-[#3FBA4914] py-0.5 px-1.5 rounded-md capitalize">
                      {bookCondition.toLowerCase().replace('_', ' ')}
                    </span>
                  </p>
                  <div className="flex items-center mb-1.5 lg:mb-2">
                    {partnerId ? (
                      <button
                        type="button"
                        className="flex items-center bg-transparent border-0 p-0 cursor-pointer text-left"
                        onClick={goPartnerProfile}
                      >
                        <div className="mr-1 flex-shrink-0 w-4 h-4">
                          <OwnerAvatar ownerId={partnerId} className="w-4 h-4" iconSize={12} />
                        </div>
                        <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700 hover:underline">
                          {partnerName}
                        </span>
                      </button>
                    ) : (
                      <>
                        <div className="mr-1 flex-shrink-0 w-4 h-4">
                          <OwnerAvatar ownerId="" className="w-4 h-4" iconSize={12} />
                        </div>
                        <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
                          {partnerName}
                        </span>
                      </>
                    )}
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
          setBlockOpen(false);
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
