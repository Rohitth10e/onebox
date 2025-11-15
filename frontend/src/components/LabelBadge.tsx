// LabelBadge.js
import React from "react";

export default function LabelBadge({ label }) {
  if (!label) return null;

  const styles = {
    Interested: "bg-green-100 text-green-700",
    "Meeting Booked": "bg-blue-100 text-blue-700",
    Spam: "bg-red-100 text-red-700",
    "Out of Office": "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[label] || "bg-gray-200 text-gray-700"}`}>
      {label}
    </span>
  );
}
