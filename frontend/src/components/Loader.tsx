// Loader.js
import React from "react";

export default function Loader() {
  return (
    <div className="p-4 border-b">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
    </div>
  );
}
