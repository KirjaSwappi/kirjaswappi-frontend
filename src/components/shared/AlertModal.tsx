import { useDispatch } from 'react-redux';
import close from '../../assets/close.svg';
import { setAlert } from '../../redux/feature/notification/notificationSlice';
import { useAppSelector } from '../../redux/hooks';
import Button from './Button';
import Image from './Image';
interface IAlert {
  yes?: () => void;
  no?: () => void;
  yesBtnValue?: string;
  noBtnValue?: string;
  alertTitle?: string;
  loading?: boolean;
}
export default function AlertModal({
  alertTitle = 'Leave Page?',
  yes,
  no,
  yesBtnValue = 'Yes',
  noBtnValue = 'No',
  loading = false,
}: IAlert) {
  const { showAlert, message } = useAppSelector((state) => state.notification);
  const dispatch = useDispatch();
  return (
    <div
      className={`${
        showAlert ? 'block' : 'hidden'
      } bg-black bg-opacity-50 inset-0 w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center p-3`}
    >
      <div className="w-11/12 bg-white rounded-md ">
        <div className="border-b border-[#E4E4E4] flex items-center justify-between px-4 py-2 relative">
          <h3 className="font-poppins font-normal text-base text-center leading-none">
            {alertTitle}
          </h3>
          <Button
            onClick={() => dispatch(setAlert({ showAlert: false }))}
            className="border border-platinum rounded-full p-2"
          >
            <Image src={close} alt="close" />
          </Button>
        </div>
        <p className="px-3 py-3  text-base font-poppins">{message}</p>
        <div className="px-3 pb-3 flex justify-end">
          <Button
            onClick={no}
            className="font-medium text-xs px-4 py-2 h-[30px] rounded-[8px] font-poppins flex justify-center items-center gap-2 "
          >
            {noBtnValue}
          </Button>
          <Button
            onClick={yes}
            className=" bg-primary text-white  font-medium text-xs px-4 py-2 h-[30px] rounded-[8px] font-poppins flex justify-center items-center gap-2 "
          >
            {loading ? (
              <div className=" w-4 h-4 border-2 border-transparent border-t-2 border-t-primary border-r-2 border-r-white rounded-full animate-spin" />
            ) : (
              yesBtnValue
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
