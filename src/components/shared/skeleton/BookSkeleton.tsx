export default function BookSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-[156px] lg:h-[214px] rounded-md bg-platinum animate-pulse"></div>
      <div className="w-full h-[10px] rounded-md bg-platinum animate-pulse"></div>
      <div className="w-full h-[10px] rounded-md bg-platinum animate-pulse"></div>
      <div className="w-1/2 h-[10px] rounded-md bg-platinum animate-pulse"></div>
      <div className="w-1/4 h-[10px] rounded-md bg-platinum animate-pulse"></div>
    </div>
  );
}
