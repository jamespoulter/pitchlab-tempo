'use client';

import Script from "next/script";
import { useState } from "react";

export function TempoScripts() {
  const [error, setError] = useState<string | null>(null);

  const handleScriptError = (e: Error) => {
    console.error('Error loading TEMPO script:', e);
    setError(e.message);
  };

  return (
    <>
      <Script 
        src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"
        strategy="afterInteractive"
        onError={handleScriptError}
      />
      <Script id="tempo-error-handler" strategy="afterInteractive">
        {`
          // Add global error handler for TEMPO script errors
          window.addEventListener('error', function(event) {
            if (event.filename && event.filename.includes('tempo')) {
              console.warn('Caught TEMPO script error:', event.message);
              event.preventDefault();
              return true;
            }
            return false;
          });
        `}
      </Script>
      {error && process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          background: '#FEF2F2', 
          color: '#B91C1C',
          padding: '8px 12px', 
          fontSize: '12px', 
          borderRadius: '0 4px 0 0',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          Tempo Script Error: {error}
        </div>
      )}
    </>
  );
} 