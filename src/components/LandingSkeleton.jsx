import React from "react";

function SkeletonBox({ className }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded-md ${className}`}
    ></div>
  );
}

export default function LandingSkeleton() {
  return (
    <div className="space-y-12 p-6">
      {/* Hero Section Skeleton */}
      <section className="bg-[#ECF39E]/30 p-10 rounded-xl">
        <SkeletonBox className="h-6 w-48 mb-4" />
        <SkeletonBox className="h-10 w-80 mb-3" />
        <SkeletonBox className="h-4 w-64 mb-2" />
        <SkeletonBox className="h-4 w-56 mb-6" />

        {/* Input + Buttons */}
        <div className="flex gap-3">
          <SkeletonBox className="h-11 w-64" />
          <SkeletonBox className="h-11 w-28" />
          <SkeletonBox className="h-11 w-28" />
        </div>
      </section>

      {/* Highlights grid skeleton */}
      <section className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border p-4 rounded-lg">
            <SkeletonBox className="h-9 w-9" />
            <div className="flex-1">
              <SkeletonBox className="h-4 w-32 mb-2" />
              <SkeletonBox className="h-3 w-48" />
            </div>
          </div>
        ))}
      </section>

      {/* How it works skeleton */}
      <section>
        <SkeletonBox className="h-8 w-60 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 border p-5 rounded-lg">
              <SkeletonBox className="h-8 w-8" />
              <div className="flex-1">
                <SkeletonBox className="h-4 w-32 mb-2" />
                <SkeletonBox className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pilot section skeleton */}
      <section className="rounded-2xl border p-8">
        <SkeletonBox className="h-6 w-80 mb-4" />
        <SkeletonBox className="h-4 w-96 mb-6" />
        <div className="flex gap-4">
          <SkeletonBox className="h-10 w-40" />
          <SkeletonBox className="h-10 w-32" />
        </div>
      </section>
    </div>
  );
}
