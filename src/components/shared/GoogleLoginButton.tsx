import type { CredentialResponse } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginWithGoogleMutation } from '../../redux/feature/auth/authApi';
import { showToast } from './toast';

export default function GoogleLoginButton() {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const handleGoogleLogin = (credentialResponse: CredentialResponse): void => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      loginWithGoogle({ idToken }).then((res) => {
        if (res.data) showToast('success', 'Login successful');
      });
    } else {
      showToast('error', 'Something went wrong! Please try again.');
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => showToast('error', 'Something went wrong! Please try again.')}
      />
    </div>
  );
}
