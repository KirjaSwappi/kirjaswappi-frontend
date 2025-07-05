import { PrivacyPolicySection } from '../interface/types';
import { Paragraph, List, BoldText } from './policyText';

export const getPrivacyPolicySections = (t: (key: string) => string): PrivacyPolicySection[] => {
  const personalInfoItems = [
    { item: t('privacypolicy.personalInfo.name'), collected: true },
    { item: t('privacypolicy.personalInfo.email'), collected: false },
    { item: t('privacypolicy.personalInfo.mailingAddress'), collected: true },
    { item: t('privacypolicy.personalInfo.phoneNumber'), collected: true },
  ];

  const nonPersonalInfoItems = [
    t('privacypolicy.nonPersonal.0'),
    t('privacypolicy.nonPersonal.1'),
    t('privacypolicy.nonPersonal.2'),
    t('privacypolicy.nonPersonal.3'),
    t('privacypolicy.nonPersonal.4'),
    t('privacypolicy.nonPersonal.5'),
  ];

  const userContentItems = [
    t('privacypolicy.userContent.0'),
    t('privacypolicy.userContent.1'),
    t('privacypolicy.userContent.2'),
  ];

  const usesOfInfoItems = [
    t('privacypolicy.uses.0'),
    t('privacypolicy.uses.1'),
    t('privacypolicy.uses.2'),
    t('privacypolicy.uses.3'),
    t('privacypolicy.uses.4'),
    t('privacypolicy.uses.5'),
    t('privacypolicy.uses.6'),
  ];

  return [
    {
      category: t('privacypolicy.category.information'),
      items: [
        {
          key: 'personal',
          title: t('privacypolicy.title.personal'),
          content: (
            <div className="space-y-4 lg:space-y-2">
              {personalInfoItems.map(({ item, collected }) => (
                <div key={item}>
                  <div className="lg:text-black text-[#808080] sm:pl-0 lg:pl-0 lg:text-[15px] text-[14px] font-normal">
                    {item}
                  </div>
                  <div className="lg:hidden sm:pl-0 text-gray-700 text-[15px]">
                    {collected ? t('privacypolicy.collect.yes') : t('privacypolicy.collect.no')}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'nonPersonal',
          title: t('privacypolicy.title.nonPersonal'),
          content: <List items={nonPersonalInfoItems} />,
        },
        {
          key: 'userContent',
          title: t('privacypolicy.title.userContent'),
          content: <List items={userContentItems} />,
        },
      ],
    },
    {
      category: t('privacypolicy.category.usage'),
      items: [
        {
          key: 'uses',
          title: t('privacypolicy.title.uses'),
          content: <List items={usesOfInfoItems} />,
        },
        {
          key: 'sharing',
          title: t('privacypolicy.title.sharing'),
          content: (
            <div className="space-y-4">
              <BoldText title={t('privacypolicy.sharing.withUsers')}>
                {t('privacypolicy.sharing.withUsers.desc')}
              </BoldText>
              <BoldText title={t('privacypolicy.sharing.withProviders')}>
                {t('privacypolicy.sharing.withProviders.desc')}
              </BoldText>
              <BoldText title={t('privacypolicy.sharing.legal')}>
                {t('privacypolicy.sharing.legal.desc')}
              </BoldText>
              <BoldText title={t('privacypolicy.sharing.consent')}>
                {t('privacypolicy.sharing.consent.desc')}
              </BoldText>
            </div>
          ),
        },
        {
          key: 'security',
          title: t('privacypolicy.title.security'),
          content: (
            <div className="space-y-4">
              <Paragraph>{t('privacypolicy.security.intro')}</Paragraph>
              <List
                items={[
                  t('privacypolicy.security.0'),
                  t('privacypolicy.security.1'),
                  t('privacypolicy.security.2'),
                ]}
              />
              <Paragraph>{t('privacypolicy.security.outro')}</Paragraph>
            </div>
          ),
        },
        {
          key: 'cookies',
          title: t('privacypolicy.title.cookies'),
          content: (
            <div className="space-y-4">
              <Paragraph>{t('privacypolicy.cookies.0')}</Paragraph>
              <Paragraph>{t('privacypolicy.cookies.1')}</Paragraph>
            </div>
          ),
        },
      ],
    },
    {
      category: t('privacypolicy.category.additional'),
      items: [
        {
          key: 'thirdParty',
          title: t('privacypolicy.title.thirdParty'),
          content: <Paragraph>{t('privacypolicy.thirdParty')}</Paragraph>,
        },
        {
          key: 'children',
          title: t('privacypolicy.title.children'),
          content: <Paragraph>{t('privacypolicy.children')}</Paragraph>,
        },
        {
          key: 'rights',
          title: t('privacypolicy.title.rights'),
          content: (
            <div className="space-y-4">
              <BoldText title={t('privacypolicy.rights.access')}>
                {t('privacypolicy.rights.access')}
              </BoldText>
              <BoldText title={t('privacypolicy.rights.correction')}>
                {t('privacypolicy.rights.correction')}
              </BoldText>
              <BoldText title={t('privacypolicy.rights.deletion')}>
                {t('privacypolicy.rights.deletion')}
              </BoldText>
              <BoldText title={t('privacypolicy.rights.optout')}>
                {t('privacypolicy.rights.optout')}
              </BoldText>
              <Paragraph>{t('privacypolicy.rights.contact')}</Paragraph>
            </div>
          ),
        },
        {
          key: 'international',
          title: t('privacypolicy.title.international'),
          content: <Paragraph>{t('privacypolicy.international')}</Paragraph>,
        },
        {
          key: 'changes',
          title: t('privacypolicy.title.changes'),
          content: <Paragraph>{t('privacypolicy.changes')}</Paragraph>,
        },
      ],
    },
  ];
};
