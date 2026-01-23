import React from 'react';
import { SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  desc: string;
  iconName?: 'Sparkles' | 'Beaker';
  onClick?: () => void;
};

export default function FeatureCard({ title, desc, iconName = 'Sparkles', onClick }: Props) {
  const Icon = iconName === 'Beaker' ? BeakerIcon : SparklesIcon;
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 border border-emerald-50 transform hover:-translate-y-1 transition-transform duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 rounded-lg">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-emerald-800 font-semibold">{title}</h3>
          <p className="text-sm text-emerald-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}


