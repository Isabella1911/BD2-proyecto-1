import { userData } from '../data/settingsMockData';

export async function getUserSettings() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userData);
    }, 500);
  });
}