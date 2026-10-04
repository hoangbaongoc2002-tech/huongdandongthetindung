import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, CheckCircle2, LogOut, PhoneCall } from 'lucide-react';

interface GuideItem {
  id: string;
  cardNumber: string;
  cardTitle: string;
  shortTitle: string;
  summary: string;
  stepCount: number;
  estimatedTime: string;
}

interface TopicCardListProps {
  kicker: string;
  question: string;
  subtitle: string;
  guides: GuideItem[];
  resolvedSuccessBanner: boolean;
  advisorName: string;
  advisorRole: string;
  hotline: string;
  endConversationLabel: string;
  onSelectGuide: (guideId: string) => void;
  onEndConversation: () => void;
}

export const TopicCardList: React.FC<TopicCardListProps> = ({
  kicker,
  question,
  subtitle,
  guides,
  resolvedSuccessBanner,
  advisorName,
  advisorRole,
  hotline,
  endConversationLabel,
  onSelectGuide,
  onEndConversation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-menu-item',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cleanPhone = hotline.replace(/\./g, '');

  return (
    <section ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Optional notification when returning from "Đã ổn" */}
      {resolvedSuccessBanner && (
        <div className="gsap-menu-item mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">
              Cảm ơn Quý khách đã xác nhận hoàn thành thao tác! Quý khách có thể chọn nội dung bên dưới nếu cần xem lại hoặc kết thúc cuộc trò chuyện.
            </p>
          </div>
        </div>
      )}

      {/* Main Prompt Header */}
      <div className="gsap-menu-item mb-8">
        <p className="text-xs sm:text-sm font-semibold text-[#005993] mb-2">
          {kicker}
        </p>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3"
          style={{ textWrap: 'balance' }}
        >
          {question}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Topic Cards (1 Card as specified) */}
      <div className="space-y-4 mb-10">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => onSelectGuide(guide.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectGuide(guide.id);
              }
            }}
            className="gsap-menu-item group relative bg-white rounded-2xl border border-slate-200/90 hover:border-[#005993] p-6 sm:p-8 transition-all duration-200 hover:shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005993]"
          >
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-[#005993] rounded-r-full transition-all duration-200 group-hover:bg-[#D71920]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-2">
              <div className="space-y-3 flex-1">
                {/* Quiet unboxed metadata */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 tabular-nums">
                  <span className="font-mono font-semibold text-[#005993]">
                    Mục {guide.cardNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.stepCount} bước hướng dẫn minh hoạ</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.estimatedTime}</span>
                </div>

                {/* Card Title */}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#005993] transition-colors leading-snug">
                  {guide.cardTitle}
                </h2>

                {/* Summary */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              {/* Action CTA */}
              <div className="shrink-0 flex items-center">
                <span className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#005993] group-hover:bg-[#004675] text-white text-sm font-semibold transition-colors whitespace-nowrap shadow-xs">
                  <span>Xem hướng dẫn</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar: Quick Advisor Support & End Conversation Option */}
      <div className="gsap-menu-item pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Hỗ trợ trực tiếp:</span>
          <strong className="font-semibold text-slate-900">
            {advisorRole} {advisorName}
          </strong>
          <span aria-hidden="true">·</span>
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-1 font-mono font-semibold text-[#005993] hover:underline tabular-nums"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D71920]" />
            {hotline}
          </a>
        </div>

        <button
          type="button"
          onClick={onEndConversation}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>{endConversationLabel}</span>
        </button>
      </div>
    </section>
  );
};
