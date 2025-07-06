import { Link, useLocation } from 'react-router-dom';
const formatPathName = (name: string) => {
  if (/^[a-f\d]{24}$/i.test(name)) return null;
  return name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};
const Breadcrumb = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <div className="font-poppins text-xs font-normal z-50" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:underline text-[#999999]">
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const label = formatPathName(name);
          if (!label) return null;

          const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
          const isLast = index === pathnames.length - 1;

          return (
            <li key={routeTo} className="flex items-center space-x-2">
              <span>{'>'}</span>
              {isLast ? (
                <span className="text-[#999999]">{label}</span>
              ) : (
                <Link to={location} className="hover:underline text-primary">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Breadcrumb;
