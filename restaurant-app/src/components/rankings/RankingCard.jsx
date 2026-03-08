function RankingCard({ item, position, valueLabel }) {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <article
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        boxShadow: 'var(--shadow-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            minWidth: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          {medals[position - 1] || `#${position}`}
        </div>

        <div>
          <h3
            style={{
              color: 'var(--color-primary)',
              marginBottom: '0.3rem',
            }}
          >
            {item.badge} {item.name}
          </h3>

          <p
            style={{
              color: 'var(--color-muted)',
              fontSize: '0.95rem',
            }}
          >
            {item.extra}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <p
          style={{
            color: 'var(--color-dark)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          {item.value}
        </p>

        <p
          style={{
            color: 'var(--color-muted)',
            fontSize: '0.9rem',
          }}
        >
          {valueLabel}
        </p>
      </div>
    </article>
  );
}

export default RankingCard;