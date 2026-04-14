import type { CredentialResponse } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginWithGoogleMutation } from '../../redux/feature/auth/authApi';
import { setLoginModalOpen } from '../../redux/feature/open/openSlice';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from './toast';

export default function GoogleLoginButton() {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const dispatch = useAppDispatch();
  const handleGoogleLogin = (credentialResponse: CredentialResponse): void => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      loginWithGoogle({ idToken })
        .then((res) => {
          if (res.data) {
            showToast('success', 'Login successful');
            dispatch(setLoginModalOpen(false));
          }
        })
        .catch(() => {
          showToast('error', 'Google login failed. Please try again.');
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
