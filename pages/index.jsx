import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import PokemonCard from "/components/PokemonCard";
import Navbar from "/components/Navbar";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [limit, setLimit] = useState(50);         // Number per fetch
  const [offset, setOffset] = useState(0);        // Pagination offset
  const [loading, setLoading] = useState(false);  // To prevent multiple fetches
  const [hasMore, setHasMore] = useState(true);   // Flag to know if there's more data to load
  const [errorMessage, setErrorMessage] = useState("");
  const [totalCount, setTotalCount] = useState(0); // Total count for pagination
  const loaderRef = useRef();
  const observerRef = useRef(null);
  const router = useRouter();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  // Function to determine if we should attempt to fetch more
  const shouldFetchMore = useCallback(() => {
    // Don't fetch more if we're already at the end
    if (!hasMore) return false;
    
    // Don't fetch more if we're already loading
    if (loading) return false;
    
    // Don't fetch more if we're filtering (we have all data already)
    if (searchTerm || selectedType) return false;
    
    // Don't fetch if we've reached the total count (if known)
    if (totalCount > 0 && allPokemons.length >= totalCount) {
      setHasMore(false);
      return false;
    }
    
    return true;
  }, [hasMore, loading, searchTerm, selectedType, totalCount, allPokemons.length]);
  
  // Fetch pokemons from the API
  const fetchPokemons = useCallback(async () => {
    if (!shouldFetchMore()) return;
    
    setLoading(true);
    setErrorMessage("");
    
    try {
      // Add a random parameter to avoid cache issues
      const timestamp = new Date().getTime();
      const res = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limit}&offset=${offset}&_t=${timestamp}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Process the data based on the API structure
      const pokemonList = Array.isArray(data) ? data : 
                        (data.results || data.pokemons || data.data || []);
      
      // Try to get total count from API response if available
      if (data.count && typeof data.count === 'number') {
        setTotalCount(data.count);
      }
      
      // Update the pokemons state with pagination
      if (pokemonList.length === 0) {
        setHasMore(false);
      } else {
        // Check for duplicates by ID or name
        const newPokemonList = pokemonList.filter(newPokemon => {
          return !allPokemons.some(existingPokemon => 
            (existingPokemon.id && newPokemon.id && existingPokemon.id === newPokemon.id) || 
            (existingPokemon.name && newPokemon.name && existingPokemon.name === newPokemon.name)
          );
        });
        
        // Only update state if we actually have new pokemon
        if (newPokemonList.length > 0) {
          setAllPokemons(prev => [...prev, ...newPokemonList]);
        }
        
        // If we got fewer items than requested or reached the total, we're at the end
        if (pokemonList.length < limit || (totalCount > 0 && allPokemons.length + pokemonList.length >= totalCount)) {
          setHasMore(false);
        } else {
          setOffset(prev => prev + limit);
        }
      }
    } catch (error) {
      console.error("Error fetching pokemons:", error);
      setErrorMessage(`Failed to load Pokémon: ${error.message}`);
      // Wait a bit longer before allowing retries on error
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      setLoading(false);
    }
  }, [limit, offset, allPokemons, totalCount, shouldFetchMore]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (allPokemons.length === 0) {
      fetchPokemons();
    }
  }, []);

  // Clean up observer when component unmounts
  useEffect(() => {
    return () => {
      if (observerRef.current && loaderRef.current) {
        observerRef.current.unobserve(loaderRef.current);
      }
    };
  }, []);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current && loaderRef.current) {
      observerRef.current.unobserve(loaderRef.current);
      observerRef.current = null;
    }
    
    if (!loaderRef.current || !shouldFetchMore()) return;
    
    // Create a new observer with a debounce mechanism
    observerRef.current = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && shouldFetchMore()) {
          // Debounce the fetch call
          const timer = setTimeout(() => {
            fetchPokemons();
          }, 300);
          
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    
    observerRef.current.observe(loaderRef.current);
  }, [fetchPokemons, shouldFetchMore]);

  // Apply filters to all fetched pokemons
  useEffect(() => {
    let filteredResults = [...allPokemons];
    
    // Apply search filter
    if (searchTerm) {
      filteredResults = filteredResults.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType) {
      filteredResults = filteredResults.filter(pokemon => {
        // Check if types exist and contains the selected type
        const types = pokemon.types || [];
        return types.some(type => {
          // Handle different API formats
          if (typeof type === 'string') {
            return type.toLowerCase() === selectedType.toLowerCase();
          } else if (type.type && type.type.name) {
            return type.type.name.toLowerCase() === selectedType.toLowerCase();
          } else if (type.name) {
            return type.name.toLowerCase() === selectedType.toLowerCase();
          }
          return false;
        });
      });
    }
    
    setPokemons(filteredResults);
  }, [allPokemons, searchTerm, selectedType]);

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setAllPokemons([]);
    setPokemons([]);
    setOffset(0);
    setHasMore(true);
    setErrorMessage("");
    
    // Reset and fetch with new limit
    setTimeout(() => {
      fetchPokemons();
    }, 100);
  };

  // Handle search filter
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Handle type filter
  const handleTypeFilterChange = (type) => {
    setSelectedType(type);
  };

  // Handle pokemon click to navigate to details page
  const handlePokemonClick = (pokemon) => {
    router.push(`/pokemon/${pokemon.id || pokemon.name}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Navbar 
        onSearchChange={handleSearchChange} 
        onTypeFilterChange={handleTypeFilterChange} 
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <h1>Pokémon Gallery</h1>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {searchTerm && <div style={{ color: "#666" }}>Search: "{searchTerm}"</div>}
          {selectedType && <div style={{ color: "#666" }}>Type: {selectedType}</div>}
          
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Pokémons per batch:
            <select 
              value={limit} 
              onChange={handleLimitChange} 
              style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ddd" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>
      
      {errorMessage && (
        <div style={{ 
          margin: "15px 0", 
          padding: "10px 15px", 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          borderRadius: "4px",
          border: "1px solid #ffcdd2"
        }}>
          {errorMessage}
          <button 
            onClick={() => {
              setErrorMessage("");
              fetchPokemons();
            }}
            style={{
              marginLeft: "10px",
              padding: "3px 8px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats display */}
      <div style={{ margin: "10px 0", fontSize: "0.9rem", color: "#666" }}>
        {allPokemons.length > 0 && (
          <>
            Showing {pokemons.length} Pokémon
            {(searchTerm || selectedType) && ` (filtered from ${allPokemons.length})`}
            {totalCount > 0 && ` out of ${totalCount} total`}
          </>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon, index) => (
            <div key={`pokemon-${index}-${pokemon.id || pokemon.name}`} onClick={() => handlePokemonClick(pokemon)}>
              <PokemonCard pokemon={pokemon} />
            </div>
          ))
        ) : (
          loading && allPokemons.length === 0 ? (
            <p>Loading Pokémon data...</p>
          ) : (
            <p>No Pokémon found matching your filters.</p>
          )
        )}
      </div>

      <div ref={loaderRef} style={{ 
        height: "100px", 
        marginTop: "20px", 
        textAlign: "center",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {loading && <div>
          <div style={{ 
            display: "inline-block",
            width: "30px",
            height: "30px",
            border: "3px solid rgba(0,0,0,0.1)",
            borderRadius: "50%",
            borderTop: "3px solid #3498db",
            animation: "spin 1s linear infinite",
            marginRight: "10px"
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          Loading more Pokémon...
        </div>}
        
        {!hasMore && allPokemons.length > 0 && (
          <p style={{ color: "#666" }}>
            You've reached the end of the list 
            {(searchTerm || selectedType) ? " or try changing your filters" : ""}
          </p>
        )}
      </div>
    </div>
  );
}