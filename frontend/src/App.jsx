import React, { useState } from "react";
import Inbox from "./pages/Inbox";

export default function App() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <Inbox 
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    />
  );
}
