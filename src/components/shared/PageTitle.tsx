import { Helmet } from 'react-helmet';

export default function PageTitle({ title }: { title: string }) {
  return (
    <Helmet>
      <title>{title ? `${title} | KirjaSwappi` : 'KirjaSwappi'}</title>
    </Helmet>
  );
}
