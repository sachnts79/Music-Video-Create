import React from 'react';
import type { VideoOptions } from '../types';

interface OptionsPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  options: VideoOptions;
  onOptionChange: (options: VideoOptions) => void;
}

const OptionButton = <T,>({ label, value, selectedValue, onSelect }: { label: string, value: T, selectedValue: T, onSelect: (value: T) => void }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
      selectedValue === value
        ? 'bg-brand-primary text-brand-bg shadow-md'
        : 'bg-brand-secondary text-brand-text-secondary hover:bg-brand-secondary/70'
    }`}
  >
    {label}
  </button>
);

const availableEffects = [
    'Cinematic',
    'Black & White',
    'Vintage Film',
    'Dreamy Glow',
    'Neon Punk',
    'Slow Motion',
    'Time-lapse',
    'Psychedelic',
];

// FIX: Extracted props to a dedicated interface to resolve a type error where the 'key' prop was not being correctly handled.
interface EffectButtonProps {
    label: string;
    isSelected: boolean;
    onToggle: () => void;
}

const EffectButton = ({ label, isSelected, onToggle }: EffectButtonProps) => (
    <button
      type="button"
      onClick={onToggle}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
        isSelected
          ? 'bg-brand-primary text-brand-bg shadow-md border-brand-primary'
          : 'bg-brand-secondary text-brand-text-secondary hover:bg-opacity-80 border-transparent'
      }`}
    >
      {label}
    </button>
  );

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ prompt, onPromptChange, options, onOptionChange }) => {
  const handleOptionChange = <K extends keyof VideoOptions,>(key: K, value: VideoOptions[K]) => {
    onOptionChange({ ...options, [key]: value });
  };

  const handleEffectToggle = (effect: string) => {
    const newEffects = options.effects.includes(effect)
      ? options.effects.filter(e => e !== effect)
      : [...options.effects, effect];
    onOptionChange({ ...options, effects: newEffects });
  };


  return (
    <div className="bg-brand-surface p-6 rounded-2xl shadow-lg border border-brand-secondary space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-lg font-semibold text-brand-accent mb-2">
          Scene Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., A neon hologram of a cat driving at top speed..."
          rows={3}
          className="w-full bg-brand-bg border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 placeholder-brand-text-secondary/50"
        />
        <p className="text-xs text-brand-text-secondary mt-1">Describe the animation or context for your image.</p>
      </div>

      <div>
          <h4 className="font-semibold text-brand-accent mb-3">Video Effects</h4>
          <div className="flex flex-wrap gap-2">
            {availableEffects.map(effect => (
              <EffectButton
                key={effect}
                label={effect}
                isSelected={options.effects.includes(effect)}
                onToggle={() => handleEffectToggle(effect)}
              />
            ))}
          </div>
          <p className="text-xs text-brand-text-secondary mt-2">Select one or more styles to apply to your video.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-brand-accent mb-3">Aspect Ratio</h4>
          <div className="flex space-x-2">
            <OptionButton label="16:9 Landscape" value="16:9" selectedValue={options.aspectRatio} onSelect={(v) => handleOptionChange('aspectRatio', v)} />
            <OptionButton label="9:16 Portrait" value="9:16" selectedValue={options.aspectRatio} onSelect={(v) => handleOptionChange('aspectRatio', v)} />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-brand-accent mb-3">Output Quality</h4>
          <div className="flex space-x-2">
            <OptionButton label="720p" value="720p" selectedValue={options.resolution} onSelect={(v) => handleOptionChange('resolution', v)} />
            <OptionButton label="1080p" value="1080p" selectedValue={options.resolution} onSelect={(v) => handleOptionChange('resolution', v)} />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-brand-accent mb-3">Video Duration</h4>
          <div className="flex space-x-2">
            <OptionButton label="Short (~4s)" value="short" selectedValue={options.duration} onSelect={(v) => handleOptionChange('duration', v)} />
            <OptionButton label="Medium (~8s)" value="medium" selectedValue={options.duration} onSelect={(v) => handleOptionChange('duration', v)} />
            <OptionButton label="Long (~12s)" value="long" selectedValue={options.duration} onSelect={(v) => handleOptionChange('duration', v)} />
          </div>
        </div>
      </div>
    </div>
  );
};