// EmailItem.js
import LabelBadge from "./LabelBadge";
import React from "react";

export default function EmailItem({ email, onSelect }) {
  // Try to show a nice preview
  const preview = email.text?.replace(/\s+/g, " ").trim() || email.body || "";

  return (
    <div
      className="p-4 border-b hover:bg-gray-50 cursor-pointer transition"
      onClick={() => onSelect && onSelect(email)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect && onSelect(email);
      }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800">{email.subject || "(No subject)"}</h3>
        <span className="text-xs text-gray-500">
          {email.date ? new Date(email.date).toLocaleString() : ""}
        </span>
      </div>

      <p className="text-gray-600 text-sm">{email.from || email.sender || "Unknown sender"}</p>

      <div className="mt-1">
        <LabelBadge label={email.label} />
      </div>

      <p className="mt-2 text-xs text-gray-500 truncate">{preview.slice(0, 120)}</p>
    </div>
  );
}
