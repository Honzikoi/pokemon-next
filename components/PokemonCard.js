export default function PokemonCard({ name, image }) {
    return (
      <div style={{
        border: "1px solid #eee",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "center",
        width: "150px"
      }}>
        <img src={image} alt={name} width="100" height="100" />
        {/* <p>{pokemon.name}</p> */}
      </div>
    );
  }
  