import close from '../../../../assets/close.svg';
import Button from '../../Button';
import Image from '../../Image';
const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="py-4 border-b border-platinum relative">
    <h3 className="font-poppins font-normal text-base text-center lg:text-left lg:pl-4">
      Swap Request
    </h3>
    <Button
      onClick={onClose}
      className="absolute right-4 top-3 p-2 border border-platinum rounded-full"
    >
      <Image src={close} alt="close" />
    </Button>
  </div>
);
export default ModalHeader;
