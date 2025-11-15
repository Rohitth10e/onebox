// Sidebar.js
import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function Sidebar({
  activeFilter,
  setActiveFilter,
  activeFolder,
  setActiveFolder,
}: any) {
  const [folders, setFolders] = useState(["INBOX"]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch(`${API_BASE}/folders`);
        const data = await res.json();
        setFolders(data.folders || ["INBOX"]);
      } catch (err) {
        console.error("Failed to fetch folders:", err);
        setFolders(["INBOX"]);
      }
    };

    fetchFolders();
  }, []);

  // Use small token values for filter state (these are easy to compare in EmailList).
  // The 'label' is what is shown on UI, 'value' is the token stored in activeFilter.
  const filters = [
    { label: "All", value: "All" },
    { label: "Interested", value: "Interested" },
    { label: "Booked", value: "Booked" },        // token: Booked
    { label: "OOO", value: "OOO" },              // token: OOO
    { label: "Spam", value: "Spam" },
  ];

  return (
    <div className="w-64 bg-white border-r h-full p-5 space-y-6 shadow-sm">
      <div>
        <h2 className="font-bold text-gray-700 mb-3">Folders</h2>
        <div className="space-y-1">
          {folders.map((folder) => (
            <div
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`p-2 rounded cursor-pointer text-sm ${
                activeFolder === folder
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {folder}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-700 mb-3">Filters</h2>
        <div className="space-y-1">
          {filters.map((f) => (
            <div
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`p-2 rounded cursor-pointer text-sm ${
                activeFilter === f.value
                  ? "bg-green-100 text-green-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
