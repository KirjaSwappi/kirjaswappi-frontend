import home from '../assets/bookIcon.svg';
import message from '../assets/message.svg';
import map from '../assets/uiw_map.svg';
import profile from '../assets/profileIcon.png';

export const menu = [
  {
    id: 1,
    icon: home,
    //   selected: home,
    value: 'books',
    route: '/',
    isRoute: true,
    isShow: true,
  },
  {
    id: 2,
    icon: map,
    //   selected: store,
    value: 'map',
    route: '/map',
    isRoute: true,
    isShow: true,
  },
  {
    id: 3,
    icon: message,
    //   selected: category,
    value: 'messages',
    route: '/user/inbox',
    isRoute: true,
    isShow: true,
  },
  {
    id: 5,
    icon: profile,
    selected: profile,
    value: 'profile',
    route: '/profile/user-profile',
    isRoute: true,
    isShow: false,
  },
];
