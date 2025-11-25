import { TCategorySection } from '../interface/DummyDataType';

export const dummyCategorySection: TCategorySection[] = [
  {
    id: 1,
    category: 'Information We Collect',
    Mobilecategory: 'Personal Information',
    title: 'We may collect the following types of information:',
    children: [
      {
        subHeading: 'Personal Information',
        points: [
          'Name',
          'Email address',
          'Mailing address (for book swaps)',
          'Phone number (optional)',
          'Username and password (for account creation)',
          'Payment information (if applicable, for premium services)',
        ],
      },
      {
        subHeading: 'Non-Personal Information',
        points: [
          'IP address',
          'Browser type and version',
          'Operating system',
          'Pages visited on the Website',
          'Time and date of visits',
          'Time and date of visits',
        ],
      },
      {
        subHeading: 'User-Generated Content',
        points: [
          'Book listings (title, author, condition, etc.)',
          'Reviews and ratings',
          'Messages exchanged with other users',
        ],
      },
    ],
  },
  {
    id: 2,
    category: 'How We Use Your Information',
    Mobilecategory: 'Your Information',
    title: 'We use the information we collect for the following purposes:',
    children: [
      {
        points: [
          'To facilitate book swaps between users.',
          'To create and manage your account.',
          'To communicate with you about your account, transactions, and updates to our services.',
          'To improve the functionality and user experience of the Website.',
          'To process payments (if applicable).',
          'To send promotional emails or newsletters (only with your consent).',
          'To comply with legal obligations and resolve disputes.',
        ],
      },
    ],
  },
  {
    id: 3,
    category: 'How We Share Your Information',
    Mobilecategory: 'How We Share Your Information',
    title:
      'We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:',
    children: [
      {
        points: [
          'With Other Users: Your name, mailing address, and contact information may be shared with other users to facilitate book swaps.',
          'With Service Providers: We may share information with third-party service providers who assist us in operating the Website (e.g., payment processors, hosting providers).',
          'For Legal Reasons: We may disclose your information if required by law or to protect our rights, property, or safety.',
          'With Your Consent: We may share your information with third parties if you give us explicit permission to do so.',
        ],
      },
    ],
  },
  {
    id: 4,
    category: 'Data Security',
    Mobilecategory: 'Data Security',
    title:
      'We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. These measures include',
    paragraph:
      'However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.',
    children: [
      {
        points: [
          'Using encryption for sensitive data (e.g., payment information).',
          'Regularly updating our security practices.',
          'Limiting access to personal information to authorized personnel only.',
        ],
      },
    ],
  },
  {
    id: 5,
    category: 'Cookies and Tracking Technologies',
    Mobilecategory: 'Cookies and Tracking Technologies',
    title:
      'We use cookies and similar tracking technologies to enhance your experience on our Website. ',
    paragraph:
      'Cookies are small files stored on your device that help us remember your preferences and track usage patterns.You can disable cookies through your browser settings, but this may affect the functionality of the Website.',
  },
  {
    id: 6,
    category: 'Third-Party Links',
    Mobilecategory: 'Third-Party Links',
    title:
      'Our Website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to review the privacy policies of any third-party sites you visit.',
  },
  {
    id: 7,
    category: 'Children’s Privacy',
    Mobilecategory: 'Children’s Privacy',
    title:
      'Our Website is not intended for use by individuals under the age of 7. We do not knowingly collect personal information from children under 7. If we become aware that we have collected such information, we will take steps to delete it.',
  },
  {
    id: 8,
    category: 'Your Rights and Choices',
    Mobilecategory: 'Your Rights and Choices',

    title: 'You have the following rights regarding your personal information:',
    paragraph:
      'To exercise these rights, please contact us at <strong>info@kirjaswappi.fi.</strong>',
    children: [
      {
        points: [
          '<strong>Access:</strong> You can request a copy of the personal information we hold about you.',
          '<strong>Correction:</strong>  You can update or correct your personal information through your account settings or by contacting us.',
          '<strong>Deletion:</strong>  You can request that we delete your personal information, subject to certain legal obligations.',
          '<strong>Opt-Out:</strong> You can opt out of receiving promotional emails by following the unsubscribe link in the email.',
        ],
      },
    ],
  },
  {
    id: 9,
    category: 'International Users',
    Mobilecategory: 'International Users',
    title:
      'If you are accessing the Website from outside Finland, please note that your information may be transferred to, stored, and processed in Finland, where our servers are located. By using the Website, you consent to this transfer and processing.',
  },
  {
    id: 10,
    category: 'Changes to This Privacy Policy',
    Mobilecategory: 'Changes to This Privacy Policy',
    title:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.',
  },
  {
    id: 11,
    category: 'Contact Us',
    Mobilecategory: 'Contact Us',
    title:
      'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:',
    paragraph:
      '<strong>www.Kirjaswappi.fi</strong> <br /> <span>Email: info@kirjaswappi.fi</span> <br /> <span>Mailing Address: Emännäntie 10K 25</span> <br />  <span>Phone: +358408536161</span>',
  },
];
