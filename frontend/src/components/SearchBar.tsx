import { useState } from "react";
import React from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  

  const submit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form
      onSubmit={submit}
      className="p-3 border-b bg-white sticky top-0 z-10 shadow-sm"
    >
      <input
        className="w-full p-2 rounded border focus:ring-2 focus:ring-blue-300 focus:outline-none"
        placeholder="Search emails..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
