import { PrivacyPolicySection } from '../interface/types';
import { Paragraph, List, BoldText } from './policyText';

export const PRIVACY_POLICY_INTRODUCTION = `We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, store, and protect your information when you use our Website. By using KirjaSwappi, you agree to the terms of this Privacy Policy. If you do not agree with any part of this policy, please do not use our Website.`;

const personalInfoItems = [
  { item: 'Name', collected: true },
  { item: 'Email', collected: false },
  { item: 'Mailing Address', collected: true },
  { item: 'Phone Number', collected: true },
];

const nonPersonalInfoItems = [
  'IP address',
  'Browser type and version',
  'Operating system',
  'Pages visited on the Website',
  'Time and date of visits',
  'Referring website (if applicable)',
];

const userContentItems = [
  'Book listings (title, author, condition, etc.)',
  'Reviews and ratings',
  'Messages exchanged with other users',
];

const usesOfInfoItems = [
  'To facilitate book swaps between users.',
  'To create and manage your account.',
  'To communicate with you about your account, transactions, and updates to our services.',
  'To improve the functionality and user experience of the Website.',
  'To process payments (if applicable).',
  'To send promotional emails or newsletters (only with your consent).',
  'To comply with legal obligations and resolve disputes.',
];

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    category: 'Information we collect',
    items: [
      {
        key: 'personal',
        title: 'Personal Information',
        content: (
          <div className="space-y-4 lg:space-y-2">
            {personalInfoItems.map(({ item, collected }) => (
              <div key={item}>
                <div className="lg:text-black text-[#808080] sm:pl-4 lg:pl-0 lg:text-[15px] text-[14px] font-normal">
                  {item}
                </div>
                <div className="lg:hidden sm:pl-4 text-gray-700 text-[15px]">
                  {collected ? 'We collect from site' : "We don't collect from site"}
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'nonPersonal',
        title: 'Non-Personal Information',
        content: <List items={nonPersonalInfoItems} />,
      },
      {
        key: 'userContent',
        title: 'User Generated Content',
        content: <List items={userContentItems} />,
      },
    ],
  },
  {
    category: 'Information Usages & Data Privacy',
    items: [
      {
        key: 'uses',
        title: 'Uses of information',
        content: <List items={usesOfInfoItems} />,
      },
      {
        key: 'sharing',
        title: 'Sharing Information',
        content: (
          <div className="space-y-4">
            <BoldText title="With Other Users">
              Your name, mailing address, and contact information may be shared with other users to
              facilitate book swaps.
            </BoldText>
            <BoldText title="With Service Providers">
              We may share information with third-party service providers who assist us in operating
              the Website (e.g., payment processors, hosting providers).
            </BoldText>
            <BoldText title="For Legal Reasons">
              We may disclose your information if required by law or to protect our rights,
              property, or safety.
            </BoldText>
            <BoldText title="With Your Consent">
              We may share your information with third parties if you give us explicit permission to
              do so.
            </BoldText>
          </div>
        ),
      },
      {
        key: 'security',
        title: 'Data Security',
        content: (
          <div className="space-y-4">
            <Paragraph>
              We implement various security measures to protect your personal information:
            </Paragraph>
            <List
              items={[
                'Using encryption for sensitive data (e.g., payment information).',
                'Regularly updating our security practices.',
                'Limiting access to personal information to authorized personnel only.',
              ]}
            />
            <Paragraph>
              However, no method of transmission over the internet or electronic storage is 100%
              secure. While we strive to protect your information, we cannot guarantee absolute
              security.
            </Paragraph>
          </div>
        ),
      },
      {
        key: 'cookies',
        title: 'Cookies and Tracking Technologies',
        content: (
          <div className="space-y-4">
            <Paragraph>
              We use cookies and similar tracking technologies to enhance your experience on our
              Website. Cookies are small files stored on your device that help us remember your
              preferences and track usage patterns.
            </Paragraph>
            <Paragraph>
              You can disable cookies through your browser settings, but this may affect the
              functionality of the Website.
            </Paragraph>
          </div>
        ),
      },
    ],
  },
  {
    category: 'Additional Terms',
    items: [
      {
        key: 'thirdParty',
        title: 'Third-Party Links',
        content: (
          <Paragraph>
            Our Website may contain links to third-party websites. We are not responsible for the
            privacy practices or content of these websites. We encourage you to review the privacy
            policies of any third-party sites you visit.
          </Paragraph>
        ),
      },
      {
        key: 'children',
        title: "Children's Privacy",
        content: (
          <Paragraph>
            Our Website is not intended for use by individuals under the age of 7. We do not
            knowingly collect personal information from children under 7. If we become aware that we
            have collected such information, we will take steps to delete it.
          </Paragraph>
        ),
      },
      {
        key: 'rights',
        title: 'Your Rights and Choices',
        content: (
          <div className="space-y-4">
            <BoldText title="Access">
              You can request a copy of the personal information we hold about you.
            </BoldText>
            <BoldText title="Correction">
              You can update or correct your personal information through your account settings or
              by contacting us.
            </BoldText>
            <BoldText title="Deletion">
              You can request that we delete your personal information, subject to certain legal
              obligations.
            </BoldText>
            <BoldText title="Opt-Out">
              You can opt out of receiving promotional emails by following the unsubscribe link in
              the email.
            </BoldText>
            <Paragraph>
              To exercise these rights, please contact us at{' '}
              <a href="mailto:info@kirjaswappi.fi" className="underline">
                info@kirjaswappi.fi
              </a>
              .
            </Paragraph>
          </div>
        ),
      },
      {
        key: 'international',
        title: 'International Users',
        content: (
          <Paragraph>
            If you are accessing the Website from outside Finland, please note that your information
            may be transferred to, stored, and processed in Finland, where our servers are located.
            By using the Website, you consent to this transfer and processing.
          </Paragraph>
        ),
      },
      {
        key: 'changes',
        title: 'Changes to This Privacy Policy',
        content: (
          <Paragraph>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated &apos;Last Updated&apos; date. We encourage you to review this
            policy periodically to stay informed about how we are protecting your information.
          </Paragraph>
        ),
      },
    ],
  },
];
