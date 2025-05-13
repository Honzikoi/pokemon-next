import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function PokemonDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  useEffect(() => {
    // Only fetch when we have the ID parameter
    if (!id) return;

    const fetchPokemonDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch Pokémon (status: ${res.status})`);
        }
        
        const data = await res.json();
        setPokemon(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching pokemon details:", err);
        setError(err.message);
        
        // Auto-retry a few times with increasing delay if needed
        if (fetchAttempts < 3) {
          const retryDelay = (fetchAttempts + 1) * 2000; // 2s, 4s, 6s
          setTimeout(() => {
            setFetchAttempts(prev => prev + 1);
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id, fetchAttempts]);

  // Define type color mapping
  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC"
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
      <div style={{ 
        display: "inline-block",
        width: "40px",
        height: "40px",
        border: "4px solid rgba(0,0,0,0.1)",
        borderRadius: "50%",
        borderTop: "4px solid #e53935",
        animation: "spin 1s linear infinite",
      }}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (loading) return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
      <Head>
        <title>Loading Pokémon | Pokédex</title>
      </Head>
      <Link href="/" style={{ 
        display: "inline-block", 
        marginBottom: "20px", 
        padding: "8px 16px", 
        backgroundColor: "#f5f5f5", 
        color: "#333", 
        borderRadius: "4px", 
        textDecoration: "none" 
      }}>
        ← Back to Pokédex
      </Link>
      <h1>Loading Pokémon details...</h1>
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
      <Head>
        <title>Error | Pokédex</title>
      </Head>
      <Link href="/" style={{ 
        display: "inline-block", 
        marginBottom: "20px", 
        padding: "8px 16px", 
        backgroundColor: "#f5f5f5", 
        color: "#333", 
        borderRadius: "4px", 
        textDecoration: "none" 
      }}>
        ← Back to Pokédex
      </Link>
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#ffebee", 
        borderRadius: "8px", 
        marginBottom: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ color: "#c62828", marginTop: 0 }}>Error loading Pokémon</h1>
        <p>{error}</p>
        <button 
          onClick={() => {
            setFetchAttempts(prev => prev + 1);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e53935",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!pokemon) return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
      <Head>
        <title>Pokémon Not Found | Pokédex</title>
      </Head>
      <Link href="/" style={{ 
        display: "inline-block", 
        marginBottom: "20px", 
        padding: "8px 16px", 
        backgroundColor: "#f5f5f5", 
        color: "#333", 
        borderRadius: "4px", 
        textDecoration: "none" 
      }}>
        ← Back to Pokédex
      </Link>
      <div style={{ 
        padding: "30px", 
        backgroundColor: "#f5f5f5", 
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <img 
          src="/pokeball-gray.png" 
          alt="Not Found" 
          width="100" 
          height="100"
          style={{ 
            marginBottom: "20px",
            opacity: "0.5"
          }}
        />
        <h1>Pokémon not found</h1>
        <p>The Pokémon you're looking for doesn't exist or hasn't been caught yet!</p>
      </div>
    </div>
  );

  // Handle different API response formats for stats
  const getStats = () => {
    if (!pokemon.stats) return [];
    
    if (Array.isArray(pokemon.stats)) {
      return pokemon.stats;
    }
    
    if (typeof pokemon.stats === 'object' && pokemon.stats !== null) {
      return Object.entries(pokemon.stats).map(([name, value]) => ({
        stat: { name },
        base_stat: value
      }));
    }
    
    return [];
  };

  // Handle different API response formats for abilities
  const getAbilities = () => {
    if (!pokemon.abilities) return [];
    
    if (Array.isArray(pokemon.abilities)) {
      return pokemon.abilities;
    }
    
    return [];
  };

  // Handle different API response formats for types
  const getTypes = () => {
    if (!pokemon.types) return [];
    
    if (Array.isArray(pokemon.types)) {
      return pokemon.types;
    }
    
    return [];
  };

  // Calculate max stat value for the stat bars
  const stats = getStats();
  const maxStatValue = Math.max(...stats.map(s => Number(s.base_stat || 0)), 100);
  
  // Get dominant type for theming
  const types = getTypes();
  const primaryType = types.length > 0 ? 
    (typeof types[0] === 'string' ? types[0] : (types[0].type?.name || types[0].name || "normal")) 
    : "normal";
  const primaryColor = typeColors[primaryType] || "#A8A878";
  
  // Calculate lighter shades for background
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const rgb = hexToRgb(primaryColor);
  const lightBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
  const mediumBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1000px", 
      margin: "0 auto",
      backgroundColor: lightBg,
      minHeight: "100vh"
    }}>
      <Head>
        <title>{pokemon.name ? `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} (#${pokemon.id})` : 'Pokémon Details'} | Pokédex</title>
        <meta name="description" content={`Details about ${pokemon.name}, a Pokémon with types: ${types.map(t => typeof t === 'string' ? t : (t.type?.name || t.name)).join(', ')}`} />
      </Head>
      
      <Link href="/" style={{ 
        display: "inline-block", 
        marginBottom: "20px", 
        padding: "8px 16px", 
        backgroundColor: "white", 
        color: "#333", 
        borderRadius: "4px", 
        textDecoration: "none",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        ← Back to Pokédex
      </Link>

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        backgroundColor: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
      }}>
        {/* Header with name and number */}
        <div style={{ 
          padding: "20px",
          backgroundColor: primaryColor,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ 
            margin: "0",
            textTransform: "capitalize",
            color: "white",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
          }}>
            {pokemon.name}
          </h1>
          <span style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "5px 10px",
            borderRadius: "20px"
          }}>
            #{pokemon.id}
          </span>
        </div>

        {/* Main content */}
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          flexWrap: "wrap",
          padding: "20px"
        }}>
          {/* Left column - Image and types */}
          <div style={{ 
            flex: "1 1 300px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "20px"
          }}>
            <div style={{
              width: "220px",
              height: "220px",
              backgroundColor: lightBg,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: `5px solid ${primaryColor}`
            }}>
              {pokemon.image ? (
                <img 
                  src={pokemon.image} 
                  alt={pokemon.name} 
                  style={{ 
                    width: "180px", 
                    height: "180px", 
                    objectFit: "contain"
                  }} 
                />
              ) : (
                <div style={{
                  width: "180px",
                  height: "180px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#999",
                  fontSize: "16px"
                }}>
                  No Image Available
                </div>
              )}
            </div>

            {/* Types */}
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              justifyContent: "center" 
            }}>
              {getTypes().map((typeInfo, index) => {
                // Handle different API response formats
                const typeName = typeof typeInfo === 'string' 
                  ? typeInfo 
                  : (typeInfo.type?.name || typeInfo.name || "unknown");
                
                return (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: typeColors[typeName] || "#999",
                      color: "#fff",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  >
                    {typeName}
                  </span>
                );
              })}
            </div>

            {/* Physical attributes */}
            <div style={{ 
              marginTop: "30px", 
              width: "100%", 
              display: "flex", 
              justifyContent: "space-around", 
              gap: "10px"
            }}>
              <div style={{ 
                textAlign: "center",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "15px",
                width: "120px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#555" }}>Height</h3>
                <p style={{ fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>
                  {pokemon.height ? `${pokemon.height / 10} m` : "?"}
                </p>
              </div>
              <div style={{ 
                textAlign: "center",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "15px",
                width: "120px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#555" }}>Weight</h3>
                <p style={{ fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>
                  {pokemon.weight ? `${pokemon.weight / 10} kg` : "?"}
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Stats and abilities */}
          <div style={{ flex: "1 1 300px", padding: "20px" }}>
            <h2 style={{ 
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: "5px",
              color: "#333"
            }}>Base Stats</h2>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "12px",
              marginBottom: "30px"
            }}>
              {stats.map((statInfo, index) => {
                // Handle different API response formats
                const statName = statInfo.stat?.name || statInfo.name || "unknown";
                const statValue = statInfo.base_stat || 0;
                
                // Get a color based on the stat value (higher = more green)
                const percentage = (statValue / maxStatValue) * 100;
                const hue = Math.min(percentage, 100);
                const statColor = `hsl(${hue}, 70%, 45%)`;
                
                return (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ 
                      width: "120px", 
                      textAlign: "right", 
                      paddingRight: "15px",
                      fontWeight: "bold",
                      color: "#555",
                      textTransform: "capitalize",
                      fontSize: "14px"
                    }}>
                      {statName.replace('-', ' ')}
                    </div>
                    <div style={{ 
                      width: "50px", 
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "16px" 
                    }}>
                      {statValue}
                    </div>
                    <div style={{ 
                      flex: "1", 
                      height: "12px", 
                      backgroundColor: "#e0e0e0", 
                      borderRadius: "6px", 
                      overflow: "hidden",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
                    }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: "100%", 
                        backgroundColor: statColor,
                        transition: "width 1.5s ease-out",
                        boxShadow: "inset 0 0 5px rgba(255,255,255,0.3)"
                      }} />
                    </div>
                  </div>
                );
              })}
              
              {stats.length === 0 && (
                <p style={{ color: "#888", fontStyle: "italic" }}>No stat information available</p>
              )}
            </div>

            {/* Abilities section */}
            <h2 style={{ 
              marginTop: "40px", 
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: "5px",
              color: "#333"
            }}>Abilities</h2>
            
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "10px",
              marginBottom: "30px"
            }}>
              {getAbilities().map((abilityInfo, index) => {
                // Handle different API response formats
                const abilityName = typeof abilityInfo === 'string' 
                  ? abilityInfo 
                  : (abilityInfo.ability?.name || abilityInfo.name || "unknown");
                const isHidden = abilityInfo.is_hidden;
                
                return (
                  <div 
                    key={index}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: isHidden ? "#f0f0f0" : mediumBg,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      textTransform: "capitalize",
                      color: "#444",
                      border: "1px solid #ddd",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}
                  >
                    {abilityName.replace('-', ' ')}
                    {isHidden && (
                      <span style={{ 
                        fontSize: "10px", 
                        marginLeft: "5px", 
                        opacity: "0.7", 
                        backgroundColor: "#ddd",
                        padding: "2px 5px",
                        borderRadius: "3px"
                      }}>
                        Hidden
                      </span>
                    )}
                  </div>
                );
              })}
              
              {getAbilities().length === 0 && (
                <p style={{ color: "#888", fontStyle: "italic" }}>No abilities information available</p>
              )}
            </div>

            {/* Moves section - Show just a few moves if available */}
            {pokemon.moves && pokemon.moves.length > 0 && (
              <>
                <h2 style={{ 
                  marginTop: "40px", 
                  borderBottom: `2px solid ${primaryColor}`,
                  paddingBottom: "5px",
                  color: "#333"
                }}>Moves</h2>
                
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "8px",
                  marginBottom: "20px"
                }}>
                  {pokemon.moves.slice(0, 15).map((moveInfo, index) => {
                    // Handle different API response formats
                    const moveName = typeof moveInfo === 'string' 
                      ? moveInfo 
                      : (moveInfo.move?.name || moveInfo.name || "unknown");
                    
                    return (
                      <div 
                        key={index}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: lightBg,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                          textTransform: "capitalize",
                          color: "#555",
                          border: "1px solid #eee"
                        }}
                      >
                        {moveName.replace('-', ' ')}
                      </div>
                    );
                  })}
                  
                  {pokemon.moves.length > 15 && (
                    <div style={{ 
                      padding: "6px 12px",
                      backgroundColor: mediumBg,
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#555",
                      border: "1px solid #ddd"
                    }}>
                      +{pokemon.moves.length - 15} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}