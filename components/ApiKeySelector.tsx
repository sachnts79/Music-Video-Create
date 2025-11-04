
import React from 'react';
import { KeyIcon } from './IconComponents';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-brand-surface rounded-2xl shadow-2xl border border-brand-secondary text-center">
      <div className="flex justify-center mb-6">
        <KeyIcon className="w-16 h-16 text-brand-primary" />
      </div>
      <h2 className="text-3xl font-bold mb-4 text-brand-accent">API Key Required</h2>
      <p className="text-brand-text-secondary mb-6">
        To generate videos, you need to select a Gemini API key. This app requires access to models with billing enabled.
      </p>
      <button
        onClick={onSelectKey}
        className="bg-brand-primary text-brand-bg font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-50 transition-transform transform hover:scale-105"
      >
        Select API Key
      </button>
      <p className="text-xs text-brand-text-secondary mt-6">
        For more information on billing, visit{' '}
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary hover:underline"
        >
          ai.google.dev/gemini-api/docs/billing
        </a>.
      </p>
    </div>
  );
};
   