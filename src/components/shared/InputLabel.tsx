import { cn } from '../../utility/cn';

export default function InputLabel({
  label,
  required,
  className,
}: {
  label: string | undefined;
  required?: boolean;
  className?: string;
}) {
  return (
    <div>
      {label && (
        <p className={cn(`text-arsenic text-sm mb-4 font-normal font-poppins`, className)}>
          {label}
          {required && <span className="text-red-600">*</span>}
        </p>
      )}
    </div>
  );
}
