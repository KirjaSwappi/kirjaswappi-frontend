import home from '../assets/bookIcon.svg';
import message from '../assets/message.svg';
import map from '../assets/uiw_map.svg';

export const menu = [
  {
    id: 1,
    icon: home,
    value: 'books',
    route: '/',
    isRoute: true,
    isShow: true,
  },
  {
    id: 2,
    icon: map,
    value: 'map',
    route: '/map',
    isRoute: true,
    isShow: true,
  },
  {
    id: 3,
    icon: message,
    value: 'messages',
    route: '/user/messages',
    isRoute: true,
    isShow: true,
  },
];
