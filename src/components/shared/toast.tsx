import { FaCheckCircle } from 'react-icons/fa';
import { IoClose, IoCloseCircle } from 'react-icons/io5';
import { toast, ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error';

export const showToast = (type: ToastType, message: string) => {
  const baseOptions: ToastOptions = {
    position: 'bottom-left',
    closeButton: <IoClose className="text-white absolute right-1" />,
    className:
      type === 'success'
        ? 'bg-primary text-white rounded-md px-4 py-3 font-poppins text-sm'
        : 'bg-[#EA244E] text-white rounded-md px-4 py-3 font-poppins text-sm',
    icon: type === 'success' ? <FaCheckCircle size={18} /> : <IoCloseCircle size={18} />,
  };

  toast(message, baseOptions);
};
