import { useTranslation } from 'react-i18next';
import { TCategorySection } from '../interface/DummyDataType';

export const usePrivacyPolicyData = () => {
  const { t } = useTranslation();

  const CategorySectionData: TCategorySection[] = [
    {
      id: 1,
      category: t('privacypolicy.section.category1'),
      Mobilecategory: t('privacypolicy.section.mobilecategory1'),
      title: t('privacypolicy.section.title1'),
      children: [
        {
          subHeading: t('privacypolicy.section.subheading1.1'),
          points: [
            t('privacypolicy.section.point1.1.1'),
            t('privacypolicy.section.point1.1.2'),
            t('privacypolicy.section.point1.1.3'),
            t('privacypolicy.section.point1.1.4'),
            t('privacypolicy.section.point1.1.5'),
            t('privacypolicy.section.point1.1.6'),
          ],
        },
        {
          subHeading: t('privacypolicy.section.subheading1.2'),
          points: [
            t('privacypolicy.section.point1.2.1'),
            t('privacypolicy.section.point1.2.2'),
            t('privacypolicy.section.point1.2.3'),
            t('privacypolicy.section.point1.2.4'),
            t('privacypolicy.section.point1.2.5'),
            t('privacypolicy.section.point1.2.6'),
          ],
        },
        {
          subHeading: t('privacypolicy.section.subheading1.3'),
          points: [
            t('privacypolicy.section.point1.3.1'),
            t('privacypolicy.section.point1.3.2'),
            t('privacypolicy.section.point1.3.3'),
          ],
        },
      ],
    },
    {
      id: 2,
      category: t('privacypolicy.section.category2'),
      Mobilecategory: t('privacypolicy.section.mobilecategory2'),
      title: t('privacypolicy.section.title2'),
      children: [
        {
          points: [
            t('privacypolicy.section.point2.1.1'),
            t('privacypolicy.section.point2.1.2'),
            t('privacypolicy.section.point2.1.3'),
            t('privacypolicy.section.point2.1.4'),
            t('privacypolicy.section.point2.1.5'),
            t('privacypolicy.section.point2.1.6'),
            t('privacypolicy.section.point2.1.7'),
          ],
        },
      ],
    },
    {
      id: 3,
      category: t('privacypolicy.section.category3'),
      Mobilecategory: t('privacypolicy.section.mobilecategory3'),
      title: t('privacypolicy.section.title3'),
      children: [
        {
          points: [
            t('privacypolicy.section.point3.1.1'),
            t('privacypolicy.section.point3.1.2'),
            t('privacypolicy.section.point3.1.3'),
            t('privacypolicy.section.point3.1.4'),
          ],
        },
      ],
    },
    {
      id: 4,
      category: t('privacypolicy.section.category4'), // FIXED: Changed from mobilecategory to category
      Mobilecategory: t('privacypolicy.section.mobilecategory4'), // FIXED: Changed from hardcoded string
      title: t('privacypolicy.section.title4'),
      paragraph: t('privacypolicy.section.paragraph4'),
      children: [
        {
          points: [
            t('privacypolicy.section.point4.1.1'),
            t('privacypolicy.section.point4.1.2'),
            t('privacypolicy.section.point4.1.3'),
          ],
        },
      ],
    },
    {
      id: 5,
      category: t('privacypolicy.section.category5'),
      Mobilecategory: t('privacypolicy.section.mobilecategory5'),
      title: t('privacypolicy.section.title5'),
      paragraph: t('privacypolicy.section.paragraph5'),
    },
    {
      id: 6,
      category: t('privacypolicy.section.category6'),
      Mobilecategory: t('privacypolicy.section.mobilecategory6'),
      title: t('privacypolicy.section.title6'),
    },
    {
      id: 7,
      category: t('privacypolicy.section.category7'),
      Mobilecategory: t('privacypolicy.section.mobilecategory7'),
      title: t('privacypolicy.section.title7'),
    },
    {
      id: 8,
      category: t('privacypolicy.section.category8'),
      Mobilecategory: t('privacypolicy.section.mobilecategory8'),
      title: t('privacypolicy.section.title8'),
      paragraph: t('privacypolicy.section.paragraph8'),
      children: [
        {
          points: [
            t('privacypolicy.section.point8.1.1'),
            t('privacypolicy.section.point8.1.2'),
            t('privacypolicy.section.point8.1.3'),
            t('privacypolicy.section.point8.1.4'),
          ],
        },
      ],
    },
    {
      id: 9,
      category: t('privacypolicy.section.category9'),
      Mobilecategory: t('privacypolicy.section.mobilecategory9'),
      title: t('privacypolicy.section.title9'),
    },
    {
      id: 10,
      category: t('privacypolicy.section.category10'),
      Mobilecategory: t('privacypolicy.section.mobilecategory10'),
      title: t('privacypolicy.section.title10'),
    },
    {
      id: 11,
      category: t('privacypolicy.section.category11'),
      Mobilecategory: t('privacypolicy.section.mobilecategory11'),
      title: t('privacypolicy.section.title11'),
      paragraph: t('privacypolicy.section.paragraph11'),
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
