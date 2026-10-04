import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Copy,
  Check,
  Video,
  ExternalLink,
  ZoomIn,
  LogOut,
  LayoutList,
  PlaySquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SmartImage } from './SmartImage';
import { ImageLightbox } from './ImageLightbox';

export interface GuideStep {
  stepNumber: number;
  stepLabel: string;
  text: string;
  detailNote: string;
  imageLocal: string;
  imageRemote: string;
  imageFallback?: string;
}

export interface GuideData {
  id: string;
  cardNumber: string;
  cardTitle: string;
  shortTitle: string;
  summary: string;
  stepCount: number;
  estimatedTime: string;
  youtubeUrl: string;
  youtubeLabel: string;
  youtubeSubtitle: string;
  steps: GuideStep[];
}

interface FeedbackConfig {
  promptQuestion: string;
  promptSubtitle: string;
  resolvedButtonLabel: string;
  unresolvedButtonLabel: string;
  unresolvedMessage: string;
  callActionLabel: string;
  copyPhoneLabel: string;
  copiedPhoneLabel: string;
  backToMenuLabel: string;
  endConversationLabel: string;
}

interface StepGuideViewProps {
  guide: GuideData;
  feedbackConfig: FeedbackConfig;
  hotline: string;
  advisorName: string;
  advisorRole: string;
  onBackToMenu: (resolved?: boolean) => void;
  onEndConversation: () => void;
}

export const StepGuideView: React.FC<StepGuideViewProps> = ({
  guide,
  feedbackConfig,
  hotline,
  advisorName,
  advisorRole,
  onBackToMenu,
  onEndConversation,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'stepper'>('all');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'unresolved'>('idle');
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const unresolvedBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [guide.id]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-step-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [viewMode, activeStepIndex]);

  useEffect(() => {
    if (feedbackState === 'unresolved' && unresolvedBoxRef.current) {
      unresolvedBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          unresolvedBoxRef.current,
          { opacity: 0, scale: 0.98, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
  }, [feedbackState]);

  const cleanPhone = hotline.replace(/\./g, '');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(cleanPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => onBackToMenu(false)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#005993] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{feedbackConfig.backToMenuLabel}</span>
        </button>

        {/* Segmented Control for All Steps vs Step-by-Step */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'all'
                ? 'bg-white text-[#005993] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Tất cả 6 bước</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('stepper')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'stepper'
                ? 'bg-white text-[#005993] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5" />
            <span>Xem từng bước</span>
          </button>
        </div>
      </div>

      {/* Guide Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 tabular-nums">
          <span className="font-mono font-semibold text-[#005993]">
            {guide.shortTitle}
          </span>
          <span aria-hidden="true">·</span>
          <span>{guide.steps.length} bước thực hiện</span>
          <span aria-hidden="true">·</span>
          <span>Nhấn vào ảnh để phóng to</span>
        </div>
        <h1
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug"
          style={{ textWrap: 'balance' }}
        >
          {guide.cardTitle}
        </h1>
      </div>

      {/* MODE 1: All Steps Vertical Layout */}
      {viewMode === 'all' ? (
        <div className="space-y-8 mb-12">
          {guide.steps.map((step, index) => (
            <article
              key={step.stepNumber}
              className="gsap-step-card bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 transition-shadow hover:shadow-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Step Text Column */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#005993] text-white font-mono text-sm font-bold flex items-center justify-center tabular-nums">
                      0{step.stepNumber}
                    </span>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#005993]">
                      {step.stepLabel} / {guide.steps.length}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {step.text}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.detailNote}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005993] hover:text-[#004675] transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Phóng to ảnh minh hoạ {step.stepLabel.toLowerCase()}</span>
                    </button>
                  </div>
                </div>

                {/* Step Image Column */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative group w-full max-w-sm bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <SmartImage
                      src={step.imageLocal}
                      remoteSrc={step.imageRemote}
                      fallbackSrc={step.imageFallback}
                      alt={step.text}
                      onClick={() => setLightboxIndex(index)}
                      className="w-full rounded-lg overflow-hidden"
                      imgClassName="w-full max-h-[460px] object-contain mx-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur-xs transition-opacity opacity-90 group-hover:opacity-100 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Xem rõ hơn</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* MODE 2: Interactive Stepper View */
        <div className="mb-12">
          {/* Step Progress Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
            {guide.steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                  idx === activeStepIndex
                    ? 'bg-[#005993] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{s.stepLabel}</span>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          {guide.steps[activeStepIndex] && (
            <article className="gsap-step-card bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg bg-[#005993] text-white font-mono text-sm font-bold flex items-center justify-center tabular-nums">
                      0{guide.steps[activeStepIndex].stepNumber}
                    </span>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#005993]">
                      {guide.steps[activeStepIndex].stepLabel} trên {guide.steps.length}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {guide.steps[activeStepIndex].text}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {guide.steps[activeStepIndex].detailNote}
                  </p>

                  {/* Stepper Navigation Buttons */}
                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={activeStepIndex === 0}
                      onClick={() => setActiveStepIndex((i) => Math.max(0, i - 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>

                    <button
                      type="button"
                      disabled={activeStepIndex === guide.steps.length - 1}
                      onClick={() =>
                        setActiveStepIndex((i) => Math.min(guide.steps.length - 1, i + 1))
                      }
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#005993] hover:bg-[#004675] disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>Bước tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative group w-full max-w-sm bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <SmartImage
                      src={guide.steps[activeStepIndex].imageLocal}
                      remoteSrc={guide.steps[activeStepIndex].imageRemote}
                      fallbackSrc={guide.steps[activeStepIndex].imageFallback}
                      alt={guide.steps[activeStepIndex].text}
                      onClick={() => setLightboxIndex(activeStepIndex)}
                      className="w-full rounded-lg overflow-hidden"
                      imgClassName="w-full max-h-[460px] object-contain mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(activeStepIndex)}
                      className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur-xs cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Phóng to</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      )}

      {/* YouTube Video Link Section (At the end of the main content as required) */}
      <div className="mb-10 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <a
              href={guide.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-2xl bg-[#D71920]/10 hover:bg-[#D71920]/20 text-[#D71920] flex items-center justify-center shrink-0 transition-transform hover:scale-105"
              aria-label="Mở video hướng dẫn trên YouTube"
              title="Nhấn để mở YouTube"
            >
              <Video className="w-7 h-7" />
            </a>
            <div className="space-y-1">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D71920]">
                Video hướng dẫn trực quan
              </p>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {guide.youtubeLabel}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {guide.youtubeSubtitle}
              </p>
            </div>
          </div>

          <a
            href={guide.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#D71920] hover:bg-[#b5141a] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Video className="w-4 h-4" />
            <span>Mở YouTube xem video</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Customer Check-In Section: "Sau mỗi phần hướng dẫn xong, hỏi khách hàng thực hiện ổn hay chưa?" */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#005993] mb-2">
            Xác nhận kết quả thực hiện
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            {feedbackConfig.promptQuestion}
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            {feedbackConfig.promptSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Option 1: Đã ổn -> Quay lại menu chính */}
            <button
              type="button"
              onClick={() => onBackToMenu(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedbackConfig.resolvedButtonLabel} (Quay lại menu chính)</span>
            </button>

            {/* Option 2: Chưa ổn -> Hiển thị thông tin Chuyên viên tư vấn Đỗ Thị Kim Nhi */}
            <button
              type="button"
              onClick={() => setFeedbackState('unresolved')}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
                feedbackState === 'unresolved'
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{feedbackConfig.unresolvedButtonLabel}</span>
            </button>
          </div>
        </div>

        {/* Unresolved Response Box with exact required message */}
        {feedbackState === 'unresolved' && (
          <div
            ref={unresolvedBoxRef}
            className="mt-6 pt-6 border-t border-slate-200/80"
          >
            <div className="p-5 sm:p-6 rounded-xl bg-[#005993]/5 border border-[#005993]/20 space-y-4">
              <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                “{feedbackConfig.unresolvedMessage}”
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs sm:text-sm text-slate-700">
                  <span className="text-slate-500">{advisorRole}: </span>
                  <strong className="font-bold text-slate-900">{advisorName}</strong>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-500">SĐT: </span>
                  <strong className="font-mono font-bold text-[#005993] tabular-nums">
                    {hotline}
                  </strong>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005993] hover:bg-[#004675] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap tabular-nums"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{feedbackConfig.callActionLabel}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">
                          {feedbackConfig.copiedPhoneLabel}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>{feedbackConfig.copyPhoneLabel}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar: "Quay lại menu chính" bên cạnh "Kết thúc cuộc trò chuyện" */}
      <div className="pt-4 border-t border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Quý khách có thể quay lại menu chính để chọn nội dung khác hoặc kết thúc phiên hỗ trợ.
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onBackToMenu(false)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{feedbackConfig.backToMenuLabel}</span>
          </button>

          <button
            type="button"
            onClick={onEndConversation}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{feedbackConfig.endConversationLabel}</span>
          </button>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <ImageLightbox
        steps={guide.steps}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
