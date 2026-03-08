import RestaurantCard from './RestaurantCard';

function RestaurantList({ restaurants }) {
  if (restaurants.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-soft)',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            color: 'var(--color-primary)',
            marginBottom: '0.5rem',
          }}
        >
          No encontramos resultados
        </h3>

        <p style={{ color: 'var(--color-dark)' }}>
          Prueba con otro nombre, cocina o dirección.
        </p>
      </div>
    );
  }

  return (
    <>
      <p
        style={{
          marginBottom: '1.5rem',
          color: 'var(--color-muted)',
          fontWeight: 'bold',
        }}
      >
        {restaurants.length} restaurante(s) encontrado(s)
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </section>
    </>
  );
}

export default RestaurantList;