// Inbox.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE } from "../config";

import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import EmailView from "../components/EmailView";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import React from "react";

export default function Inbox({ initialActiveFilter = "All", initialFolder = "INBOX" }) {
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeFolder, setActiveFolder] = useState(initialFolder);
  const [activeFilter, setActiveFilter] = useState(initialActiveFilter);
  const [searchQuery, setSearchQuery] = useState("");

  // store AbortController for cancellation of axios requests
  const abortCtrlRef = useRef(null);

  // -----------------------------
  // Fetcher (cancels previous request)
  // -----------------------------
  async function loadEmails(params = {}) {
    try {
      // cancel previous
      if (abortCtrlRef.current) {
        try { abortCtrlRef.current.abort(); } catch (e) {}
      }
      const controller = new AbortController();
      abortCtrlRef.current = controller;

      setLoading(true);

      const merged = {
        folder: activeFolder,
        ...params,
      };

      // Remove empty params (only remove undefined/null/empty string)
      Object.keys(merged).forEach((key) => {
        const v = merged[key];
        if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
          delete merged[key];
        }
      });

      const query = new URLSearchParams(merged).toString();
      const url = `${API_BASE}/search${query ? `?${query}` : ""}`;

      // axios supports signal option in modern versions
      const res = await axios.get(url, { signal: controller.signal });

      // ensure response shape
      setEmails(res.data?.results || []);
    } catch (err) {
      // If aborted, ignore
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        // request was cancelled — do nothing
      } else {
        console.error("Email fetch failed:", err);
        setEmails([]);
      }
    } finally {
      // only set loading false if current controller has not been replaced
      // (if aborted and replaced, controller will be different; but in any case we can safely set loading false here)
      setLoading(false);
    }
  }

  // -----------------------------
  // Folder changes → reload inbox
  // -----------------------------
  useEffect(() => {
    loadEmails({ q: searchQuery });
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFolder]); // intentionally only depend on activeFolder

  // -----------------------------
  // Search handler (from SearchBar debounce)
  // -----------------------------
  const handleSearch = (value) => {
    setSearchQuery(value);
    // call backend with q; loadEmails will cancel any previous request
    loadEmails({ q: value });
    setSelected(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeFolder={activeFolder}
        setActiveFolder={setActiveFolder}
      />

      <div className="w-1/3 border-r bg-white flex flex-col">
        <SearchBar onSearch={handleSearch} placeholder="Search emails..." />

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <>
              <Loader />
              <Loader />
              <Loader />
            </>
          ) : (
            <EmailList
              emails={emails}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      <div className="flex-1 bg-white">
        {selected ? (
          <EmailView email={selected} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select an email
          </div>
        )}
      </div>
    </div>
  );
}
