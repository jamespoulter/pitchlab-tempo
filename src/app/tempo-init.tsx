"use client";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
import { useEffect, useState } from "react";

export function TempoInit() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO === "true") {
      try {
        console.log("Initializing Tempo Devtools");
        
        // Wrap the initialization in a try-catch to prevent errors from affecting the app
        const initTempo = async () => {
          try {
            await TempoDevtools.init();
            console.log("Tempo Devtools initialized successfully");
          } catch (initError: any) {
            console.error("Error initializing Tempo Devtools:", initError);
            setError(initError?.message || "Failed to initialize Tempo Devtools");
            
            // Add a global error handler specifically for Tempo errors
            window.addEventListener('error', function(event) {
              if (event.filename && event.filename.includes('tempo')) {
                console.warn('Caught Tempo error:', event.message);
                event.preventDefault();
                return true;
              }
              return false;
            });
          }
        };
        
        // Initialize with a timeout to prevent blocking the main thread
        setTimeout(initTempo, 100);
      } catch (error: any) {
        console.error("Error setting up Tempo Devtools:", error);
        setError(error?.message || "Failed to set up Tempo Devtools");
      }
    }
  }, []);

  // Render nothing, or an error message if debugging is enabled
  return process.env.NODE_ENV === 'development' && error ? (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      background: '#FEF2F2', 
      color: '#B91C1C',
      padding: '8px 12px', 
      fontSize: '12px', 
      borderRadius: '4px 0 0 0',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      Tempo Error: {error}
    </div>
  ) : null;
}
