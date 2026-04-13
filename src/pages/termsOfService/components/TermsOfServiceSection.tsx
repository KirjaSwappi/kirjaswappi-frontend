import { FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { TCategorySection } from '../../privacyPolicy/interface/DummyDataType';

const TermsOfServiceSection = ({
  category,
  item,
}: {
  category: string;
  item: TCategorySection;
}) => {
  return (
    <div className=" lg:pt-0">
      <div className="block lg:hidden bg-white py-3  ">
        <Link
          to={`/terms-of-service/${item?.id}`}
          className="p-4  text-black3a  flex justify-between items-center "
        >
          <p className=" text-[16px] leading-[24px] "> {category}</p>
          <FaAngleRight className="  font-light size-6 " />
        </Link>
      </div>
    </div>
  );
};

export default TermsOfServiceSection;
