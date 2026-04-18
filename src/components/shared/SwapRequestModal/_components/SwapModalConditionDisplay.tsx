import { useTranslation } from 'react-i18next';
import Image from '../../Image';

const ConditionDisplay = ({
  conditionItem,
}: {
  conditionItem?: { image: string; labelKey: string };
}) => {
  const { t } = useTranslation();
  if (!conditionItem) return null;
  return (
    <div className="flex items-center gap-2 mt-5 mb-0">
      <Image src={conditionItem.image} alt={t(conditionItem.labelKey)} className="w-[14px]" />
      <h3>{t(conditionItem.labelKey)}</h3>
    </div>
  );
};

export default ConditionDisplay;
