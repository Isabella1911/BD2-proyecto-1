import RankingCard from './RankingCard';

function TopDishes({ dishes }) {
  return (
    <section>
      <h2
        style={{
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        Top platillos
      </h2>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
        }}
      >
        {dishes.map((dish, index) => (
          <RankingCard
            key={dish.id}
            item={dish}
            position={index + 1}
            valueLabel="ventas"
          />
        ))}
      </div>
    </section>
  );
}

export default TopDishes;