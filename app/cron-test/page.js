'use client';

import { useState } from 'react';

export default function CronTestPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerCron = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cron-check');
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Test Cron Job</h1>
      <button
        onClick={triggerCron}
        style={{ padding: '10px 20px', marginTop: '10px' }}
      >
        {loading ? 'Running...' : 'Trigger Cron Manually'}
      </button>

      {response && (
        <pre style={{ marginTop: 20, background: '#f4f4f4', padding: 10 }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </main>
  );
}
