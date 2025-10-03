"use client";

import { useState } from "react";
import clsx from "clsx";

export default function Dialog({ 
  trigger,        // Button or element that opens the dialog
  title, 
  children, 
  size = "lg" 
}) {
  const [open, setOpen] = useState(false);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </div>

      {/* Overlay + Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          ></div>

          {/* Modal Box */}
          <div
            className={clsx(
              "relative bg-white rounded-xl shadow-lg w-full h-[90vh] flex flex-col",
              sizes[size]
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
