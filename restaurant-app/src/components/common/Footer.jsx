function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-bg)',
        marginTop: '2rem',
      }}
    >
      <div
        className="container"
        style={{
          padding: '1.25rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <p style={{ fontWeight: 'bold' }}>FoodApp</p>
        <p style={{ opacity: 0.9 }}>Pedidos, reseñas y restaurantes en un solo lugar.</p>
      </div>
    </footer>
  );
}

export default Footer;