import { useState, useEffect, useRef, useCallback } from "react";
import PokemonCard from "/components/PokemonCard";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [limit, setLimit] = useState(50);        // Number per fetch
  const [page, setPage] = useState(0);           // Pagination index
  const [loading, setLoading] = useState(false); // To prevent multiple fetches
  const loaderRef = useRef();

  // Add debugging state to check API response structure
  const [apiResponse, setApiResponse] = useState(null);

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limit}&offset=${page * limit}`);
      const data = await res.json();
      
      // Save the API response for debugging
      if (page === 0) {
        setApiResponse(data);
        console.log("API Response:", data);
      }

      const pokemonList = Array.isArray(data) ? data : 
                        (data.results || data.pokemons || data.data || []);
      
      setPokemons((prev) => [...prev, ...pokemonList]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => {
    fetchPokemons(); // Initial load
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        fetchPokemons();
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => loaderRef.current && observer.unobserve(loaderRef.current);
  }, [fetchPokemons, loading]);

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setPokemons([]);
    setPage(0);
    // Fetch fresh batch immediately after resetting
    setTimeout(() => {
      fetchPokemons();
    }, 100); // slight delay to allow state updates
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pokémon Gallery</h1>

      <label>
        Pokémons batch filter:
        <select value={limit} onChange={handleLimitChange} style={{ marginLeft: '10px' }}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon, index) => (
            <PokemonCard key={`pokemon-${index}-${pokemon.id || pokemon.name}`} pokemon={pokemon} />
          ))
        ) : (
          <p>Loading Pokémon data...</p>
        )}
      </div>

      <div ref={loaderRef} style={{ height: "50px", marginTop: "20px" }}>
        {loading && <p>Loading more Pokémon...</p>}
      </div>
    </div>
  );
}