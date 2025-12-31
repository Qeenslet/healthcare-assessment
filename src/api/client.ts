import 'dotenv/config';

const BASE_URL = 'https://assessment.ksensetech.com/api';
const API_KEY = process.env.DEMOMED_API_KEY as string;

const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 5,
  backoff = 900
): Promise<T> {
  try {
    const res = await fetch(url, { ...options, headers: HEADERS });

    if ([429, 500, 503].includes(res.status) && retries > 0) {
        let multiplier = retries > 3 ? 2 : 3;
        console.warn('Request failed with status', res.status);
        console.warn("Next timeout: " + backoff * multiplier);
        await sleep(backoff);
        return fetchWithRetry(url, options, retries - 1, backoff * multiplier);
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (retries > 0) {
      await sleep(backoff);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

export async function getPatients(page: number, limit = 5) {
  return fetchWithRetry(
    `${BASE_URL}/patients?page=${page}&limit=${limit}`
  );
}

export async function submitAssessment(payload: unknown) {
  return fetchWithRetry(`${BASE_URL}/submit-assessment`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
