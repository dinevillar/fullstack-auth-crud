
export const apiUrl = import.meta.env.VITE_API_URL;

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  console.log(`API Request: ${apiUrl}${endpoint}`, options);
  const response = await fetch(`${apiUrl}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return await response.json();
}
