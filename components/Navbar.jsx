import { useState } from "react";
import Link from "next/link";

export default function Navbar({ onSearchChange, onTypeFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  const pokemonTypes = [
    "normal", "fire", "water", "electric", "grass", "ice", 
    "fighting", "poison", "ground", "flying", "psychic", 
    "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    onTypeFilterChange(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    onSearchChange("");
    onTypeFilterChange("");
  };

  return (
    <nav style={{
      padding: "1rem",
      backgroundColor: "#e53935", // Pokemon red
      color: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      marginBottom: "20px",
      borderRadius: "0 0 8px 8px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <Link href="/" style={{
            fontWeight: "bold",
            fontSize: "28px",
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px" }}>
              <circle cx="12" cy="12" r="10" fill="white" stroke="black" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="black" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="black" strokeWidth="2" />
            </svg>
            Pokédex
          </Link>
          
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            {(searchTerm || selectedType) && (
              <button 
                onClick={handleClearFilters}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "14px"
                }}
              >
                <span>✕</span> Clear Filters
              </button>
            )}
          </div>
        </div>
        
        <div style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <div style={{ 
            flex: "1", 
            minWidth: "200px",
            position: "relative"
          }}>
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "10px 12px 10px 40px",
                borderRadius: "4px",
                border: "none",
                width: "100%",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            />
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#999" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <div style={{ 
            flex: "1", 
            minWidth: "200px",
            position: "relative"  
          }}>
            <select 
              value={selectedType}
              onChange={handleTypeChange}
              style={{
                padding: "10px 12px 10px 40px",
                borderRadius: "4px",
                border: "none",
                width: "100%",
                fontSize: "16px",
                appearance: "none",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <option value="">All Types</option>
              {pokemonTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#999" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#999" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}