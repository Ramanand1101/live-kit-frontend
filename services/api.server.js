const api = {
  get: async (url) => {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001/api';

    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorData = { message: 'Failed to fetch' };
        try {
          errorData = await response.json();
        } catch (_) {}
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return { data };
    } catch (err) {
      throw new Error(err.message || 'Network error');
    }
  },
};

export default api;
