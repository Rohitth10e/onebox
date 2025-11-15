// EmailList.js
import EmailItem from "./EmailItem";
import React, { useMemo } from "react";

/**
 * activeFilter is a token: "All" | "Interested" | "Booked" | "OOO" | "Spam"
 * The actual labels stored on emails are like "Interested", "Meeting Booked", "Out of Office", "Spam"
 *
 * This component maps tokens to the actual email.label values,
 * and also lets a filter match directly if activeFilter equals the email.label.
 */
export default function EmailList({ emails = [], onSelect, activeFilter = "All", searchQuery = "" }) {
  const q = (searchQuery || "").trim().toLowerCase();

  const mapFilterToLabel = {
    Booked: "Meeting Booked",
    OOO: "Out of Office",
    Interested: "Interested",
    Spam: "Spam",
  };

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // LABEL FILTERS
      if (activeFilter && activeFilter !== "All") {
        const mappedLabel = mapFilterToLabel[activeFilter];

        // allow either token-match or direct label-match
        const matches =
          (mappedLabel && email.label === mappedLabel) || // when token maps to actual stored label
          email.label === activeFilter ||                 // or if activeFilter already equals label
          // also allow matching by token for cases where email.label might be token (defensive)
          (mappedLabel === undefined && email.label === activeFilter);

        if (!matches) return false;
      }

      // SEARCH REFINEMENT (frontend)
      if (q) {
        const subject = (email.subject || "").toLowerCase();
        const from = ((email.from || email.sender) || "").toLowerCase();
        const body = (email.text || email.body || email.html || "").toLowerCase();

        if (subject.includes(q) || from.includes(q) || body.includes(q)) {
          return true;
        }
        return false;
      }

      return true;
    });
  }, [emails, activeFilter, q]);

  if (!filteredEmails.length) {
    return <div className="p-6 text-center text-gray-500">No emails found</div>;
  }

  return (
    <div>
      {filteredEmails.map((email) => (
        <EmailItem key={email.id} email={email} onSelect={onSelect} />
      ))}
    </div>
  );
}
