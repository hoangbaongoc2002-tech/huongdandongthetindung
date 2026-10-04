import React from 'react';
import { PhoneCall } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface HeaderProps {
  brandName: string;
  logoLocal: string;
  logoRemote: string;
  hotline: string;
  homeLabel: string;
  guideLabel: string;
  endChatLabel: string;
  activeView: 'menu' | 'guide' | 'ended';
  onNavigateMenu: () => void;
  onSelectDefaultGuide: () => void;
  onEndConversation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  brandName,
  logoLocal,
  logoRemote,
  hotline,
  homeLabel,
  guideLabel,
  endChatLabel,
  activeView,
  onNavigateMenu,
  onSelectDefaultGuide,
  onEndConversation,
}) => {
  const cleanPhone = hotline.replace(/\./g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo on top-left */}
        <button
          type="button"
          onClick={onNavigateMenu}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005993] rounded-lg py-1 cursor-pointer shrink-0"
          aria-label={brandName}
        >
          <SmartImage
            src={logoLocal}
            remoteSrc={logoRemote}
            alt={brandName}
            className="h-9 sm:h-10 w-auto flex items-center"
            imgClassName="h-9 sm:h-10 w-auto object-contain"
          />
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onNavigateMenu}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
              activeView === 'menu'
                ? 'border-[#005993] text-[#005993] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {homeLabel}
          </button>
          <button
            type="button"
            onClick={onSelectDefaultGuide}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
              activeView === 'guide'
                ? 'border-[#005993] text-[#005993] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {guideLabel}
          </button>
          <button
            type="button"
            onClick={onEndConversation}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
              activeView === 'ended'
                ? 'border-[#005993] text-[#005993] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {endChatLabel}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#005993] bg-[#005993]/8 hover:bg-[#005993]/15 transition-colors whitespace-nowrap tabular-nums"
          >
            <PhoneCall className="w-4 h-4 text-[#D71920] shrink-0" />
            <span>Hỗ trợ: {hotline}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
