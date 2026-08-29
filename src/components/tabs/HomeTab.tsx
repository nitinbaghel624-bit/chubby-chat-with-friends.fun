import React, { useState } from 'react';
import { UserProfile, ChatThread, UserWallet } from '../../types';
import { Sparkles, MapPin, Heart, MessageCircle, UserPlus, Flame, Search, Bell, Crown, Gift, Plus } from 'lucide-react';
import { soundEffects } from '../audio/audioSynthesizer';
import { RANK_TIERS } from '../../data/membershipData';

interface Props {
  currentUser: UserProfile;
  wallet?: UserWallet;
  users: UserProfile[];
  threads: ChatThread[];
  onSelectUser: (user: UserProfile) => void;
  onStartChat: (user: UserProfile) => void;
  onSendFriendRequest: (user: UserProfile) => void;
  onOpenNotifications: () => void;
  onOpenMembership?: () => void;
  onOpenWallet?: () => void;
  onSendGiftDirect?: (user: UserProfile) => void;
}

export const HomeTab: React.FC<Props> = ({
  currentUser,
  wallet,
  users,
  threads,
  onSelectUser,
  onStartChat,
  onSendFriendRequest,
  onOpenNotifications,
  onOpenMembership,
  onOpenWallet,
  onSendGiftDirect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoryUser, setSelectedStoryUser] = useState<UserProfile | null>(null);

  const isUserMember = !!wallet?.isMember;
  const coinBal = wallet?.coinBalance ?? 0;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto pb-20 text-white bg-[#0E0720] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="p-4 bg-[#170D38] border-b border-[#6C3BFF]/25 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C3BFF] to-[#FF3B80] p-0.5 shadow-[0_0_15px_rgba(108,59,255,0.4)]">
            <div className="w-full h-full rounded-[14px] bg-[#0E0720] flex items-center justify-center text-white font-black text-lg font-['Syne',sans-serif]">
              C
            </div>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tighter leading-none text-white flex items-center gap-1.5 font-['Syne',sans-serif]">
              CHUBBY <span className="text-[#FF3B80]">CHAT</span>
              {isUserMember && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6C3BFF]/30 text-[#FFD700] font-black border border-[#6C3BFF] tracking-widest uppercase flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </h1>
            <p className="text-[10px] text-[#00D1FF] font-bold tracking-wider uppercase mt-0.5">
              Discover Friends Nearby
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Coin Wallet Pill */}
          <button
            id="home-wallet-pill-btn"
            onClick={() => {
              soundEffects.playPop();
              onOpenWallet?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#6C3BFF]/20 border border-[#6C3BFF]/50 text-white hover:bg-[#6C3BFF]/30 transition-colors shadow-sm"
          >
            <span className="text-xs">🪙</span>
            <span className="text-xs font-black text-[#FFD700] font-mono">{coinBal}</span>
            <Plus className="w-3 h-3 text-[#00D1FF]" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-2xl bg-white/5 text-white hover:text-white border border-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF3B80] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF3B80]" />
          </button>
        </div>
      </div>

      {/* Stories / Active Carousels */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-white/80 uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#FF3B80]" /> Active Stories
          </span>
          <span className="text-[10px] font-bold text-[#00D1FF] uppercase tracking-wider">
            {users.filter((u) => u.isOnline).length} Active Online
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {/* My Story */}
          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
            <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#00D1FF] to-[#6C3BFF]">
              <img
                src={currentUser.avatar}
                alt="My story"
                className="w-full h-full rounded-full object-cover border-2 border-[#0E0720]"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#6C3BFF] text-white flex items-center justify-center text-xs font-black border-2 border-[#0E0720]">
                +
              </span>
            </div>
            <span className="text-[10px] font-bold text-white/70">Your Story</span>
          </div>

          {/* User Stories */}
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedStoryUser(user);
                soundEffects.playPop();
              }}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#6C3BFF] via-[#8C62FF] to-[#FF3B80] group-hover:scale-105 transition-transform">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#0E0720]"
                />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00D1FF] border-2 border-[#0E0720]" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white/80 max-w-[60px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, city or interests..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6C3BFF]"
          />
        </div>
      </div>

      {/* VIP Membership Quick Banner */}
      {!isUserMember && (
        <div className="px-4 mb-4">
          <div
            onClick={() => {
              soundEffects.playPop();
              onOpenMembership?.();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#FF3B80] flex items-center justify-between cursor-pointer shadow-[0_0_20px_rgba(108,59,255,0.35)] hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/20 text-white">
                <Crown className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-['Syne',sans-serif]">
                  Upgrade to VIP Membership
                </h4>
                <p className="text-[10px] text-white/90 font-medium">Unlock coin top-ups & send virtual gifts!</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase bg-white text-[#6C3BFF] px-2.5 py-1 rounded-xl shadow">
              From ₹49
            </span>
          </div>
        </div>
      )}

      {/* Featured Match of the Day */}
      {filteredUsers.length > 0 && !searchQuery && (
        <div className="px-4 mb-4">
          <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-[#6C3BFF]/30 p-4 shadow-[0_0_30px_rgba(108,59,255,0.15)]">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#6C3BFF]/20 text-[#6C3BFF] text-[10px] font-black tracking-widest uppercase border border-[#6C3BFF]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF3B80]" /> Top Vibe Match
              </span>
              <span className="text-xs text-[#00D1FF] font-black tracking-wider">98% MATCH</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={filteredUsers[0].avatar}
                alt={filteredUsers[0].name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#6C3BFF] shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-white flex items-center gap-1.5 tracking-tight font-['Syne',sans-serif]">
                    {filteredUsers[0].name}, {filteredUsers[0].age}
                  </h3>
                  {filteredUsers[0].isMember && (
                    <span className="px-1.5 py-0.5 rounded bg-[#6C3BFF] text-[8px] font-black uppercase">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#00D1FF]" />
                  {filteredUsers[0].location.city} • {filteredUsers[0].distanceKm} km away
                </p>
                <p className="text-xs text-white/80 mt-1 line-clamp-1 italic">
                  "{filteredUsers[0].bio}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
              <button
                onClick={() => onSelectUser(filteredUsers[0])}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-black uppercase tracking-wider text-white transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => onSendGiftDirect(filteredUsers[0])}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FF9900] text-black text-xs font-black uppercase tracking-wider shadow-md hover:opacity-90 flex items-center justify-center gap-1 transition-all"
                title="Send Gift"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Gift</span>
              </button>
              <button
                onClick={() => onStartChat(filteredUsers[0])}
                className="flex-1 py-2.5 rounded-xl bg-[#6C3BFF] text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(108,59,255,0.4)] hover:bg-[#8C62FF] flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Say Hi (4 Free)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Discovery Feed */}
      <div className="px-4 space-y-3">
        <h2 className="text-xs font-black text-white/60 uppercase tracking-widest">
          {searchQuery ? `Search Results (${filteredUsers.length})` : 'Recommended for You'}
        </h2>

        {filteredUsers.map((user) => {
          const rankTier = user.currentRankTier ? RANK_TIERS[user.currentRankTier] : null;
          return (
            <div
              key={user.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center gap-3.5 shadow-sm"
            >
              <div
                onClick={() => onSelectUser(user)}
                className="relative cursor-pointer shrink-0"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-white/15"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0E0720] ${
                    user.isOnline ? 'bg-[#00D1FF]' : 'bg-slate-500'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0" onClick={() => onSelectUser(user)}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white truncate flex items-center gap-1.5 tracking-tight font-['Syne',sans-serif]">
                    {user.name}
                    <span className="text-xs font-normal text-white/50">{user.age}</span>
                    {user.isMember && (
                      <Crown className="w-3 h-3 text-[#FFD700]" />
                    )}
                  </h4>
                  {user.distanceKm !== undefined && (
                    <span className="text-[10px] text-[#6C3BFF] font-black uppercase">
                      {user.distanceKm < 1 ? '<1 km' : `${user.distanceKm} km`}
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-[#00D1FF]" />
                  {user.location.city}, {user.location.country}
                </p>

                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {rankTier && (
                    <span
                      className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded"
                      style={{ backgroundColor: `${rankTier.color}30`, color: rankTier.color }}
                    >
                      {rankTier.icon} {user.currentRankTier}
                    </span>
                  )}
                  {user.interests.slice(0, 2).map((item, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onSendGiftDirect(user)}
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] hover:opacity-90 text-white shadow-sm transition-transform active:scale-95"
                  title="Send Gift"
                >
                  <Gift className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => onStartChat(user)}
                  className="p-2.5 rounded-xl bg-[#6C3BFF] hover:bg-[#8C62FF] text-white shadow-md shadow-[#6C3BFF]/30 transition-transform active:scale-95"
                  title="Chat"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => onSendFriendRequest(user)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#00D1FF] border border-white/10 transition-transform active:scale-95"
                  title="Friend Request"
                >
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Story Popup Simulation */}
      {selectedStoryUser && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[75vh] bg-[#0E0720] rounded-3xl overflow-hidden flex flex-col justify-between p-4 border border-[#6C3BFF]/40 shadow-2xl">
            <img
              src={selectedStoryUser.avatar}
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

            {/* Story Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedStoryUser.avatar}
                  alt={selectedStoryUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#6C3BFF]"
                />
                <div>
                  <h4 className="text-sm font-black text-white font-['Syne',sans-serif]">{selectedStoryUser.name}</h4>
                  <p className="text-[10px] text-[#00D1FF] font-bold uppercase tracking-wider">
                    Active today • {selectedStoryUser.location.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStoryUser(null)}
                className="text-white text-xs bg-black/60 px-3 py-1 rounded-full font-black uppercase"
              >
                ✕
              </button>
            </div>

            {/* Story Caption & Action */}
            <div className="relative z-10 space-y-3">
              <p className="text-sm text-white font-medium bg-black/70 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                "{selectedStoryUser.bio}"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const u = selectedStoryUser;
                    setSelectedStoryUser(null);
                    onSendGiftDirect(u);
                  }}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1"
                >
                  <Gift className="w-4 h-4" /> Send Gift
                </button>
                <button
                  onClick={() => {
                    const u = selectedStoryUser;
                    setSelectedStoryUser(null);
                    onStartChat(u);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#6C3BFF] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(108,59,255,0.5)] hover:bg-[#8C62FF]"
                >
                  Reply to Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
