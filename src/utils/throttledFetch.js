import { warn } from "./logger";

let queue = Promise.resolve();

export const throttledFetch = async (url, options = {}, retries = 1) => {
  const fetchTask = () =>
    new Promise((resolve, reject) => {
      fetch(url, options).then(resolve).catch(reject);
    });

  const enqueue = () => {
    return new Promise((resolve, reject) => {
      queue = queue.then(async () => {
        try {
          const res = await fetchTask();
          resolve(res);
        } catch (error) {
          reject(error);
        } finally {
          await new Promise((r) => setTimeout(r, 1200));
        }
      });
    });
  };

  try {
    const res = await enqueue();

    if (res.status === 429) {
      if (retries > 0) {
        warn(`[throttledFetch] 429 received, retrying after 3s... (retries left: ${retries})`);
        await new Promise((r) => setTimeout(r, 3000));
        return throttledFetch(url, options, retries - 1);
      }
      throw new Error("Rate limited by CoinGecko. Please wait a moment and try again.");
    }

    return res;
  } catch (err) {
    const isMaskedRateLimit = err instanceof TypeError && err.message.includes("Failed to fetch");

    if (isMaskedRateLimit && retries > 0) {
      warn(`[throttledFetch] Failed to fetch (likely CORS/429), retrying after 3s... (retries left: ${retries})`);
      await new Promise((r) => setTimeout(r, 3000));
      return throttledFetch(url, options, retries - 1);
    }

    if (isMaskedRateLimit) {
      throw new Error("Rate limited by CoinGecko. Please wait a moment and try again.");
    }

    throw err;
  }
};