'use client';

import { useState } from 'react';
import api from '@/services/api.server'; // ✅ Import the custom API wrapper

export default function CronTestPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const triggerCron = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResponse(null);

    try {
      const { data } = await api.get('/cron/check-inactive'); // ✅ Use server API
      setResponse(data);
    } catch (err) {
      setErrorMsg(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>🛠️ Test Cron Job</h1>

      <button
        onClick={triggerCron}
        disabled={loading}
        style={{
          padding: '10px 20px',
          marginTop: '10px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Running...' : 'Trigger Cron Manually'}
      </button>

      {errorMsg && (
        <p style={{ color: 'red', marginTop: '15px' }}>
          ❌ Error: {errorMsg}
        </p>
      )}

      {response && (
        <pre style={{ marginTop: 20, background: '#f4f4f4', padding: 10 }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </main>
  );
}
