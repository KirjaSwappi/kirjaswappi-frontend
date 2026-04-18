import { useTranslation } from 'react-i18next';
import review from '../../../assets/review.svg';
import Image from '../../../components/shared/Image';
export default function RatingAndReview() {
  const { t } = useTranslation();
  return (
    <div className="my-6 flex flex-col gap-3 items-center justify-center h-[50vh]">
      <Image src={review} alt="review" className="w-8/12 block mx-auto" />
      <p>{t('profile.noReviews')}</p>
    </div>
  );
}
