function PageHeader({ title, subtitle }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-soft)',
        marginBottom: '1.5rem',
      }}
    >
      <h1
        style={{
          color: 'var(--color-primary)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            color: 'var(--color-dark)',
            opacity: 0.85,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}

export default PageHeader;