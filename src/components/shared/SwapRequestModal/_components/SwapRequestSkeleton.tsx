export default function SwapRequestSkeleton() {
  return (
    <div className="bg-black bg-opacity-50 inset-0 w-full h-screen fixed top-0 left-0 z-[999999999] flex items-center justify-center">
      <div className="w-11/12 max-h-[80vh] bg-white rounded-md overflow-y-auto animate-pulse">
        {/* Header */}
        <div className="py-4 border-b border-platinum relative">
          <div className="h-5 w-28 bg-platinum rounded mx-auto" />
          <div className="w-8 h-8 bg-platinum rounded-full absolute right-4 top-2" />
        </div>

        <div className="px-[14px] pb-2 mt-4">
          {/* Book info skeleton */}
          <div className="h-28 w-full bg-platinum rounded-md mb-5" />

          {/* Condition item */}
          <div className="flex items-center gap-2 mt-5">
            <div className="w-4 h-4 bg-platinum rounded" />
            <div className="h-4 w-32 bg-platinum rounded" />
          </div>

          {/* Swap options skeleton */}
          <div className="mt-6 space-y-4">
            <div className="h-16 w-full bg-platinum rounded-md" />
            <div className="h-16 w-full bg-platinum rounded-md" />
            <div className="h-16 w-full bg-platinum rounded-md" />
          </div>

          {/* Short Note */}
          <div className="mt-6">
            <div className="h-4 w-20 bg-platinum rounded mb-2" />
            <div className="h-20 w-full bg-platinum rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
