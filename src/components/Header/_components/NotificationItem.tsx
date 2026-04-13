import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utility/cn';
import { INotification } from '../../../types/notification';
import { TFunction } from 'i18next';

interface NotificationItemProps {
  notification: INotification;
  onClick?: () => void;
}

/**
 * Formats a notification timestamp into a human-readable relative time string
 */
export function formatNotificationTime(time: string, t: TFunction): string {
  try {
    const notificationDate = new Date(time);
    const now = new Date();
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return t('notification.justNow');
    } else if (diffInMinutes < 60) {
      return diffInMinutes === 1
        ? t('notification.minuteAgo', { count: diffInMinutes })
        : t('notification.minutesAgo', { count: diffInMinutes });
    } else if (diffInHours < 24) {
      return diffInHours === 1
        ? t('notification.hourAgo', { count: diffInHours })
        : t('notification.hoursAgo', { count: diffInHours });
    } else if (diffInDays < 7) {
      return diffInDays === 1
        ? t('notification.dayAgo', { count: diffInDays })
        : t('notification.daysAgo', { count: diffInDays });
    } else {
      return notificationDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  } catch {
    return '';
  }
}

/**
 * NotificationItem component displays a single notification with title, message, and time
 * Provides visual distinction between read and unread notifications
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const { t } = useTranslation();
  const formattedTime = formatNotificationTime(notification.time, t);

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
