import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import FailedAnimation from '../../../../assets/FailedAnimation.json';
import { useAppSelector } from '../../../../redux/hooks';

export default function RequestFailedAnimation({ isFailed }: { isFailed: boolean }) {
  const { errorMessage } = useAppSelector((state) => state.swapBook);
  return (
    <div
      className={`${isFailed ? 'block' : 'hidden'} bg-black bg-opacity-50 inset-0 w-full h-screen fixed -top-0 left-0 z-[999999999] flex items-center justify-center`}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 w-11/12 lg:w-[20%] h-[40%] bg-white flex flex-col items-center justify-center z-[9999999999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-3"
        >
          <Lottie animationData={FailedAnimation} loop={true} className="w-[360px] h-[260px]" />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-poppins text-sm lg:text-base text-[#2B2B2B] font-semibold text-center"
          >
            {errorMessage ? errorMessage : 'Swap Failed'}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-poppins text-xs text-[#6F6E77] font-light"
          >
            Please try again
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
