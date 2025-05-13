import { useState } from "react";
import Link from "next/link";

export default function Navbar({ onSearchChange, onTypeFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
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
    onTypeFilterChange(e.target.value);
  };

  return (
    <nav style={{
      padding: "1rem",
      backgroundColor: "#f5f5f5",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      borderRadius: "8px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px"
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
            fontSize: "24px",
            color: "#e53935",
            textDecoration: "none"
          }}>
            Pokédex
          </Link>
          
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}>
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                minWidth: "200px"
              }}
            />
            
            <select 
              onChange={handleTypeChange}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ddd"
              }}
            >
              <option value="">All Types</option>
              {pokemonTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}