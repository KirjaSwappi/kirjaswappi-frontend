import country from '../../../assets/flag.png';
import Button from '../../shared/Button';
import Image from '../../shared/Image';

export default function Language() {
  return (
    <div>
      <Button className="flex items-center justify-center w-10 h-10 border border-primary rounded-full overflow-hidden">
        <Image src={country} alt="Swedish Flag" className="w-10 h-10 object-cover " />
      </Button>
    </div>
  );
}
