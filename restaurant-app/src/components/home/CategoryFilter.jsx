function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            style={{
              padding: '0.7rem 1rem',
              borderRadius: '999px',
              border: `2px solid ${
                isActive ? 'var(--color-primary)' : 'var(--color-muted)'
              }`,
              backgroundColor: isActive
                ? 'var(--color-primary)'
                : 'var(--color-surface)',
              color: isActive ? 'var(--color-bg)' : 'var(--color-dark)',
              fontWeight: 'bold',
              transition: '0.2s ease-in-out',
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;