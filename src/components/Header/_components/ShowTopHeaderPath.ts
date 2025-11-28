function getTopHeaderPaths(params: string | undefined) {
  return [
    '/',
    `/book-details/${params}`,
    '/profile/add-book',
    '/profile/user-profile',
    `/profile/update-book/${params}`,
    `/profile/user-profile/${params}`,
    '/auth/login',
    '/auth/register',
    '/password/reset',
    '/user/messages',
    `/user/messages/${params}/isMessage=True`,
    '/map',
    '/contact-us',
    '/collaboration',
    '/donation',
    '/volunteer',
    '/feedback',
  ];
}
export const ShowTopHeaderPath = getTopHeaderPaths;
