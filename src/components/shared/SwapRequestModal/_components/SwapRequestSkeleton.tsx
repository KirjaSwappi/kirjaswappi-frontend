export default function SwapRequestSkeleton() {
  return (
    <div className="bg-black bg-opacity-80 inset-0 w-full h-screen fixed top-0 left-0 z-[999999999] flex items-center justify-center">
      <div className="w-11/12 lg:w-8/12 xl:w-1/2 max-h-[80vh] bg-white rounded-md animate-pulse overflow-hidden">
        {/* Header */}
        <div className="py-4 border-b border-platinum relative">
          <div className="h-5 w-32 bg-platinum rounded mx-auto lg:mx-0 lg:ml-4" />
          <div className="w-8 h-8 bg-platinum rounded-full absolute right-4 top-2" />
        </div>

        {/* Content */}
        <div className="px-[14px] lg:p-6 pb-2 mt-4 flex flex-col lg:flex-row lg:gap-6">
          {/* Left side (Book cover + info) */}
          <div className="flex gap-4">
            <div className="w-[108px] lg:w-[200px] h-[142px] lg:h-[263px] bg-platinum rounded-lg" />
            <div className="flex flex-col justify-between lg:hidden space-y-3">
              <div className="h-4 w-40 bg-platinum rounded" />
              <div className="h-4 w-28 bg-platinum rounded" />
              <div className="h-4 w-32 bg-platinum rounded" />
            </div>
          </div>

          {/* Right side */}
          <div className="w-full lg:max-w-[65%] xl:w-7/12 mt-4 lg:mt-0 space-y-5">
            {/* Book info (desktop only) */}
            <div className="hidden lg:flex flex-col gap-3">
              <div className="h-4 w-48 bg-platinum rounded" />
              <div className="h-4 w-32 bg-platinum rounded" />
              <div className="h-4 w-40 bg-platinum rounded" />
            </div>

            {/* Condition item */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-platinum rounded" />
              <div className="h-4 w-32 bg-platinum rounded" />
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              <div className="h-4 w-20 bg-platinum rounded" />
              <div className="h-4 w-16 bg-platinum rounded" />
              <div className="h-4 w-14 bg-platinum rounded" />
            </div>

            {/* Swap options */}
            <div className="space-y-4">
              <div className="h-16 w-full bg-platinum rounded-md" />
              <div className="h-16 w-full bg-platinum rounded-md" />
              <div className="h-16 w-full bg-platinum rounded-md" />
            </div>

            {/* Short Note */}
            <div>
              <div className="h-4 w-20 bg-platinum rounded mb-2" />
              <div className="h-20 w-full bg-platinum rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
