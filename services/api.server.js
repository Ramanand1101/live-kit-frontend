const api = {
  get: async (url) => {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001/api';

    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch');
    }

    const data = await response.json();
    return { data };
  }
};

export default api;
