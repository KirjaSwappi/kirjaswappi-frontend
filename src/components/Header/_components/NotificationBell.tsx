import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  variant?: 'header' | 'bottom-nav';
}

/**
 * NotificationBell component displays a notification icon with badge and dropdown panel
 * Integrates with WebSocket notifications and Redux state management
 */
const NotificationBell: React.FC<NotificationBellProps> = ({ className, variant = 'header' }) => {
  const { t } = useTranslation();
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

  // Close panel on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNotificationPanelOpen) {
        dispatch(toggleNotificationPanel(false));
      }
    },
    [isNotificationPanelOpen, dispatch],
  );

  useEffect(() => {
    if (isNotificationPanelOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isNotificationPanelOpen, handleKeyDown]);

  const isBottomNav = variant === 'bottom-nav';

  return (
    <div ref={reference} className={cn('relative', className)}>
      {/* Bell Icon Button */}
      <button
        onClick={handleBellClick}
        className={cn(
          'relative focus:outline-none transition-colors',
          isBottomNav
            ? 'p-0 flex flex-col items-center gap-1'
            : 'p-2 hover:bg-light rounded-full border border-platinumMix focus:ring-2 focus:ring-primary focus:ring-offset-2',
        )}
        aria-label={t('notification.ariaLabel', { count: unreadCount })}
        aria-expanded={isNotificationPanelOpen}
        aria-haspopup="true"
      >
        <div className="relative h-7 flex items-center justify-center">
          <img
            src={notificationIcon}
            alt={t('notification.bellAlt', 'Notifications')}
            className={isBottomNav ? 'w-5 h-5' : 'w-6 h-6'}
            style={
              isBottomNav
                ? {
                    filter: isNotificationPanelOpen
                      ? 'brightness(0) saturate(100%) invert(43%) sepia(98%) saturate(2375%) hue-rotate(185deg) brightness(93%) contrast(98%)'
                      : 'none',
                    transition: 'filter 0.2s ease-in-out',
                  }
                : undefined
            }
          />

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute flex items-center justify-center rounded-full font-semibold font-poppins leading-none shadow-sm',
                isBottomNav
                  ? '-top-2 -right-3 bg-red text-white text-[10px] min-w-[18px] h-[18px] px-1'
                  : '-top-3 -right-3 bg-red text-white text-xs min-w-[20px] h-5 px-1.5',
              )}
              aria-label={t('notification.unreadCountAria', '{{count}} unread notifications', {
                count: unreadCount,
              })}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        {/* Bottom nav label */}
        {isBottomNav && (
          <p
            className={`leading-none text-xs font-poppins ${
              isNotificationPanelOpen ? 'font-medium text-primary' : 'font-light text-grayDark'
            }`}
          >
            {t('notification.alerts')}
          </p>
        )}

        {/* Connection Status Indicator (only shown on error) */}
        {!isBottomNav && wsConnectionStatus === 'error' && (
          <span
            className="absolute bottom-0 right-0 w-3 h-3 bg-yellow border-2 border-white rounded-full"
            aria-label={t('notification.connectionErrorAria', 'Connection error')}
            title={t('notification.connectionErrorTooltip')}
          />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isNotificationPanelOpen && (
        <div
          className={cn(
            'absolute w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-platinum overflow-hidden z-50',
            isBottomNav
              ? 'bottom-full mb-2 right-0 animate-slideUp'
              : 'right-0 mt-2 animate-fadeIn',
          )}
          role="menu"
          aria-label={t('notification.listAria', 'Notification list')}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-platinum bg-light">
            <h3 className="text-base font-semibold font-poppins text-blackOlive">
              {t('notification.title')}
            </h3>
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
                    alt={t('notification.noNotificationsAlt', 'No notifications')}
                    className="w-12 h-12 opacity-30"
                  />
                  <p className="text-sm font-normal font-poppins text-gray">
                    {t('notification.noNotifications')}
                  </p>
                  <p className="text-xs font-normal font-poppins text-gray">
                    {t('notification.emptyHint')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connection Status Message (only shown on error with notifications) */}
          {wsConnectionStatus === 'error' && notifications.length > 0 && (
            <div className="px-4 py-2 bg-yellow-light border-t border-platinum">
              <p className="text-xs font-normal font-poppins text-grayDark text-center">
                {t('notification.connectionError')}
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
  variant: PropTypes.oneOf(['header', 'bottom-nav']),
};

export default NotificationBell;
