import React from 'react';
import { Home, Radar, MessageCircle, User, Trophy, Wifi, BatteryCharging, Signal } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'nearby' | 'chats' | 'leaderboard' | 'profile';

interface Props {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({
  currentTab,
  onTabChange,
  unreadMessagesCount,
  pendingRequestsCount,
  children,
}) => {
  return (
    <div className="relative w-full max-w-[420px] h-[840px] max-h-[92vh] bg-[#0E0720] rounded-[48px] border-[8px] border-[#1c0a3e] shadow-[0_0_60px_rgba(108,59,255,0.35)] overflow-hidden flex flex-col mx-auto ring-1 ring-white/10 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Status Bar & Dynamic Notch */}
      <div className="h-11 px-6 bg-[#170D38] flex items-center justify-between text-white/80 text-xs font-bold shrink-0 select-none z-30 border-b border-[#6C3BFF]/20">
        <span className="font-mono text-[11px] tracking-tight font-black text-white">9:41</span>

        {/* Dynamic Notch Pill */}
        <div className="w-28 h-5 bg-black/90 rounded-full flex items-center justify-center gap-2 px-2.5 shadow-inner border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse" />
          <span className="text-[9px] text-[#00D1FF] font-black uppercase tracking-widest font-['Syne',sans-serif]">CHUBBY</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Signal className="w-3 h-3 text-[#00D1FF]" />
          <Wifi className="w-3.5 h-3.5 text-white/90" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-mono font-bold">98%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-[#00D1FF]" />
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0E0720]">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="h-16 bg-[#170D38] border-t border-[#6C3BFF]/30 px-2 flex items-center justify-around shrink-0 z-30 shadow-2xl">
        {/* Home Tab */}
        <button
          id="nav-tab-home"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'home'
              ? 'text-[#6C3BFF] scale-105 font-black'
              : 'text-white/40 hover:text-white font-bold'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] uppercase tracking-wider font-bold">Home</span>
        </button>

        {/* Nearby Radar Tab */}
        <button
          id="nav-tab-nearby"
          onClick={() => onTabChange('nearby')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'nearby'
              ? 'text-[#00D1FF] scale-105 font-black'
              : 'text-white/40 hover:text-white font-bold'
          }`}
        >
          <div className="relative">
            <Radar className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00D1FF] animate-ping" />
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold">Nearby</span>
        </button>

        {/* Leaderboard Tab */}
        <button
          id="nav-tab-leaderboard"
          onClick={() => onTabChange('leaderboard')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'leaderboard'
              ? 'text-[#FFD700] scale-105 font-black'
              : 'text-white/40 hover:text-white font-bold'
          }`}
        >
          <div className="relative">
            <Trophy className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold">Ranks</span>
        </button>

        {/* Chats Tab */}
        <button
          id="nav-tab-chats"
          onClick={() => onTabChange('chats')}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            currentTab === 'chats'
              ? 'text-[#FF3B80] scale-105 font-black'
              : 'text-white/40 hover:text-white font-bold'
          }`}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 stroke-[2.5]" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#FF3B80] text-white text-[8px] font-black shadow-[0_0_10px_rgba(255,59,128,0.8)]">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold">Chats</span>
        </button>

        {/* Profile Tab */}
        <button
          id="nav-tab-profile"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            currentTab === 'profile'
              ? 'text-[#00D1FF] scale-105 font-black'
              : 'text-white/40 hover:text-white font-bold'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5 stroke-[2.5]" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#6C3BFF] ring-2 ring-[#170D38]" />
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold">Profile</span>
        </button>
      </div>

      {/* Bottom Phone Indicator Bar */}
      <div className="h-3.5 bg-[#170D38] flex items-center justify-center shrink-0">
        <div className="w-32 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
};
