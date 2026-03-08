import RankingCard from './RankingCard';

function TopRestaurants({ restaurants }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        Top restaurantes
      </h2>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
        }}
      >
        {restaurants.map((restaurant, index) => (
          <RankingCard
            key={restaurant.id}
            item={restaurant}
            position={index + 1}
            valueLabel="calificación"
          />
        ))}
      </div>
    </section>
  );
}

export default TopRestaurants;