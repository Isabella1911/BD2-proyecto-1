import { historyData } from "../data/historyMockData";

export async function getHistoryReviews() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(historyData.reviews);
    }, 400);
  });
}