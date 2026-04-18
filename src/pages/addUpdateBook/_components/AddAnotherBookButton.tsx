import { useTranslation } from 'react-i18next';
import plusIcon from '../../../assets/plus.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';

export default function AddAnotherBookButton({ addAnotherBook }: { addAnotherBook: () => void }) {
  const { t } = useTranslation();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAnotherBook();
    }
  };
  return (
    <div className="mt-4 pb-4 border-t border-[#E4E4E4]">
      <Button
        type="button"
        onClick={addAnotherBook}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="button"
        className="flex items-center justify-center gap-1 w-full border border-dashed border-grayDark py-3 text-sm font-poppins text-grayDark rounded-md"
      >
        <Image src={plusIcon} alt="Add Another Book" />
        {t('addBook.addAnotherBook')}
      </Button>
    </div>
  );
}
