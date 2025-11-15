// SuggestReplyModal.js
import React, { useState } from "react";

export default function SuggestReplyModal({ emailId, onClose }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    // Placeholder: implement API call to create a suggested reply
    console.log("Send suggestion for", emailId, text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-11/12 max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Suggest Reply</h3>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded p-3 mb-4"
          placeholder="Type suggestion..."
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button onClick={handleSend} className="px-4 py-2 rounded bg-blue-600 text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
