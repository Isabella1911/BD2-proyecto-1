function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div
      style={{
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '5px solid var(--color-surface)',
          borderTop: '5px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />

      <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
        {text}
      </p>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingSpinner;