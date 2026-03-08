function ProfileForm({ profile, onChange }) {
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
        Perfil
      </h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <input
          type="text"
          value={profile.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="Nombre completo"
          style={inputStyle}
        />

        <input
          type="email"
          value={profile.email}
          onChange={(event) => onChange('email', event.target.value)}
          placeholder="Correo electrónico"
          style={inputStyle}
        />

        <input
          type="text"
          value={profile.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          placeholder="Teléfono"
          style={inputStyle}
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

export default ProfileForm;