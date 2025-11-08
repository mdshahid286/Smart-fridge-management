// App initialization helper - ensures app starts quickly
import { useEffect, useState } from 'react';

export const useAppInit = () => {
  const [isReady, setIsReady] = useState(true); // Start as ready immediately
  
  useEffect(() => {
    // App is ready immediately - no blocking initialization
    console.log('🚀 App initialized');
  }, []);

  return isReady;
};

// Fast initialization - don't wait for anything
export default useAppInit;

