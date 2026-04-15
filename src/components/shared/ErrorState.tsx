import { useTranslation } from 'react-i18next';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({ message, onRetry, retryLabel }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <div className="container min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="font-poppins text-grayDark text-sm mb-4">
          {message || t('books.errorMessage')}
        </p>
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            className="font-poppins text-sm text-white bg-primary px-4 py-2 rounded-lg cursor-pointer"
          >
            {retryLabel || t('books.tryAgain')}
          </Button>
        )}
      </div>
    </div>
  );
}
