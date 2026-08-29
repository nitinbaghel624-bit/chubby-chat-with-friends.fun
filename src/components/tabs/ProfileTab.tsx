import React, { useState } from 'react';
import { UserProfile, UserWallet } from '../../types';
import {
  User,
  MapPin,
  Calendar,
  Shield,
  Bell,
  LogOut,
  Edit3,
  Moon,
  Sparkles,
  Smartphone,
  Lock,
  Unlock,
  CheckCircle2,
  Sliders,
  Crown,
  Wallet,
  Gift,
  Plus,
  ChevronRight
} from 'lucide-react';
import { soundEffects } from '../audio/audioSynthesizer';
import { RANK_TIERS, getNextRankProgress } from '../../data/membershipData';

interface Props {
  user: UserProfile;
  wallet?: UserWallet;
  blockedUsers: UserProfile[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenEditModal: () => void;
  onUnblockUser: (userId: string) => void;
  onSignOut: () => void;
  onOpenAuthModal: () => void;
  onOpenMembership?: () => void;
  onOpenWallet?: () => void;
}

export const ProfileTab: React.FC<Props> = ({
  user,
  wallet,
  blockedUsers,
  onUpdateUser,
  onOpenEditModal,
  onUnblockUser,
  onSignOut,
  onOpenAuthModal,
  onOpenMembership,
  onOpenWallet,
}) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [radarVisible, setRadarVisible] = useState(true);
  const [showBlockedSection, setShowBlockedSection] = useState(false);

  const isUserMember = !!wallet?.isMember;
  const userCoinBalance = wallet?.coinBalance ?? 0;

  const toggleOnline = () => {
    soundEffects.playPop();
    onUpdateUser({
      isOnline: !user.isOnline,
      lastActive: !user.isOnline ? 'Active now' : 'Just now',
    });
  };

  const totalLifetimeCoins = (wallet?.lifetimeCoinsSent || 0) + (wallet?.lifetimeCoinsReceived || 0);
  const progressInfo = getNextRankProgress(totalLifetimeCoins);
  const tierInfo = RANK_TIERS[progressInfo.currentTier];

  return (
    <div className="flex-1 overflow-y-auto pb-24 text-white bg-[#0E0720] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner & Avatar Header */}
      <div className="relative bg-[#170D38] pt-6 pb-6 px-4 border-b border-[#6C3BFF]/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest font-black text-[#6C3BFF] flex items-center gap-1.5 font-['Syne',sans-serif]">
            <Sparkles className="w-4 h-4 text-[#00D1FF]" /> MY PROFILE
          </span>
          <button
            id="profile-edit-btn"
            onClick={onOpenEditModal}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-black uppercase tracking-wider text-white hover:bg-white/15 border border-white/15 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#00D1FF]" /> Edit
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-[#6C3BFF] via-[#8C62FF] to-[#FF3B80] shadow-[0_0_25px_rgba(108,59,255,0.4)]">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-2xl object-cover border border-[#0E0720]"
              />
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0E0720] ${
                user.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white truncate font-['Syne',sans-serif]">{user.name}</h2>
              {user.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-[#00D1FF] shrink-0" />
              )}
            </div>

            <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#6C3BFF]" />
              {user.location.city}, {user.location.country}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {isUserMember && (
                <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[#6C3BFF] text-white font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Crown className="w-3 h-3 text-[#FFD700]" /> VIP Member
                </span>
              )}
              <span
                className="text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 border"
                style={{
                  backgroundColor: `${tierInfo.color}20`,
                  borderColor: `${tierInfo.color}50`,
                  color: tierInfo.color,
                }}
              >
                <span>{tierInfo.icon}</span> {progressInfo.currentTier}
              </span>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 font-bold">
                🎂 {user.dob}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed font-medium">
          {user.bio}
        </div>
      </div>

      {/* Main Sections */}
      <div className="p-4 space-y-4">
        {/* VIP Membership & Coin Wallet Feature Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1F0E4D] via-[#170D38] to-[#12082B] border border-[#6C3BFF]/50 shadow-[0_0_30px_rgba(108,59,255,0.25)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#6C3BFF] text-white shadow-[0_0_15px_rgba(108,59,255,0.6)]">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] block">
                  {isUserMember ? 'VIP Status: Active' : 'VIP Status: Inactive'}
                </span>
                <h4 className="text-sm font-black text-white font-['Syne',sans-serif]">
                  Coins & Membership
                </h4>
              </div>
            </div>

            <button
              id="profile-membership-btn"
              type="button"
              onClick={() => {
                soundEffects.playPop();
                onOpenMembership?.();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF3B80] to-[#6C3BFF] text-white text-[11px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(255,59,128,0.4)] transition-transform active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>{isUserMember ? 'Upgrade' : 'Get VIP Plans'}</span>
            </button>
          </div>

          {/* Quick Balance Preview */}
          <div
            onClick={() => {
              soundEffects.playPop();
              onOpenWallet?.();
            }}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div>
              <span className="text-[9px] font-black uppercase text-white/50 block">Available Balance</span>
              <span className="text-lg font-black text-[#FFD700] font-mono flex items-center gap-1">
                🪙 {userCoinBalance} Coins
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-black uppercase text-[#6C3BFF]">
              <span>Wallet Passbook</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Presence / Online Switcher */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${user.isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
              <span className={`w-3 h-3 rounded-full block ${user.isOnline ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-500'}`} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Active Status</h4>
              <p className="text-[10px] text-white/60">
                {user.isOnline ? 'You appear Online to nearby users' : 'You appear Offline'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleOnline}
            className={`w-12 h-6.5 rounded-full transition-all p-0.5 flex items-center ${
              user.isOnline ? 'bg-emerald-400 justify-end' : 'bg-white/20 justify-start'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black shadow-md" />
          </button>
        </div>

        {/* Discovery & Privacy */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-lg">
          <h4 className="text-xs font-black text-white/60 uppercase tracking-widest">Privacy & Radar</h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#00D1FF]" />
              <div>
                <span className="text-xs font-black uppercase text-white block">Nearby Radar Discovery</span>
                <span className="text-[10px] text-white/60">Allow users to discover your profile within 1-10000 km</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={radarVisible}
              onChange={(e) => setRadarVisible(e.target.checked)}
              className="accent-[#6C3BFF] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#6C3BFF]" />
              <div>
                <span className="text-xs font-black uppercase text-white block">Push Notifications (FCM)</span>
                <span className="text-[10px] text-white/60">Alerts for gifts, 1-to-1 chats & friend requests</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={(e) => setPushEnabled(e.target.checked)}
              className="accent-[#6C3BFF] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Security & Blocked Users Section */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#FF3B80]" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Blocked Users ({blockedUsers.length})</h4>
                <p className="text-[10px] text-white/60">Manage blocked profiles</p>
              </div>
            </div>

            <button
              onClick={() => setShowBlockedSection(!showBlockedSection)}
              className="text-xs text-[#00D1FF] font-black uppercase tracking-wider"
            >
              {showBlockedSection ? 'Hide' : 'Manage'}
            </button>
          </div>

          {showBlockedSection && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              {blockedUsers.length === 0 ? (
                <p className="text-[10px] text-white/50 italic">No users currently blocked.</p>
              ) : (
                blockedUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-2 rounded-xl bg-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold">{u.name}</span>
                    </div>
                    <button
                      onClick={() => onUnblockUser(u.id)}
                      className="px-2.5 py-1 rounded bg-white/10 text-[#00D1FF] hover:bg-white/20 font-black uppercase text-[9px]"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Account Authentication Options */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 shadow-lg">
          <h4 className="text-xs font-black text-white/60 uppercase tracking-widest">Connected Auth Provider</h4>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/80 font-medium">
              <Smartphone className="w-4 h-4 text-[#00D1FF]" />
              <span>Phone: {user.phone || '+1 (555) 382-9910'}</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#00D1FF]/20 text-[#00D1FF] font-black uppercase tracking-wider">
              Verified
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={onOpenAuthModal}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-black uppercase tracking-wider text-white transition-colors"
            >
              Switch Auth
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
