'use client';

import { useState } from 'react';

export default function PrivacyNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="privacy-notice" style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      fontSize: '14px',
      lineHeight: '1.5'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>🍪 Privacy & Analytics</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>
      <p style={{ margin: '0 0 10px 0' }}>
        This website uses Google Analytics to understand how visitors interact with our content. 
        This helps us improve your experience and provide better tarot readings.
      </p>
      <p style={{ margin: '0 0 15px 0', fontSize: '12px', opacity: '0.8' }}>
        By continuing to use this site, you consent to our use of cookies and analytics. 
        You can learn more about our privacy practices in our privacy policy.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            backgroundColor: '#4a90e2',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Accept
        </button>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid #666',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
