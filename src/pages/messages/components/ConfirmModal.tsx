import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import Button from '../../../components/shared/Button';
import { useModal } from '../../../hooks/useModal';

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  header: string;
  description: string;
  btnValue?: string;
}

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  header,
  description,
  btnValue = 'Yes',
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const { modalRef, modalProps, backdropProps } = useModal({
    open,
    onClose: onCancel,
  });

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      {...backdropProps}
    >
      <div
        ref={modalRef}
        {...modalProps}
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm md:max-w-md outline-none"
      >
        <div className="p-4">
          <div className="flex items-center justify-between ">
            <h3 className="text-xl font-semibold ">{header}</h3>
            <Button onClick={onCancel} aria-label={t('close')}>
              <IoCloseOutline className="text-2xl text-textSecondary" />
            </Button>
          </div>
          <p className="mb-6 text-sm font-poppins font-normal text-textSecondary mt-6">
            {description}
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-borderLight py-4 px-5">
          <Button
            onClick={onCancel}
            className="px-5 border border-gray rounded-md transition-colors text-textPrimary font-poppins text-sm font-medium w-[91px] h-[42px]"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 bg-red text-white rounded-md  transition-colors font-poppins text-sm w-[91px] h-[42px]"
          >
            {btnValue}
          </Button>
        </div>
      </div>
    </div>
  );
}
