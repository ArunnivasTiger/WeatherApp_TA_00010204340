import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div
      id="weather-error-card"
      className="w-full rounded-3xl bg-rose-950/30 border border-rose-500/30 p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">Weather Data Unavailable</h3>
      <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          id="retry-fetch-btn"
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry Request'}</span>
        </button>
      )}

      <div className="mt-5 text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Open-Meteo public endpoints are active without requiring an API key.</span>
      </div>
    </div>
  );
};
