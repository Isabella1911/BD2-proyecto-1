import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TopRestaurants from '../components/rankings/TopRestaurants';
import TopDishes from '../components/rankings/TopDishes';
import { getRankingData } from '../services/rankingService';

function Rankings() {
  const [rankingData, setRankingData] = useState({
    topRestaurants: [],
    topDishes: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const data = await getRankingData();
        setRankingData(data);
      } catch (error) {
        console.error('Error al cargar rankings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRankings();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <PageHeader
        title="Rankings"
        subtitle="Consulta los restaurantes mejor calificados y los platillos más populares."
      />

      {isLoading ? (
        <LoadingSpinner text="Cargando rankings..." />
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '2rem',
          }}
        >
          <TopRestaurants restaurants={rankingData.topRestaurants} />
          <TopDishes dishes={rankingData.topDishes} />
        </div>
      )}
    </div>
  );
}

export default Rankings;