'use client';

import { useEffect, useState } from 'react';
import { trackEvent, trackUserEngagement, trackTarotReading } from '@/lib/analytics';

export default function TestAnalyticsPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [gtagAvailable, setGtagAvailable] = useState<boolean>(false);
  const [gtmAvailable, setGtmAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Check if gtag and GTM are available
    const checkAnalytics = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        setGtagAvailable(true);
        addResult('✅ gtag function is available');
      } else {
        setGtagAvailable(false);
        addResult('❌ gtag function is not available');
      }

      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        setGtmAvailable(true);
        addResult('✅ GTM dataLayer is available');
      } else {
        setGtmAvailable(false);
        addResult('❌ GTM dataLayer is not available');
      }
    };

    // Check immediately and after a short delay
    checkAnalytics();
    const timer = setTimeout(checkAnalytics, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPageView = () => {
    if (window.gtag) {
      window.gtag('config', 'G-RRFYRMZH30', {
        page_title: 'Test Analytics Page',
        page_location: window.location.href,
      });
      addResult('📊 Page view event sent to GA4');
    } else {
      addResult('❌ Cannot send page view - gtag not available');
    }
  };

  const testCustomEvent = () => {
    trackEvent('test_event', 'testing', 'analytics_test', 1);
    addResult('🎯 Custom event sent: test_event');
  };

  const testUserEngagement = () => {
    trackUserEngagement('click', 'test_button');
    addResult('👆 User engagement tracked: button click');
  };

  const testTarotReading = () => {
    trackTarotReading('love');
    addResult('🔮 Tarot reading tracked: love');
  };

  const testDataLayer = () => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'test_data_layer',
        test_data: 'analytics_test',
        timestamp: new Date().toISOString(),
      });
      addResult('📦 Data layer push successful');
    } else {
      addResult('❌ Data layer not available');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Analytics Testing Page</h1>
      <p>Use this page to test your Google Analytics integration.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status:</h3>
        <p>
          <strong>gtag available:</strong> {gtagAvailable ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>GTM dataLayer:</strong> {gtmAvailable ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>GA4 ID:</strong> G-RRFYRMZH30
        </p>
        <p>
          <strong>GTM ID:</strong> GTM-WBZBZ894
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Actions:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button 
            onClick={testPageView}
            style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test Page View
          </button>
          <button 
            onClick={testCustomEvent}
            style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test Custom Event
          </button>
          <button 
            onClick={testUserEngagement}
            style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test User Engagement
          </button>
          <button 
            onClick={testTarotReading}
            style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test Tarot Reading
          </button>
          <button 
            onClick={testDataLayer}
            style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test Data Layer
          </button>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).dataLayer) {
                (window as any).dataLayer.push({
                  event: 'gtm_test',
                  gtm_id: 'GTM-WBZBZ894',
                  test_type: 'gtm_integration',
                  timestamp: new Date().toISOString(),
                });
                addResult('🔧 GTM test event pushed to dataLayer');
              } else {
                addResult('❌ Cannot test GTM - dataLayer not available');
              }
            }}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test GTM
          </button>
          <button 
            onClick={clearResults}
            style={{ padding: '8px 16px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Results
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Results:</h3>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '4px', 
          maxHeight: '300px', 
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {testResults.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No test results yet. Click the buttons above to test analytics.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>{result}</div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>How to Verify:</h3>
        <ol>
          <li>Open <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Google Analytics</a></li>
          <li>Go to your property (G-RRFYRMZH30)</li>
          <li>Click "Reports" → "Realtime" → "Events"</li>
          <li>Click the test buttons above and watch for events in real-time</li>
          <li>You should see events like "test_event", "user_engagement", etc.</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Browser Console:</h3>
        <p>Open Developer Tools (F12) and check the Console tab for any errors or gtag function calls.</p>
        <p>You should see gtag function calls when you click the test buttons.</p>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
        <h3>🎉 Success Indicators:</h3>
        <ul>
          <li>✅ gtag function is available in browser console</li>
          <li>✅ GTM dataLayer is accessible</li>
          <li>✅ No JavaScript errors in console</li>
          <li>✅ Events appear in Google Analytics Real-Time reports</li>
          <li>✅ GTM events appear in Tag Manager preview</li>
          <li>✅ Page views are tracked when navigating</li>
          <li>✅ Custom events are logged in GA4</li>
        </ul>
      </div>
    </div>
  );
}
