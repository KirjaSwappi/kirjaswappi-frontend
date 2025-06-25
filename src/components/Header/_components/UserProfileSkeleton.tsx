export default function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-platinum animate-pulse"></div>
      <div className="hidden md:hidden">
        <div className="w-32 h-4 rounded-full bg-platinum animate-pulse"></div>
        <div className="w-20 h-3 rounded-full bg-platinum animate-pulse m-1"></div>
      </div>
    </div>
  );
}
