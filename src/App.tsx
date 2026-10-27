import React, { useState } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { DisclaimerModal } from './components/auth/DisclaimerModal';
import { LandscapeHeader } from './components/layout/LandscapeHeader';
import { CasinoFloor } from './components/layout/CasinoFloor';
import { GameTutorialModal } from './components/tutorial/GameTutorialModal';
import { ALL_GAMES } from './data/gamesCatalogue';

// Games
import { AviatorGame } from './components/games/aviator/AviatorGame';
import { RouletteGame } from './components/games/roulette/RouletteGame';
import { TeenPattiGame } from './components/games/teenpatti/TeenPattiGame';
import { NeonSlotsGame } from './components/games/slots/NeonSlotsGame';
import { BlackjackGame } from './components/games/blackjack/BlackjackGame';
import { MinesGame } from './components/games/mines/MinesGame';
import { AndarBaharGame } from './components/games/andarbahar/AndarBaharGame';
import { DragonTigerGame } from './components/games/dragontiger/DragonTigerGame';
import { CoinFlipGame } from './components/games/coinflip/CoinFlipGame';
import { DiceGame } from './components/games/dice/DiceGame';

// Wallet & Modals
import { PassbookView } from './components/wallet/PassbookView';
import { DepositModal } from './components/wallet/DepositModal';
import { WithdrawModal } from './components/wallet/WithdrawModal';
import { ProfileModal } from './components/auth/ProfileModal';
import { ResponsibleGamingModal } from './components/common/ResponsibleGamingModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ArrowUpRight } from 'lucide-react';
import { soundManager } from './lib/audio';
import { triggerHaptic } from './lib/haptics';

export const App: React.FC = () => {
  // Onboarding Stage: 'login' -> 'disclaimer' -> 'floor'
  const [onboardingStage, setOnboardingStage] = useState<'login' | 'disclaimer' | 'floor'>('login');

  // Active game view
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Tutorial Briefing Modal state
  const [tutorialGameId, setTutorialGameId] = useState<string | null>(null);

  // Wallet / Passbook view toggle
  const [showWalletPassbook, setShowWalletPassbook] = useState<boolean>(false);

  // Common Modals
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [responsibleOpen, setResponsibleOpen] = useState(false);

  // 1. Initial Login Screen
  if (onboardingStage === 'login') {
    return (
      <>
        <LoginScreen onInitiateLogin={() => setOnboardingStage('disclaimer')} />
        <ToastContainer />
      </>
    );
  }

  // Helper to get active game title
  const activeGameInfo = ALL_GAMES.find((g) => g.id === activeGameId);

  const handleOpenTutorial = (gameId: string) => {
    setTutorialGameId(gameId);
  };

  const handleLaunchGame = () => {
    if (tutorialGameId) {
      setActiveGameId(tutorialGameId);
      setTutorialGameId(null);
      setShowWalletPassbook(false);
    }
  };

  const renderActiveGame = () => {
    if (showWalletPassbook) {
      return (
        <div className="p-4 max-w-4xl mx-auto space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => {
                soundManager.playButtonTap();
                triggerHaptic('medium');
                setWithdrawOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-casino-card hover:bg-casino-cardHover border border-casino-gold/40 text-casino-gold font-bold text-xs flex items-center gap-1.5 shadow-glow-gold active:scale-95"
            >
              <span>Withdraw Payout</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <PassbookView />
        </div>
      );
    }

    switch (activeGameId) {
      case 'aviator':
      case 'limbo':
        return <AviatorGame />;
      case 'roulette':
      case 'megawheel':
        return <RouletteGame />;
      case 'teenpatti':
        return <TeenPattiGame />;
      case 'slots':
      case 'dragonslots':
      case 'royalgems':
        return <NeonSlotsGame />;
      case 'blackjack':
      case 'baccarat':
      case 'videopoker':
        return <BlackjackGame />;
      case 'mines':
        return <MinesGame />;
      case 'andarbahar':
        return <AndarBaharGame />;
      case 'dragontiger':
        return <DragonTigerGame />;
      case 'coinflip':
      case 'hilo':
        return <CoinFlipGame />;
      case 'dice':
      case 'plinko':
        return <DiceGame />;
      default:
        return (
          <CasinoFloor
            onSelectGameWithTutorial={handleOpenTutorial}
            onOpenWallet={() => setShowWalletPassbook(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden overflow-y-auto pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      {/* Sleek Widescreen Header */}
      <LandscapeHeader
        activeGameTitle={showWalletPassbook ? 'Wallet Passbook' : activeGameInfo?.title}
        onBackToFloor={() => {
          setActiveGameId(null);
          setShowWalletPassbook(false);
        }}
        onOpenDeposit={() => setDepositOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
      />

      {/* Main Gaming Stage */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto py-2 px-2 sm:px-4">
        {renderActiveGame()}
      </main>

      {/* Interactive Rules & How To Play Tutorial Modal */}
      <GameTutorialModal
        gameId={tutorialGameId}
        isOpen={tutorialGameId !== null}
        onClose={() => setTutorialGameId(null)}
        onPlay={handleLaunchGame}
      />

      {/* Disclaimer & 18+ Agreement Modal */}
      <DisclaimerModal
        isOpen={onboardingStage === 'disclaimer'}
        onAgreeAndProceed={() => setOnboardingStage('floor')}
      />

      {/* Modals */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
      />

      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenResponsible={() => setResponsibleOpen(true)}
      />

      <ResponsibleGamingModal
        isOpen={responsibleOpen}
        onClose={() => setResponsibleOpen(false)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
