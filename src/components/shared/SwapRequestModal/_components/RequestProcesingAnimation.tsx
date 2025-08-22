import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import LoadingPaperplane from '../../../../assets/LoadingPaperplane.json';
export default function RequestProcessingAnimation({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 w-full h-full bg-white flex flex-col items-center justify-center z-[9999999999]"
        >
          <Lottie
            animationData={LoadingPaperplane}
            loop={true}
            style={{ width: 460, height: 300 }}
          />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-poppins text-sm"
          >
            Request Sending...
          </motion.h3>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
