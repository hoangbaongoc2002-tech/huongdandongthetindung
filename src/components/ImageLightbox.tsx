import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface LightboxStep {
  stepNumber: number;
  stepLabel: string;
  text: string;
  imageLocal: string;
  imageRemote: string;
  imageFallback?: string;
}

interface ImageLightboxProps {
  steps: LightboxStep[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  steps,
  currentIndex,
  onClose,
  onSelectIndex,
}) => {
  const [zoomed, setZoomed] = React.useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < steps.length - 1) {
        onSelectIndex(currentIndex + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectIndex(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, steps.length, onClose, onSelectIndex]);

  if (currentIndex === null || !steps[currentIndex]) return null;

  const currentStep = steps[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col justify-between p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={currentStep.text}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto text-white z-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400 shrink-0 tabular-nums">
            {currentStep.stepLabel} / {steps.length}
          </span>
          <p className="text-sm md:text-base font-medium text-slate-100 truncate">
            {currentStep.text}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={zoomed ? 'Thu nhỏ' : 'Phóng to'}
          >
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div
        className="flex-1 flex items-center justify-center relative my-4 overflow-auto"
        onClick={onClose}
      >
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex(currentIndex - 1);
            }}
            className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors z-20 cursor-pointer"
            aria-label="Bước trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          className={`transition-transform duration-200 ${
            zoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
        >
          <SmartImage
            src={currentStep.imageLocal}
            remoteSrc={currentStep.imageRemote}
            fallbackSrc={currentStep.imageFallback}
            alt={currentStep.text}
            className="max-h-[75vh] w-auto rounded-xl shadow-2xl border border-white/10 bg-slate-900"
            imgClassName="max-h-[75vh] w-auto object-contain mx-auto"
          />
        </div>

        {currentIndex < steps.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex(currentIndex + 1);
            }}
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors z-20 cursor-pointer"
            aria-label="Bước tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Step Selector */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-center gap-2 overflow-x-auto py-1">
        {steps.map((s, idx) => (
          <button
            key={s.stepNumber}
            type="button"
            onClick={() => onSelectIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
              idx === currentIndex
                ? 'bg-[#005993] text-white font-semibold'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {s.stepLabel}
          </button>
        ))}
      </div>
    </div>
  );
};
