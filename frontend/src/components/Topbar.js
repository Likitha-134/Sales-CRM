import "../styles/topbar.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Topbar = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");

  const isSettings = location.pathname === "/settings";

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    window.dispatchEvent(
      new CustomEvent("globalSearch", { detail: value })
    );
  };

  return (
    <div className="topbar">
      {!isSettings && (
        <div className="search-wrapper">
  <FaSearch className="search-icon" />
  <input
    type="text"
    placeholder="Search here..."
    className="search"
     value={query}                
  onChange={handleSearch}  
  />
</div>
      )}
    </div>
  );
};

export default Topbar;