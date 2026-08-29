import React, { useState } from 'react';
import { Trophy, Crown, Sparkles, Gift, Flame, TrendingUp, ShieldCheck } from 'lucide-react';
import { LeaderboardUser, UserProfile } from '../../types';
import { RANK_TIERS } from '../../data/membershipData';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  leaderboardUsers: LeaderboardUser[];
  onOpenGiftSheetForUser: (user: UserProfile) => void;
  onOpenWallet: () => void;
  onOpenMembership: () => void;
  currentUserWalletBalance: number;
}

export const LeaderboardTab: React.FC<Props> = ({
  leaderboardUsers,
  onOpenGiftSheetForUser,
  onOpenWallet,
  onOpenMembership,
  currentUserWalletBalance,
}) => {
  const [filter, setFilter] = useState<'sent' | 'received'>('sent');

  // Sort dynamically based on filter
  const sortedUsers = [...leaderboardUsers].sort((a, b) => {
    if (filter === 'sent') {
      return b.lifetimeCoinsSent - a.lifetimeCoinsSent;
    }
    return b.lifetimeCoinsReceived - a.lifetimeCoinsReceived;
  });

  const topThree = sortedUsers.slice(0, 3);
  const remaining = sortedUsers.slice(3);

  return (
    <div className="w-full h-full flex flex-col bg-[#0E0720] text-white overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="p-4 bg-[#170D38] border-b border-[#6C3BFF]/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] shadow-[0_0_15px_rgba(108,59,255,0.6)]">
            <Trophy className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-black text-white font-['Syne',sans-serif] tracking-tight uppercase">
              Hall of Fame
            </h1>
            <p className="text-[10px] text-white/60 font-semibold">
              Live Real-Time Gifter Rankings
            </p>
          </div>
        </div>

        {/* Coin Balance Chip */}
        <button
          id="leaderboard-wallet-chip"
          type="button"
          onClick={() => {
            soundEffects.playPop();
            onOpenWallet();
          }}
          className="px-3 py-1.5 rounded-full bg-[#221250] hover:bg-[#2e176d] border border-[#6C3BFF]/40 text-xs font-black font-mono text-[#FFD700] flex items-center gap-1.5 shadow-[0_0_12px_rgba(108,59,255,0.3)] transition-transform active:scale-95"
        >
          <span>🪙</span>
          <span>{currentUserWalletBalance}</span>
        </button>
      </div>

      {/* Filter Tabs: Top Gifters vs Top Receivers */}
      <div className="px-4 py-2.5 bg-[#12082B] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            id="filter-top-gifters-btn"
            type="button"
            onClick={() => {
              setFilter('sent');
              soundEffects.playPop();
            }}
            className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${
              filter === 'sent'
                ? 'bg-[#6C3BFF] text-white shadow-[0_0_10px_rgba(108,59,255,0.5)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            🔥 Top Gifters (Sent)
          </button>
          <button
            id="filter-top-receivers-btn"
            type="button"
            onClick={() => {
              setFilter('received');
              soundEffects.playPop();
            }}
            className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${
              filter === 'received'
                ? 'bg-[#6C3BFF] text-white shadow-[0_0_10px_rgba(108,59,255,0.5)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            ✨ Popular (Received)
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenMembership}
          className="text-[10px] font-black uppercase text-[#00D1FF] hover:underline"
        >
          VIP Perks →
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Top 3 Podium Presentation */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#1E0E4D] via-[#140A30] to-[#0E0720] border border-[#6C3BFF]/40 shadow-[0_0_30px_rgba(108,59,255,0.3)]">
          <div className="text-center mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FFD700] flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Royal Gifter Champions <Sparkles className="w-3 h-3" />
            </span>
          </div>

          <div className="flex items-end justify-center gap-3 pt-3">
            {/* Rank 2 (Silver) */}
            {topThree[1] && (
              <div className="flex flex-col items-center flex-1">
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-300 ring-2 ring-slate-400/40 shadow-lg">
                    <img
                      src={topThree[1].avatar}
                      alt={topThree[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2.5 -right-2 bg-slate-300 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                    🥈 2
                  </div>
                </div>
                <span className="text-xs font-black text-white truncate max-w-[85px] text-center font-['Syne',sans-serif]">
                  {topThree[1].name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-black text-slate-300 font-mono">
                  {filter === 'sent' ? topThree[1].lifetimeCoinsSent : topThree[1].lifetimeCoinsReceived}
                </span>
                <span className="text-[8px] uppercase font-bold text-slate-400">Coins</span>
              </div>
            )}

            {/* Rank 1 (Gold / Super Champion) */}
            {topThree[0] && (
              <div className="flex flex-col items-center flex-1 pb-3 scale-110">
                <div className="relative mb-2">
                  <div className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-[#FFD700] ring-4 ring-[#FFD700]/30 shadow-[0_0_25px_rgba(255,215,0,0.6)]">
                    <img
                      src={topThree[0].avatar}
                      alt={topThree[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                    👑
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase">
                    #1 CHAMP
                  </div>
                </div>
                <span className="text-xs font-black text-white truncate max-w-[95px] text-center font-['Syne',sans-serif]">
                  {topThree[0].name.split(' ')[0]}
                </span>
                <span className="text-xs font-black text-[#FFD700] font-mono">
                  {filter === 'sent' ? topThree[0].lifetimeCoinsSent : topThree[0].lifetimeCoinsReceived}
                </span>
                <span className="text-[8px] uppercase font-bold text-[#FFD700]">Coins</span>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {topThree[2] && (
              <div className="flex flex-col items-center flex-1">
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#CD7F32] ring-2 ring-[#CD7F32]/40 shadow-lg">
                    <img
                      src={topThree[2].avatar}
                      alt={topThree[2].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2.5 -right-2 bg-[#CD7F32] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                    🥉 3
                  </div>
                </div>
                <span className="text-xs font-black text-white truncate max-w-[85px] text-center font-['Syne',sans-serif]">
                  {topThree[2].name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-black text-[#CD7F32] font-mono">
                  {filter === 'sent' ? topThree[2].lifetimeCoinsSent : topThree[2].lifetimeCoinsReceived}
                </span>
                <span className="text-[8px] uppercase font-bold text-[#CD7F32]">Coins</span>
              </div>
            )}
          </div>
        </div>

        {/* Ranking List Table */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">
            Rankings ({sortedUsers.length} Competitors)
          </label>

          {sortedUsers.map((user, idx) => {
            const rank = idx + 1;
            const coinsVal = filter === 'sent' ? user.lifetimeCoinsSent : user.lifetimeCoinsReceived;
            const tierInfo = RANK_TIERS[user.currentRankTier] || RANK_TIERS['Non'];
            const isMe = user.id === 'user_me';

            return (
              <div
                key={user.id}
                id={`leaderboard-row-${user.id}`}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isMe
                    ? 'bg-[#231252] border-[#6C3BFF] shadow-[0_0_15px_rgba(108,59,255,0.4)]'
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Left: Rank # & User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                      rank === 1
                        ? 'bg-[#FFD700] text-black shadow-md'
                        : rank === 2
                        ? 'bg-slate-300 text-black'
                        : rank === 3
                        ? 'bg-[#CD7F32] text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                    )}
                  </div>

                  {/* User Name & Badges */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white truncate font-['Syne',sans-serif]">
                        {user.name}
                      </span>
                      {user.isMember && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-[#6C3BFF] text-white shrink-0">
                          VIP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full flex items-center gap-1"
                        style={{
                          backgroundColor: `${tierInfo.color}15`,
                          color: tierInfo.color,
                        }}
                      >
                        <span>{tierInfo.icon}</span>
                        <span>{user.currentRankTier}</span>
                      </span>
                      <span className="text-[10px] text-white/50 truncate">{user.city}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Coins & Send Gift Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-black text-[#FFD700] font-mono flex items-center justify-end gap-1">
                      <span>🪙</span>
                      <span>{coinsVal}</span>
                    </div>
                    <span className="text-[8px] font-bold text-white/40 uppercase">
                      {filter === 'sent' ? 'Sent' : 'Earned'}
                    </span>
                  </div>

                  {!isMe && (
                    <button
                      id={`send-gift-to-${user.id}-btn`}
                      type="button"
                      onClick={() => {
                        soundEffects.playPop();
                        // Transform to user profile format
                        const targetProfile: UserProfile = {
                          id: user.id,
                          name: user.name,
                          avatar: user.avatar,
                          bio: 'Active user in Chubby Chat',
                          dob: '1998-01-01',
                          age: user.age,
                          gender: 'female',
                          isOnline: user.isOnline,
                          lastActive: 'Now',
                          location: {
                            lat: 37.77,
                            lng: -122.41,
                            city: user.city,
                            country: 'USA',
                          },
                          photos: [user.avatar],
                          interests: ['Music', 'Dating'],
                          blockedUserIds: [],
                        };
                        onOpenGiftSheetForUser(targetProfile);
                      }}
                      className="p-2 rounded-xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] hover:opacity-90 text-white shadow-[0_0_10px_rgba(108,59,255,0.4)] transition-transform active:scale-95"
                      title="Send Gift"
                    >
                      <Gift className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
