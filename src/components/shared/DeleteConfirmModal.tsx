import { IoClose } from 'react-icons/io5';
import Button from './Button';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose?: (e?: React.MouseEvent) => void;
  onDelete?: (e?: React.MouseEvent) => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
  deleteLabel?: string;
  cancelLabel?: string;
}

const DeleteConfirmModal = ({
  open,
  onClose,
  onDelete,
  isLoading = false,
  title = 'Are You Sure?',
  message = 'Are you sure you want to delete this book',
  deleteLabel = 'Delete',
  cancelLabel = 'Cancel',
}: DeleteConfirmModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d88]">
      <div className="bg-white rounded-lg w-[95%] max-w-sm relative animate-fadeIn ">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-medium text-[#0D121F] font-poppins">{title}</h2>
          <Button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose color="#6B6B6B" size={24} />
          </Button>
        </div>
        <div className="mt-4">
          <p className="text-sm text-[#6B6B6B] mb-6 lg:mb-10 px-5 font-poppins font-normal">
            {message}
          </p>
          <div className="flex justify-end gap-3 border-t border-[#EFF0EF] py-2 lg:py-4 px-2 lg:px-4 font-poppins text-sm">
            <Button
              className="bg-gray-100 text-[#0D121F] px-5 py-2 border border-[#CDCDCD] rounded-md transition"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              className="bg-red text-white px-5 py-2 rounded-md transition flex items-center justify-center min-w-[90px]"
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                deleteLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
