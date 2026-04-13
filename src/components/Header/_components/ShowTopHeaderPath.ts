function getTopHeaderPaths(params: string | undefined) {
  return [
    '/',
    `/book-details/${params}`,
    '/profile/add-book',
    `/profile/update-book/${params}`,
    `/profile/user-profile/${params}`,
    '/auth/login',
    '/auth/register',
    '/password/reset',
    '/user/messages',
    `/user/messages/${params}`,
    '/map',
    '/privacy-policy',
    '/terms-of-service',
    '/support-us',
    '/contact-us',
    '/collaboration',
    '/donation',
    '/volunteer',
    '/feedback',
  ];
}
export const ShowTopHeaderPath = getTopHeaderPaths;
