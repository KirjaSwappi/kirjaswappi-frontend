import type { CredentialResponse } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {
  const handleGoogleLogin = (credentialResponse: CredentialResponse): void => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      console.log(idToken);
    } else {
      console.error('No credential returned from Google');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => console.error('Google Login Failed')}
    />
  );
}
