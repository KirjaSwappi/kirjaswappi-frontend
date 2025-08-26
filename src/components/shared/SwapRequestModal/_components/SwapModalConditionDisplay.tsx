import Image from '../../Image';

const ConditionDisplay = ({
  conditionItem,
}: {
  conditionItem: { image: string; label: string };
}) => (
  <div className="flex items-center gap-2 mt-5 mb-0">
    <Image src={conditionItem.image} alt={conditionItem.label} className="w-[14px]" />
    <h3>{conditionItem.label}</h3>
  </div>
);

export default ConditionDisplay;
