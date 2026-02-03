import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Mark React as loaded (hides loading screen)
try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  
  // React successfully mounted
  if (typeof window.markReactLoaded === 'function') {
    window.markReactLoaded();
  }
} catch (error) {
  console.error('Failed to mount React:', error);
  
  // Still try to mark as loaded to show fallback
  if (typeof window.markReactLoaded === 'function') {
    window.markReactLoaded();
  }
}
