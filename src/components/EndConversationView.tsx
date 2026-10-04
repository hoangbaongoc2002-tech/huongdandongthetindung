import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, RotateCcw, PhoneCall } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface EndConversationViewProps {
  brandName: string;
  logoLocal: string;
  logoRemote: string;
  thankYouMessage: string;
  restartButtonLabel: string;
  backToMenuLabel: string;
  advisorName: string;
  advisorRole: string;
  hotline: string;
  onRestart: () => void;
}

export const EndConversationView: React.FC<EndConversationViewProps> = ({
  brandName,
  logoLocal,
  logoRemote,
  thankYouMessage,
  restartButtonLabel,
  advisorName,
  advisorRole,
  hotline,
  onRestart,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 18, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const cleanPhone = hotline.replace(/\./g, '');

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div
        ref={cardRef}
        className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs space-y-6"
      >
        <div className="flex justify-center mb-2">
          <SmartImage
            src={logoLocal}
            remoteSrc={logoRemote}
            alt={brandName}
            className="h-10 sm:h-12 w-auto"
            imgClassName="h-10 sm:h-12 w-auto object-contain mx-auto"
          />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#005993]">
            Phiên hỗ trợ đã hoàn tất
          </p>
          <h1
            className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            “{thankYouMessage}”
          </h1>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#005993] hover:bg-[#004675] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{restartButtonLabel}</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-200/80 text-xs sm:text-sm text-slate-500 flex flex-wrap items-center justify-center gap-2">
          <span>Cần hỗ trợ thêm? Liên hệ {advisorRole}</span>
          <strong className="text-slate-800 font-semibold">{advisorName}</strong>
          <span aria-hidden="true">·</span>
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-1 font-mono font-semibold text-[#005993] hover:underline tabular-nums"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D71920]" />
            {hotline}
          </a>
        </div>
      </div>
    </section>
  );
};
