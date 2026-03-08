function HistoryTabs({ activeTab, onChangeTab }) {
  const tabs = [
    { key: 'orders', label: 'Pedidos' },
    { key: 'reviews', label: 'Reseñas' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${
                isActive ? 'var(--color-primary)' : 'var(--color-muted)'
              }`,
              backgroundColor: isActive
                ? 'var(--color-primary)'
                : 'var(--color-surface)',
              color: isActive ? 'var(--color-bg)' : 'var(--color-dark)',
              fontWeight: 'bold',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default HistoryTabs;