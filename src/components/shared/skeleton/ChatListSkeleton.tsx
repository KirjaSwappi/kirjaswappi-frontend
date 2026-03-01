export default function ChatListSkeleton() {
  return (
    <div className="group border-b border-platinumMix">
      <div className="w-full py-3 px-3 flex items-center gap-4">
        {/* Avatar skeleton */}
        <div className="w-14 min-w-14 h-14 max-h-14 rounded-full bg-platinum animate-pulse"></div>

        {/* Content skeleton */}
        <div className="w-10/12 flex flex-col gap-2">
          {/* Top row: name and time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="h-4 w-24 rounded-md bg-platinum animate-pulse"></div>
              <div className="h-3 w-16 rounded-md bg-platinum animate-pulse"></div>
            </div>
            <div className="h-3 w-7 rounded-md bg-platinum animate-pulse"></div>
          </div>

          {/* Bottom row: message preview */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 rounded-md bg-platinum animate-pulse"></div>
            <div className="h-6 w-6 rounded-full bg-platinum animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
