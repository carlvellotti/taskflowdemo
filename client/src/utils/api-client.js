const BASE_URL = '/api';

async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => apiClient(endpoint),
  post: (endpoint, data) => apiClient(endpoint, { method: 'POST', body: data }),
  put: (endpoint, data) => apiClient(endpoint, { method: 'PUT', body: data }),
  delete: (endpoint) => apiClient(endpoint, { method: 'DELETE' }),
};
