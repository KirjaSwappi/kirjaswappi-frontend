import { createSearchParams, useNavigate } from 'react-router-dom';
import book from '../../../assets/book3.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import ChatListSkeleton from '../../../components/shared/skeleton/ChatListSkeleton';
import { useGetInboxByStatusQuery } from '../../../redux/feature/messages/inboxApi';
import { useAppSelector } from '../../../redux/hooks';
import { truncateText } from '../../../utility/helper';

export default function PendingSwaps() {
  const navigate = useNavigate();
  const { userInformation } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useGetInboxByStatusQuery(
    { status: 'Pending' },
    { skip: !userInformation.id },
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ChatListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-grayDark font-medium">No pending swaps</p>
        <p className="text-xs text-gray mt-1">Your pending swap requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {data.map((item) => {
        const isSent = item.conversationType === 'sent';
        const partnerName = isSent ? item.receiver.name : item.sender.name;

        return (
          <Button
            key={item.id}
            onClick={() => {
              navigate({
                pathname: '/user/messages',
                search: `?${createSearchParams({ messageId: item.id })}`,
              });
            }}
            className="flex gap-3 p-3 bg-white rounded-lg border border-platinum hover:border-primary/30 transition-colors text-left"
          >
            <Image
              src={item.bookToSwapWith?.coverPhotoUrl || book}
              className="w-16 h-20 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {truncateText(item.bookToSwapWith?.title || 'Unknown Book', 30)}
              </p>
              <p className="text-xs text-grayDark mt-0.5">
                {isSent ? `Sent to ${partnerName}` : `From ${partnerName}`}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow" />
                <span className="text-xs text-grayDark">{item.swapStatus}</span>
              </div>
              {item.note && (
                <p className="text-xs text-gray mt-1 truncate">{truncateText(item.note, 40)}</p>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
