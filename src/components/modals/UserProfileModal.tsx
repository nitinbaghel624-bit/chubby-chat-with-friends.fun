import React from 'react';
import { UserProfile } from '../../types';
import { X, MapPin, Calendar, Heart, MessageCircle, ShieldAlert, Sparkles, UserPlus, Gift, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../audio/audioSynthesizer';
import { RANK_TIERS } from '../../data/membershipData';

interface Props {
  user: UserProfile | null;
  onClose: () => void;
  onStartChat: (user: UserProfile) => void;
  onSendFriendRequest: (user: UserProfile) => void;
  onReport: (user: UserProfile) => void;
  onBlock: (user: UserProfile) => void;
  onSendGift?: (user: UserProfile) => void;
  friendStatus?: string;
}

export const UserProfileModal: React.FC<Props> = ({
  user,
  onClose,
  onStartChat,
  onSendFriendRequest,
  onReport,
  onBlock,
  onSendGift,
  friendStatus = 'none',
}) => {
  if (!user) return null;

  const rankTier = user.currentRankTier ? RANK_TIERS[user.currentRankTier] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-md bg-[#0E0720] border border-[#6C3BFF]/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(108,59,255,0.35)] max-h-[90vh] flex flex-col text-white font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Header Image Gallery */}
          <div className="relative h-64 w-full bg-[#170D38] shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0720] via-transparent to-black/60" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/10"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Status pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase tracking-wider border border-white/15">
              <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              <span>{user.isOnline ? 'Active Now' : user.lastActive}</span>
            </div>

            {/* VIP & Rank Badges */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              {user.isMember && (
                <span className="px-2.5 py-1 rounded-full bg-[#6C3BFF] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg border border-white/20">
                  <Crown className="w-3 h-3 text-[#FFD700]" /> VIP Member
                </span>
              )}
              {rankTier && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border shadow-lg"
                  style={{
                    backgroundColor: `${rankTier.color}25`,
                    borderColor: `${rankTier.color}60`,
                    color: rankTier.color,
                  }}
                >
                  <span>{rankTier.icon}</span> {user.currentRankTier}
                </span>
              )}
            </div>

            {/* Distance badge */}
            {user.distanceKm !== undefined && (
              <div className="absolute bottom-4 right-4 px-3.5 py-1 rounded-full bg-[#6C3BFF] text-white text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(108,59,255,0.5)]">
                📍 {user.distanceKm < 1 ? '< 1 km away' : `${user.distanceKm.toLocaleString()} km away`}
              </div>
            )}
          </div>

          {/* Details Scroll Area */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2 font-['Syne',sans-serif]">
                  {user.name}
                  <span className="text-xl font-bold text-white/50">, {user.age}</span>
                </h3>
                <p className="text-xs text-white/70 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#00D1FF]" />
                  {user.location.city}, {user.location.country}
                </p>
              </div>
              <span className="capitalize px-3 py-1 text-[10px] rounded-full bg-[#6C3BFF]/20 text-[#6C3BFF] border border-[#6C3BFF]/40 font-black uppercase tracking-wider">
                {user.gender}
              </span>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-[10px] uppercase tracking-widest text-white/60 font-black mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6C3BFF]" /> About
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">{user.bio}</p>
            </div>

            {/* Gifter Statistics if available */}
            {(user.lifetimeCoinsSent !== undefined || user.lifetimeCoinsReceived !== undefined) && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[9px] font-bold text-white/50 uppercase block">Gifts Sent</span>
                  <span className="text-sm font-black text-rose-400 font-mono">
                    🪙 {user.lifetimeCoinsSent || 0} Coins
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[9px] font-bold text-white/50 uppercase block">Gifts Received</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    🪙 {user.lifetimeCoinsReceived || 0} Coins
                  </span>
                </div>
              </div>
            )}

            {/* Birthday info */}
            <div className="flex items-center gap-2 text-xs text-white/70 font-medium">
              <Calendar className="w-4 h-4 text-[#00D1FF]" />
              <span>Born {user.dob}</span>
            </div>

            {/* Interests Chips */}
            {user.interests && user.interests.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/60 font-black mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#FF3B80]" /> Passions & Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs rounded-xl bg-white/5 text-white/90 border border-white/10 font-bold uppercase tracking-wide"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-black uppercase tracking-wider">
              <button
                onClick={() => onReport(user)}
                className="hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Report User
              </button>
              <button
                onClick={() => onBlock(user)}
                className="hover:text-rose-400 transition-colors"
              >
                Block
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#170D38] border-t border-white/10 flex items-center gap-2.5">
            {onSendGift && (
              <button
                id="profile-send-gift-action-btn"
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onClose();
                  onSendGift(user);
                }}
                className="py-3 px-3.5 rounded-2xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(108,59,255,0.5)] transition-all"
                title="Send Gift"
              >
                <Gift className="w-4 h-4 stroke-[2.5]" />
                <span>Gift</span>
              </button>
            )}

            {friendStatus !== 'accepted' && (
              <button
                onClick={() => onSendFriendRequest(user)}
                className="flex-1 py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/15"
              >
                <UserPlus className="w-4 h-4 text-[#00D1FF]" />
                <span>{friendStatus === 'pending_sent' ? 'Pending' : 'Add Friend'}</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onStartChat(user);
              }}
              className="flex-1 py-3 px-3 rounded-2xl bg-[#6C3BFF] hover:bg-[#8C62FF] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(108,59,255,0.5)] transition-all"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Chat Now</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
