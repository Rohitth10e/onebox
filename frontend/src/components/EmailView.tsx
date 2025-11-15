// EmailView.js
import SuggestReplyModal from "./SuggestReplyModal";
import { useState } from "react";
import React from "react";

export default function EmailView({ email }) {
  const [showModal, setShowModal] = useState(false);

  if (!email) return null;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold">{email.subject || "(No subject)"}</h2>
      <p className="text-gray-600 mb-4">{email.from || email.sender}</p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          💬 Suggest Reply
        </button>
      </div>

      <div className="prose mt-6">
        {/* Prefer html if provided */}
        {email.html ? (
          <div dangerouslySetInnerHTML={{ __html: email.html }} />
        ) : (
          <pre className="whitespace-pre-wrap">{email.text || email.body || ""}</pre>
        )}
      </div>

      {showModal && <SuggestReplyModal emailId={email.id} onClose={() => setShowModal(false)} />}
    </div>
  );
}
