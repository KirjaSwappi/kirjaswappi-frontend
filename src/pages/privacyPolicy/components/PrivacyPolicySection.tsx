/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

// interface PrivacyPolicySectionProps {
//   category: string;
//   items: PrivacyPolicyTranslationItem[];
// }

// React.FC<PrivacyPolicySectionProps>
const PrivacyPolicySection = ({ category, item }: any) => {
  // console.log(item);

  return (
    <div className=" lg:pt-0">
      <div className="block lg:hidden bg-white py-3  ">
        <Link
          to={`/privacy-policy/${item?.id}`}
          className="p-4  text-black3a  flex justify-between items-center "
        >
          <p className=" text-[16px] leading-[24px] "> {category}</p>

          <FaAngleRight className="  font-light size-6 " />
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicySection;
