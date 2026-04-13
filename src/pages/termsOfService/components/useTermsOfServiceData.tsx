import { useTranslation } from 'react-i18next';
import { TCategorySection } from '../../privacyPolicy/interface/DummyDataType';

export const useTermsOfServiceData = () => {
  const { t } = useTranslation();

  const CategorySectionData: TCategorySection[] = [
    {
      id: 1,
      category: t('termsofservice.section.category1'),
      Mobilecategory: t('termsofservice.section.mobilecategory1'),
      title: t('termsofservice.section.title1'),
    },
    {
      id: 2,
      category: t('termsofservice.section.category2'),
      Mobilecategory: t('termsofservice.section.mobilecategory2'),
      title: t('termsofservice.section.title2'),
      children: [
        {
          points: [
            t('termsofservice.section.point2.1.1'),
            t('termsofservice.section.point2.1.2'),
            t('termsofservice.section.point2.1.3'),
          ],
        },
      ],
    },
    {
      id: 3,
      category: t('termsofservice.section.category3'),
      Mobilecategory: t('termsofservice.section.mobilecategory3'),
      title: t('termsofservice.section.title3'),
      children: [
        {
          points: [
            t('termsofservice.section.point3.1.1'),
            t('termsofservice.section.point3.1.2'),
            t('termsofservice.section.point3.1.3'),
            t('termsofservice.section.point3.1.4'),
          ],
        },
      ],
    },
    {
      id: 4,
      category: t('termsofservice.section.category4'),
      Mobilecategory: t('termsofservice.section.mobilecategory4'),
      title: t('termsofservice.section.title4'),
      children: [
        {
          points: [
            t('termsofservice.section.point4.1.1'),
            t('termsofservice.section.point4.1.2'),
            t('termsofservice.section.point4.1.3'),
          ],
        },
      ],
    },
    {
      id: 5,
      category: t('termsofservice.section.category5'),
      Mobilecategory: t('termsofservice.section.mobilecategory5'),
      title: t('termsofservice.section.title5'),
    },
    {
      id: 6,
      category: t('termsofservice.section.category6'),
      Mobilecategory: t('termsofservice.section.mobilecategory6'),
      title: t('termsofservice.section.title6'),
    },
    {
      id: 7,
      category: t('termsofservice.section.category7'),
      Mobilecategory: t('termsofservice.section.mobilecategory7'),
      title: t('termsofservice.section.title7'),
    },
    {
      id: 8,
      category: t('termsofservice.section.category8'),
      Mobilecategory: t('termsofservice.section.mobilecategory8'),
      title: t('termsofservice.section.title8'),
    },
  ];

  const getSectionById = (id: number) => {
    return CategorySectionData.find((item) => item.id === id);
  };

  return {
    CategorySectionData,
    getSectionById,
  };
};
