function ReviewCard({ review }) {
  return (
    <article
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '0.8rem',
        }}
      >
        <div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.3rem' }}>
            {review.restaurant}
          </h3>
          <p style={{ color: 'var(--color-muted)' }}>{review.date}</p>
        </div>

        <span
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            padding: '0.4rem 0.8rem',
            borderRadius: '999px',
            fontWeight: 'bold',
            height: 'fit-content',
          }}
        >
          {'⭐'.repeat(review.rating)}
        </span>
      </div>

      <p style={{ lineHeight: 1.6 }}>{review.comment}</p>
    </article>
  );
}

export default ReviewCard;