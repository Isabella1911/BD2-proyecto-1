import { rankingData } from '../data/rankingMockData';

export async function getRankingData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rankingData);
    }, 500);
  });
}