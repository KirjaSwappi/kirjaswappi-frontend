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
          className="px-4 py-3 text-[14px] leading-[24px] text-black3a  flex justify-between items-center "
        >
          <p> {category}</p>

          <FaAngleRight />
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicySection;
