function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: '#fffaf0',
        border: '2px solid var(--color-muted)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        boxShadow: 'var(--shadow-soft)',
        marginBottom: '1.5rem',
      }}
    >
      <span
        style={{
          fontSize: '1.1rem',
          color: 'var(--color-primary)',
        }}
      >
        
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: 'var(--color-dark)',
        }}
      />
    </div>
  );
}

export default SearchBar;