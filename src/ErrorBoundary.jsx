import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to console if available
    if (typeof console !== 'undefined') {
      console.error('React Error Boundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fff8e1',
          border: '2px solid #ffd54f',
          borderRadius: '10px',
          margin: '20px',
          maxWidth: '600px',
          margin: '50px auto'
        }}>
          <h2 style={{ color: '#e65100', marginTop: 0 }}>🚨 Something went wrong</h2>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '5px',
            margin: '15px 0',
            fontFamily: 'monospace',
            fontSize: '14px',
            overflow: 'auto'
          }}>
            <p><strong>Error:</strong> {this.state.error?.toString() || 'Unknown error'}</p>
            
            {this.state.errorInfo && (
              <div>
                <p><strong>Component Stack:</strong></p>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  margin: 0
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>🛠️ Troubleshooting Steps:</h3>
            <ol style={{ paddingLeft: '20px' }}>
              <li><strong>Clear browser cache</strong> and refresh</li>
              <li>Try <strong>incognito/private mode</strong></li>
              <li>Check if <strong>JavaScript is enabled</strong></li>
              <li>Try a <strong>different browser</strong></li>
            </ol>
          </div>

          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '5px'
          }}>
            <p><strong>💡 Debug Info:</strong></p>
            <p>Browser: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
            <p>Screen: {typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown'}</p>
            <p>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}</p>
            <p>localStorage: {typeof localStorage !== 'undefined' ? 'Available' : 'Not available'}</p>
            <p>sessionStorage: {typeof sessionStorage !== 'undefined' ? 'Available' : 'Not available'}</p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
