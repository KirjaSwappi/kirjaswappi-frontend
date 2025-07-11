import type { CredentialResponse } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginWithGoogleMutation } from '../../redux/feature/auth/authApi';

export default function GoogleLoginButton() {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const handleGoogleLogin = (credentialResponse: CredentialResponse): void => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      loginWithGoogle({ idToken });
    } else {
      console.error('No credential returned from Google');
    }
  };

  return (
    <div className="mt-3">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.error('Google Login Failed')}
      />
    </div>
  );
}
