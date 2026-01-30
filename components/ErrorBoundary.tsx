import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-emerald-400 p-8 text-center font-mystic z-50">
          <h1 className="text-4xl mb-4">星象紊乱</h1>
          <p className="text-slate-400 mb-8 max-w-md">
            观测过程中遇到了不可预知的波动。请刷新页面重试。
          </p>
          <div className="bg-slate-900 p-4 rounded-lg border border-red-900/30 text-left overflow-auto max-h-48 max-w-full text-xs text-red-400 font-mono">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-500/30 rounded-full transition-colors"
          >
            重启观测仪
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
