import PropTypes from 'prop-types';
import { cn } from '../../../utility/cn';
import { INotification } from '../../../types/notification';

interface NotificationItemProps {
  notification: INotification;
  onClick?: () => void;
}

/**
 * Formats a notification timestamp into a human-readable relative time string
 * @param time - ISO 8601 timestamp string
 * @returns Formatted time string (e.g., "2 minutes ago", "1 hour ago")
 */
export function formatNotificationTime(time: string): string {
  try {
    const notificationDate = new Date(time);
    const now = new Date();
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // For older notifications, show the date
      return notificationDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  } catch (error) {
    console.error('[NotificationItem] Error formatting time:', error);
    return '';
  }
}

/**
 * NotificationItem component displays a single notification with title, message, and time
 * Provides visual distinction between read and unread notifications
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const formattedTime = formatNotificationTime(notification.time);

  return (
    <div
      className={cn(
        'px-4 py-3 cursor-pointer transition-all hover:bg-light border-b border-platinum last:border-b-0',
        !notification.isRead && 'bg-primary-light hover:bg-primary-light/80',
      )}
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm font-medium font-poppins text-blackOlive',
              !notification.isRead && 'font-semibold',
            )}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span
              className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"
              aria-label="Unread"
            />
          )}
        </div>
        <p className="text-xs font-normal font-poppins text-grayDark line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs font-normal font-poppins text-gray mt-0.5">{formattedTime}</span>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default NotificationItem;
