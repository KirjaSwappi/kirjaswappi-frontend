import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import CompleteSuccessfully from '../../../../../public/CompleteSuccessfully.json';
export default function RequestSuccessAnimation({ isSuccess }: { isSuccess: boolean }) {
  return (
    <AnimatePresence>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 w-full h-full bg-black/50 flex flex-col items-center justify-center z-[9999999999]"
        >
          <Lottie
            animationData={CompleteSuccessfully}
            loop={true}
            style={{ width: 460, height: 300 }}
          />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-poppins text-sm text-white"
          >
            Request has been send to book owner...
          </motion.h3>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
