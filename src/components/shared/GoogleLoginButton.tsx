import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CredentialResponse } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginWithGoogleMutation } from '../../redux/feature/auth/authApi';
import { setLoginModalOpen } from '../../redux/feature/open/openSlice';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from './toast';

export default function GoogleLoginButton() {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      setButtonWidth(width > 0 ? width : undefined);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleGoogleLogin = (credentialResponse: CredentialResponse): void => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      loginWithGoogle({ idToken })
        .then((res) => {
          if (res.data) {
            showToast('success', t('toast.googleLoginSuccess'));
            dispatch(setLoginModalOpen(false));
          }
        })
        .catch(() => {
          showToast('error', t('toast.googleLoginFailed'));
        });
    } else {
      showToast('error', t('toast.somethingWentWrong'));
    }
  };

  return (
    <div ref={containerRef}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => showToast('error', t('toast.somethingWentWrong'))}
        width={buttonWidth}
      />
    </div>
  );
}
