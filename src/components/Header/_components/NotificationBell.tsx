import PropTypes from 'prop-types';
import { useEffect } from 'react';
import notificationIcon from '../../../assets/notification.svg';
import { useMouseClick } from '../../../hooks/useMouse';
import {
  markAllAsRead,
  selectIsNotificationPanelOpen,
  selectSortedNotifications,
  selectUnreadCount,
  selectWSConnectionStatus,
  toggleNotificationPanel,
} from '../../../redux/feature/notification/notificationSlice';
import { setLoginModalOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { cn } from '../../../utility/cn';
import NotificationItem from './NotificationItem';

interface NotificationBellProps {
  className?: string;
}

/**
 * NotificationBell component displays a notification icon with badge and dropdown panel
 * Integrates with WebSocket notifications and Redux state management
 */
const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectSortedNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const isNotificationPanelOpen = useAppSelector(selectIsNotificationPanelOpen);
  const wsConnectionStatus = useAppSelector(selectWSConnectionStatus);
  const { userInformation } = useAppSelector((state) => state.auth);

  // Outside click detection
  const { reference } = useMouseClick<HTMLDivElement>(() => {
    if (isNotificationPanelOpen) {
      dispatch(toggleNotificationPanel(false));
    }
  });

  // Toggle notification panel or show login modal
  const handleBellClick = () => {
    // Check if user is authenticated
    const isAuthenticated = Boolean(userInformation?.id && userInformation?.email);

    if (!isAuthenticated) {
      // Show login modal if not authenticated
      dispatch(setLoginModalOpen(true));
      return;
    }

    // Toggle notification panel if authenticated
    dispatch(toggleNotificationPanel(!isNotificationPanelOpen));
  };

  // Mark all as read when panel opens
  useEffect(() => {
    if (isNotificationPanelOpen && unreadCount > 0) {
      dispatch(markAllAsRead());
    }
  }, [isNotificationPanelOpen, unreadCount, dispatch]);

  return (
    <div ref={reference} className={cn('relative', className)}>
      {/* Bell Icon Button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 hover:bg-light rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isNotificationPanelOpen}
        aria-haspopup="true"
      >
        <img src={notificationIcon} alt="Notifications" className="w-6 h-6" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red text-white text-xs font-semibold font-poppins rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator (only shown on error) */}
        {wsConnectionStatus === 'error' && (
          <span
            className="absolute bottom-0 right-0 w-3 h-3 bg-yellow border-2 border-white rounded-full"
            aria-label="Connection error"
            title="Unable to connect to notification service"
          />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isNotificationPanelOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-platinum overflow-hidden z-50 animate-fadeIn"
          role="menu"
          aria-label="Notification list"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-platinum bg-light">
            <h3 className="text-base font-semibold font-poppins text-blackOlive">Notifications</h3>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => {
                    // Individual notification click handler can be extended here
                    // For now, notifications are marked as read when panel opens
                  }}
                />
              ))
            ) : (
              // Empty State
              <div className="px-4 py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={notificationIcon}
                    alt="No notifications"
                    className="w-12 h-12 opacity-30"
                  />
                  <p className="text-sm font-normal font-poppins text-gray">No notifications yet</p>
                  <p className="text-xs font-normal font-poppins text-gray">
                    You&apos;ll see notifications here when you receive them
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connection Status Message (only shown on error with notifications) */}
          {wsConnectionStatus === 'error' && notifications.length > 0 && (
            <div className="px-4 py-2 bg-yellow-light border-t border-platinum">
              <p className="text-xs font-normal font-poppins text-grayDark text-center">
                Connection issue - notifications may be delayed
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  className: PropTypes.string,
};

export default NotificationBell;
