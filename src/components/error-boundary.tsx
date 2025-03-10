'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-3xl mx-auto my-8">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Something went wrong</h2>
          
          <div className="bg-white p-4 rounded-md mb-4 overflow-auto">
            <p className="font-medium text-red-700 mb-2">{this.state.error?.toString()}</p>
            {this.state.errorInfo && (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap mt-2">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={this.handleReset}
              variant="outline"
            >
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="default"
            >
              Go to Home Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 