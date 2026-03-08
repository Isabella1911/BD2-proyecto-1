import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CategoryFilter from '../components/home/CategoryFilter';
import RestaurantList from '../components/home/RestaurantList';
import { getRestaurants } from '../services/restaurantService';

function Home() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error al cargar restaurantes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const categories = useMemo(() => {
    const cuisineList = restaurants.map((restaurant) => restaurant.cuisine);
    return ['Todas', ...new Set(cuisineList)];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch = `${restaurant.name} ${restaurant.cuisine} ${restaurant.address}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Todas' || restaurant.cuisine === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [restaurants, search, selectedCategory]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <PageHeader
        title="Restaurantes disponibles"
        subtitle="Explora restaurantes, revisa sus calificaciones y encuentra opciones para hacer tus pedidos."
      />

      <SearchBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Busca por nombre, tipo de cocina o ubicación..."
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {isLoading ? (
        <LoadingSpinner text="Cargando restaurantes..." />
      ) : (
        <RestaurantList restaurants={filteredRestaurants} />
      )}
    </div>
  );
}

export default Home;