/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import contentData from './data/contentData.json';
import { Header } from './components/Header';
import { TopicCardList } from './components/TopicCardList';
import { StepGuideView, GuideData } from './components/StepGuideView';
import { EndConversationView } from './components/EndConversationView';

type ViewState = 'menu' | 'guide' | 'ended';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('menu');
  const [selectedGuideId, setSelectedGuideId] = useState<string>(
    contentData.guides[0]?.id || ''
  );
  const [resolvedSuccessBanner, setResolvedSuccessBanner] = useState<boolean>(false);

  const currentGuide: GuideData | undefined =
    contentData.guides.find((g) => g.id === selectedGuideId) || contentData.guides[0];

  const handleSelectGuide = (guideId: string) => {
    setSelectedGuideId(guideId);
    setResolvedSuccessBanner(false);
    setActiveView('guide');
  };

  const handleBackToMenu = (resolved = false) => {
    setResolvedSuccessBanner(resolved);
    setActiveView('menu');
  };

  const handleEndConversation = () => {
    setResolvedSuccessBanner(false);
    setActiveView('ended');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Headbar with VietinBank Logo on top-left */}
      <Header
        brandName={contentData.brand.name}
        logoLocal={contentData.brand.logoLocal}
        logoRemote={contentData.brand.logoRemote}
        hotline={contentData.brand.hotline}
        homeLabel={contentData.navigation.homeLabel}
        guideLabel={contentData.navigation.guideLabel}
        endChatLabel={contentData.navigation.endChatLabel}
        activeView={activeView}
        onNavigateMenu={() => handleBackToMenu(false)}
        onSelectDefaultGuide={() =>
          handleSelectGuide(contentData.guides[0]?.id || 'dong-the-mo-phong-toa-stk')
        }
        onEndConversation={handleEndConversation}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'menu' && (
          <TopicCardList
            kicker={contentData.welcomeSection.kicker}
            question={contentData.welcomeSection.question}
            subtitle={contentData.welcomeSection.subtitle}
            guides={contentData.guides}
            resolvedSuccessBanner={resolvedSuccessBanner}
            advisorName={contentData.brand.advisorName}
            advisorRole={contentData.brand.advisorRole}
            hotline={contentData.brand.hotline}
            endConversationLabel={contentData.feedbackSection.endConversationLabel}
            onSelectGuide={handleSelectGuide}
            onEndConversation={handleEndConversation}
          />
        )}

        {activeView === 'guide' && currentGuide && (
          <StepGuideView
            guide={currentGuide}
            feedbackConfig={contentData.feedbackSection}
            hotline={contentData.brand.hotline}
            advisorName={contentData.brand.advisorName}
            advisorRole={contentData.brand.advisorRole}
            onBackToMenu={handleBackToMenu}
            onEndConversation={handleEndConversation}
          />
        )}

        {activeView === 'ended' && (
          <EndConversationView
            brandName={contentData.brand.name}
            logoLocal={contentData.brand.logoLocal}
            logoRemote={contentData.brand.logoRemote}
            thankYouMessage={contentData.feedbackSection.endConversationMessage}
            restartButtonLabel={contentData.feedbackSection.restartButtonLabel}
            backToMenuLabel={contentData.feedbackSection.backToMenuLabel}
            advisorName={contentData.brand.advisorName}
            advisorRole={contentData.brand.advisorRole}
            hotline={contentData.brand.hotline}
            onRestart={() => handleBackToMenu(false)}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VietinBank — Cổng hướng dẫn khách hàng sử dụng dịch vụ thẻ trên VietinBank iPay.</p>
          <p className="tabular-nums">
            Hỗ trợ trực tiếp: {contentData.brand.advisorRole} {contentData.brand.advisorName} · {contentData.brand.hotline}
          </p>
        </div>
      </footer>
    </div>
  );
}
