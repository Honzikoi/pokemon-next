export default function PokemonCard({ pokemon }) {

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "10px",
      padding: "10px",
      textAlign: "center",
      width: "150px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease",
      cursor: "pointer",
      backgroundColor: "#fff"
    }}>

      {pokemon.image && (
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          width="100" 
          height="100" 
          style={{ marginBottom: "10px" }}
        />
      )}
      
      <h3 style={{ 
        margin: "5px 0", 
        fontSize: "16px", 
        textTransform: "capitalize",
        color: "#333"
      }}>
        {pokemon.name}
      </h3>

      {pokemon.id && (
        <p style={{ 
          margin: "5px 0", 
          fontSize: "12px", 
          color: "#666" 
        }}>
          #{pokemon.id}
        </p>
      )}
    </div>
  );
}