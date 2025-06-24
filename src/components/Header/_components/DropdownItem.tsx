import { cn } from '../../../utility/cn';

function DropdownItem({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `flex items-center gap-[10px] px-6 py-3 cursor-pointer transition-all `,
        className,
      )}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-normal font-poppins">{label}</span>
    </div>
  );
}
export default DropdownItem;
