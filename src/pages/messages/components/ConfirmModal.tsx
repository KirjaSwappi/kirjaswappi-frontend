import { IoCloseOutline } from 'react-icons/io5';
import Button from '../../../components/shared/Button';

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
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm md:max-w-[30%]">
        <div className="p-4">
          <div className="flex items-center justify-between ">
            <h3 className="text-xl font-semibold ">{header}</h3>
            <Button onClick={onCancel}>
              <IoCloseOutline className="text-2xl text-[#6B6B6B]" />
            </Button>
          </div>
          <p className="mb-6 text-sm font-poppins font-normal text-[#6B6B6B] mt-6">{description}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#EFF0EF] py-4 px-5">
          <Button
            onClick={onCancel}
            className="px-5 border border-[#CDCDCD] rounded-md transition-colors text-[#0D121F] font-poppins text-sm font-medium w-[91px] h-[42px]"
          >
            Cancel
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
