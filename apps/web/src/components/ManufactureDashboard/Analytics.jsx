"use client";
import { PackageCheck, Clock, AlertTriangle } from "lucide-react";

export default function Analytics() {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-green-700">
        Analytics & Performance
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Batches Certified (MTD)
              </p>
              <p className="text-3xl font-bold text-gray-900">125</p>
            </div>
            <PackageCheck className="text-green-500 w-8 h-8" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Processing Time (Avg)
              </p>
              <p className="text-3xl font-bold text-gray-900">
                4.2 <span className="text-base font-normal">Hrs</span>
              </p>
            </div>
            <Clock className="text-yellow-500 w-8 h-8" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Rejection Rate
              </p>
              <p className="text-3xl font-bold text-gray-900">
                1.8<span className="text-base font-normal">%</span>
              </p>
            </div>
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl">
        <h4 className="text-xl font-semibold mb-4 text-gray-700">
          Monthly Throughput Chart
        </h4>
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
          [Placeholder for Chart Visualization]
        </div>
      </div>
    </div>
  );
}
