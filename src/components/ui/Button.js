"use client";

import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
