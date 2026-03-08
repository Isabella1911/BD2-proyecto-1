function AddressForm({ address, onChange }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <h2
        style={{
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        Dirección
      </h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <input
          type="text"
          value={address.street}
          onChange={(event) => onChange('street', event.target.value)}
          placeholder="Zona, colonia o calle"
          style={inputStyle}
        />

        <input
          type="text"
          value={address.city}
          onChange={(event) => onChange('city', event.target.value)}
          placeholder="Ciudad"
          style={inputStyle}
        />

        <textarea
          value={address.reference}
          onChange={(event) => onChange('reference', event.target.value)}
          placeholder="Referencia"
          rows="3"
          style={{ ...inputStyle, resize: 'none' }}
        />
      </div>
    </section>
  );
}

const inputStyle = {
  padding: '0.9rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-muted)',
  backgroundColor: '#fffaf0',
  color: 'var(--color-dark)',
  outline: 'none',
};

export default AddressForm;