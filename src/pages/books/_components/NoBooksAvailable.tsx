import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import { clearAllFilters } from '../../../redux/feature/filter/filterSlice';
import { useAppDispatch } from '../../../redux/hooks';

export default function NoBooksAvailable() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="bg-white w-full rounded-lg p-6 flex min-h-[50vh] justify-center flex-col items-center">
        <h3 className="text-xl lg:text-2xl font-semibold mb-2 font-poppins text-[#262626]">
          {t('books.noBooks')}
        </h3>
        <p className="text-sm text-[#262626] font-poppins text-center">{t('books.noBooksDesc')}</p>
        <Button
          type="button"
          onClick={() => dispatch(clearAllFilters())}
          className="mt-4 font-poppins text-sm text-white bg-primary px-4 py-2 rounded-lg"
        >
          {t('books.clearFilters')}
        </Button>
      </div>
    </div>
  );
}
