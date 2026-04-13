import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../types/notification', () => ({}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import NotificationItem, {
  formatNotificationTime,
} from '../../../components/Header/_components/NotificationItem';

const t = ((key: string) => key) as unknown as import('i18next').TFunction;

describe('formatNotificationTime', () => {
  it('returns justNow key for recent timestamps', () => {
    const now = new Date().toISOString();
    expect(formatNotificationTime(now, t)).toBe('notification.justNow');
  });

  it('returns minutesAgo key', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatNotificationTime(fiveMinAgo, t)).toBe('notification.minutesAgo');
  });

  it('returns minuteAgo key for singular', () => {
    const oneMinAgo = new Date(Date.now() - 60 * 1000).toISOString();
    expect(formatNotificationTime(oneMinAgo, t)).toBe('notification.minuteAgo');
  });

  it('returns hoursAgo key', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatNotificationTime(twoHoursAgo, t)).toBe('notification.hoursAgo');
  });

  it('returns daysAgo key', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatNotificationTime(threeDaysAgo, t)).toBe('notification.daysAgo');
  });

  it('handles invalid date gracefully', () => {
    const result = formatNotificationTime('invalid', t);
    expect(typeof result).toBe('string');
  });
});

describe('NotificationItem', () => {
  const notification = {
    id: '1',
    userId: 'u1',
    title: 'New Swap',
    message: 'Someone wants to swap',
    time: new Date().toISOString(),
    isRead: false,
  };

  it('renders title', () => {
    render(<NotificationItem notification={notification} />);
    expect(screen.getByText('New Swap')).toBeInTheDocument();
  });

  it('renders message', () => {
    render(<NotificationItem notification={notification} />);
    expect(screen.getByText('Someone wants to swap')).toBeInTheDocument();
  });

  it('shows unread indicator for unread notifications', () => {
    render(<NotificationItem notification={notification} />);
    expect(screen.getByLabelText('Unread')).toBeInTheDocument();
  });

  it('hides unread indicator for read notifications', () => {
    render(<NotificationItem notification={{ ...notification, isRead: true }} />);
    expect(screen.queryByLabelText('Unread')).not.toBeInTheDocument();
  });
});
