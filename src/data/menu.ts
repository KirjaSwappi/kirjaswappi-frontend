import home from '../assets/bookIcon.svg';
import message from '../assets/message.svg';
import notification from '../assets/notification.svg';
import map from '../assets/uiw_map.svg';

export const menu = [
  {
    id: 1,
    icon: home,
    //selected: home,
    value: 'books',
    route: '/',
    isRoute: true,
    isShow: true,
  },
  {
    id: 2,
    icon: map,
    // selected: store,
    value: 'map',
    route: '/map',
    isRoute: true,
    isShow: true,
  },
  {
    id: 3,
    icon: message,
    //selected: category,
    value: 'messages',
    route: '/user/messages',
    isRoute: true,
    isShow: true,
  },
  {
    id: 5,
    icon: notification,
    // selected: notification,
    value: 'Notification',
    route: '/profile/notification',
    isRoute: true,
    isShow: false,
  },
];
