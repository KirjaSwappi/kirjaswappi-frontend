import { FaCheckCircle } from 'react-icons/fa';
import { IoClose, IoCloseCircle } from 'react-icons/io5';
import { toast, ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error';

export const showToast = (type: ToastType, message: string) => {
  const baseOptions: ToastOptions = {
    position: 'bottom-left',
    style: { width: '360px' },
    closeButton: <IoClose className="text-white absolute right-1" />,
    className:
      type === 'success'
        ? 'bg-[#3FBA49] text-white rounded-md px-4 py-3'
        : 'bg-[#EA244E] text-white rounded-md px-4 py-3 ',
    icon: type === 'success' ? <FaCheckCircle size={18} /> : <IoCloseCircle size={18} />,
  };

  toast(message, baseOptions);
};
