import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import imagePlaceholder from '../../../assets/imagePlaceholder.svg';
import OwnerAvatar from '../../../components/shared/OwnerAvatar';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import { showToast } from '../../../components/shared/toast';
import {
  useBlockUserMutation,
  useMuteUserMutation,
  useReportUserMutation,
} from '../../../redux/feature/auth/userInteractionApi';
import {
  resetChat,
  makeSelectChatById,
  updateChatSwapStatus,
} from '../../../redux/feature/messages/messagesSlice';
import { useUpdateSwapRequestStatusMutation } from '../../../redux/feature/swap/swapApi';
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
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [acceptOpen, setAcceptOpen] = useState<boolean>(false);
  const [rejectOpen, setRejectOpen] = useState<boolean>(false);
  const [completeOpen, setCompleteOpen] = useState<boolean>(false);
  const [cancelOpen, setCancelOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const selectChatById = useMemo(makeSelectChatById, []);
  const selectedChat = useAppSelector((state) => selectChatById(state, selectedChatId));
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSwapRequestStatusMutation();
  const [blockUser] = useBlockUserMutation();
  const [muteUser] = useMuteUserMutation();
  const [reportUser] = useReportUserMutation();

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

  const bookTitle = selectedChat.bookToSwapWith?.title || t('chat.unknownBook');
  const bookAuthor = selectedChat.bookToSwapWith?.author || t('chat.unknownAuthor');
  const bookCondition = selectedChat.bookToSwapWith?.condition || t('chat.notAvailable');

  const rawStatus = selectedChat.swapStatus || 'PENDING';
  const swapStatus = rawStatus.toUpperCase();
  const isReceiver = selectedChat.conversationType === 'received';
  const canRespondToSwap = isReceiver && swapStatus === 'PENDING';
  const canComplete = swapStatus === 'ACCEPTED' || swapStatus === 'RESERVED';
  const canCancel =
    swapStatus === 'PENDING' || swapStatus === 'ACCEPTED' || swapStatus === 'RESERVED';

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus({ id: selectedChat.id, status: newStatus }).unwrap();
      dispatch(updateChatSwapStatus({ chatId: selectedChat.id, swapStatus: newStatus }));
      showToast('success', `Swap request ${newStatus.toLowerCase()}.`);
    } catch {
      showToast('error', `Failed to ${newStatus.toLowerCase()} swap request.`);
    }
  };

  const statusBadgeStyles: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-rose-100 text-rose-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-stone-100 text-stone-500',
    EXPIRED: 'bg-stone-100 text-stone-500',
  };

  const statusDisplayLabels: Record<string, string> = {
    PENDING: t('chat.pending'),
    ACCEPTED: t('chat.accepted'),
    REJECTED: t('chat.rejected'),
    COMPLETED: t('chat.completed'),
    CANCELLED: t('chat.cancelled'),
    EXPIRED: t('chat.expired'),
  };

  return (
    <div className="bg-white">
      <div>
        <div id="topChatHeader" className="px-4 py-3 xl:py-4 flex items-center justify-between">
          <Button
            className="block xl:hidden"
            aria-label="Back to messages"
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
              {partnerName || t('chat.chat')}
            </button>
          ) : (
            <h1 className="font-poppins text-sm">{partnerName || t('chat.chat')}</h1>
          )}
          <ChatInfoDropdown
            onViewProfile={goPartnerProfile}
            onMute={() => setMuteOpen(true)}
            onBlock={() => setBlockOpen(true)}
            onReport={() => setReportOpen(true)}
          />
        </div>
        <div className="border-t border-platinumMix">
          <div className="flex gap-4 py-[11px] px-4">
            <Image
              src={selectedChat.bookToSwapWith?.coverPhotoUrl || imagePlaceholder}
              alt="Book"
              className="w-[37px] h-[37px] object-cover rounded"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-poppins text-xs text-smokyBlack font-medium">{bookTitle}</h3>
              <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                {t('chat.byAuthor', { author: bookAuthor })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#DEE7F5] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-poppins text-xs text-grayDark font-normal">
                {selectedChat.conversationType === 'sent'
                  ? t('chat.youWantToSwap')
                  : t('chat.wantsToSwap', { name: partnerName })}
              </h3>
              <span
                className={`font-poppins text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadgeStyles[swapStatus] || 'bg-gray-100 text-gray-600'}`}
              >
                {statusDisplayLabels[swapStatus] || swapStatus}
              </span>
            </div>
            <Button
              onClick={() => setBookOpen(!bookOpen)}
              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-grayDark"
            >
              <IoIosArrowDown className={`transition-transform ${bookOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          {canRespondToSwap && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setAcceptOpen(true)}
                className="flex-1 py-1.5 text-xs font-poppins font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                {t('chat.accept')}
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setRejectOpen(true)}
                className="flex-1 py-1.5 text-xs font-poppins font-medium text-white bg-red rounded-lg hover:bg-red/90 disabled:opacity-50 cursor-pointer"
              >
                {t('chat.reject')}
              </button>
            </div>
          )}
          {!canRespondToSwap && (canComplete || canCancel) && (
            <div className="flex gap-2 mt-2">
              {canComplete && (
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => setCompleteOpen(true)}
                  className="flex-1 py-1.5 text-xs font-poppins font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                >
                  {t('chat.markComplete')}
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => setCancelOpen(true)}
                  className="flex-1 py-1.5 text-xs font-poppins font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                  {t('chat.cancel')}
                </button>
              )}
            </div>
          )}
          {bookOpen && (
            <div className="absolute left-0 w-full bg-[#DEE7F5] px-4 pb-3 mt-3">
              <div className="flex gap-4">
                <Image
                  src={selectedChat.bookToSwapWith?.coverPhotoUrl || imagePlaceholder}
                  alt="Book"
                  className="w-[71px] h-[71px] object-cover rounded"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-poppins text-xs text-smokyBlack font-medium">{bookTitle}</h3>
                  <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                    {t('chat.byAuthor', { author: bookAuthor })}
                  </p>
                  <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600">
                    {t('chat.bookCondition')}:{' '}
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
        onConfirm={async () => {
          setMuteOpen(false);
          if (!partnerId) return;
          try {
            await muteUser({ id: partnerId }).unwrap();
            showToast('success', t('chat.userMuted'));
          } catch {
            showToast('error', t('chat.muteFailed'));
          }
        }}
        onCancel={() => setMuteOpen(false)}
        header={t('chat.areYouSure')}
        description={t('chat.muteConfirm')}
        btnValue={t('chat.mute')}
      />
      <ConfirmModal
        open={blockOpen}
        onConfirm={async () => {
          setBlockOpen(false);
          if (!partnerId) return;
          try {
            await blockUser({ id: partnerId }).unwrap();
            showToast('success', t('chat.userBlocked'));
          } catch {
            showToast('error', t('chat.blockFailed'));
          }
        }}
        btnValue={t('chat.block')}
        onCancel={() => setBlockOpen(false)}
        header={t('chat.areYouSure')}
        description={t('chat.blockConfirm')}
      />
      <ConfirmModal
        open={acceptOpen}
        onConfirm={() => {
          setAcceptOpen(false);
          handleStatusUpdate('Accepted');
        }}
        btnValue={t('chat.accept')}
        onCancel={() => setAcceptOpen(false)}
        header={t('chat.acceptSwap')}
        description={t('chat.acceptConfirm')}
      />
      <ConfirmModal
        open={rejectOpen}
        onConfirm={() => {
          setRejectOpen(false);
          handleStatusUpdate('Rejected');
        }}
        btnValue={t('chat.reject')}
        onCancel={() => setRejectOpen(false)}
        header={t('chat.rejectSwap')}
        description={t('chat.rejectConfirm')}
      />
      <ConfirmModal
        open={reportOpen}
        onConfirm={async () => {
          setReportOpen(false);
          if (!partnerId) return;
          try {
            await reportUser({ reportedUserId: partnerId, reason: 'Reported from chat' }).unwrap();
            showToast('success', t('chat.userReported'));
          } catch {
            showToast('error', t('chat.reportFailed'));
          }
        }}
        btnValue={t('chat.report')}
        onCancel={() => setReportOpen(false)}
        header={t('chat.reportUser')}
        description={t('chat.reportConfirm')}
      />
      <ConfirmModal
        open={completeOpen}
        onConfirm={() => {
          setCompleteOpen(false);
          handleStatusUpdate('Completed');
        }}
        btnValue={t('chat.complete')}
        onCancel={() => setCompleteOpen(false)}
        header={t('chat.completeSwap')}
        description={t('chat.completeConfirm')}
      />
      <ConfirmModal
        open={cancelOpen}
        onConfirm={() => {
          setCancelOpen(false);
          handleStatusUpdate('Cancelled');
        }}
        btnValue={t('chat.cancelSwap')}
        onCancel={() => setCancelOpen(false)}
        header={t('chat.cancelSwap')}
        description={t('chat.cancelConfirm')}
      />
    </div>
  );
}
