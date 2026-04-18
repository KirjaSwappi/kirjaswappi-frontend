import { useTranslation } from 'react-i18next';
import Input, { IInputFieldProps } from '../../../components/shared/Input';
import { cn } from '../../../utility/cn';
interface UploadPictureProps extends IInputFieldProps {
  isShow?: boolean;
  labelClassName?: string;
}
const UploadPicture = ({
  id = 'file',
  className,
  labelClassName,
  isShow = true,
  ...props
}: UploadPictureProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'border-[1px] border-dashed border-grayDark rounded-lg cursor-pointer block',
        className,
      )}
    >
      <label
        htmlFor={id}
        className={cn('flex flex-col items-center justify-center h-full', labelClassName)}
      >
        <span className="text-grayDark text-3xl font-poppins font-extralight">+</span>
        {isShow && (
          <span className="text-grayDark text-xs font-poppins font-normal">
            {t('addBook.uploadPicture')}
          </span>
        )}

        <Input multiple id={id} type="file" className="hidden" {...props} />
      </label>
    </div>
  );
};

export default UploadPicture;
