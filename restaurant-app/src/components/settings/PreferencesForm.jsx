function PreferencesForm({ preferences, onToggle, onCuisineChange }) {
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
        Preferencias
      </h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <label style={labelStyle}>
          <span>Notificaciones</span>
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={() => onToggle('notifications')}
          />
        </label>

        <label style={labelStyle}>
          <span>Modo oscuro</span>
          <input
            type="checkbox"
            checked={preferences.darkMode}
            onChange={() => onToggle('darkMode')}
          />
        </label>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label
            style={{
              color: 'var(--color-dark)',
              fontWeight: 'bold',
            }}
          >
            Tipo de comida favorita
          </label>

          <select
            value={preferences.favoriteCuisine}
            onChange={(event) => onCuisineChange(event.target.value)}
            style={selectStyle}
          >
            <option value="Guatemalteca">Guatemalteca</option>
            <option value="Italiana">Italiana</option>
            <option value="Japonesa">Japonesa</option>
            <option value="Mexicana">Mexicana</option>
            <option value="Saludable">Saludable</option>
          </select>
        </div>
      </div>
    </section>
  );
}

const labelStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'var(--color-dark)',
  fontWeight: 'bold',
};

const selectStyle = {
  padding: '0.9rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-muted)',
  backgroundColor: '#fffaf0',
  color: 'var(--color-dark)',
  outline: 'none',
};

export default PreferencesForm;