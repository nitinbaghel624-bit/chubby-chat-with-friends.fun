import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Plus, Sparkles, Send, AlertCircle, Crown, Lock } from 'lucide-react';
import { GiftItem, UserProfile } from '../../types';
import { GIFTS_CATALOG } from '../../data/membershipData';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recipient: UserProfile;
  userCoinBalance: number;
  isMember: boolean;
  onOpenMembership: () => void;
  onSendGift: (gift: GiftItem, count: number, totalCoins: number) => void;
}

export const GiftBottomSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  recipient,
  userCoinBalance,
  isMember,
  onOpenMembership,
  onSendGift,
}) => {
  const [selectedGift, setSelectedGift] = useState<GiftItem>(GIFTS_CATALOG[0]);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const totalCoinsNeeded = selectedGift.coins * multiplier;
  const hasEnoughCoins = userCoinBalance >= totalCoinsNeeded;

  const handleSend = () => {
    if (!isMember) {
      soundEffects.playPop();
      onOpenMembership();
      return;
    }

    if (!hasEnoughCoins) {
      soundEffects.playPop();
      onOpenMembership();
      return;
    }

    setIsSending(true);
    soundEffects.playGiftFanfare();
    soundEffects.playCoinChime();

    setTimeout(() => {
      setIsSending(false);
      onSendGift(selectedGift, multiplier, totalCoinsNeeded);
      onClose();
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-md bg-[#0E0720] border-t sm:border border-[#6C3BFF]/40 rounded-t-[36px] sm:rounded-[36px] p-5 text-white shadow-[0_0_50px_rgba(108,59,255,0.4)] relative font-['Plus_Jakarta_Sans',sans-serif] max-h-[85vh] flex flex-col"
        >
          {/* Top Handle Bar for mobile pull feel */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#6C3BFF]/20 text-[#6C3BFF] border border-[#6C3BFF]/40 shadow-[0_0_12px_rgba(108,59,255,0.3)]">
                <Gift className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white font-['Syne',sans-serif] tracking-tight uppercase">
                  Send Gift to {recipient.name.split(' ')[0]}
                </h3>
                <p className="text-[10px] text-white/60 font-semibold">
                  Gifts boost friendship status & leaderboard ranking
                </p>
              </div>
            </div>

            <button
              id="close-gift-sheet-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/50 hover:text-white bg-white/5 border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Wallet Balance Strip */}
          <div className="my-3 p-2.5 rounded-2xl bg-[#170D38] border border-[#6C3BFF]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base">🪙</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/50 block">
                  Your Balance
                </span>
                <span className="text-xs font-black text-[#FFD700] font-mono">
                  {userCoinBalance} Coins
                </span>
              </div>
            </div>

            <button
              id="buy-coins-quick-btn"
              type="button"
              onClick={() => {
                soundEffects.playPop();
                onOpenMembership();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#6C3BFF] hover:bg-[#8C62FF] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_12px_rgba(108,59,255,0.5)] transition-transform active:scale-95"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>{isMember ? 'Recharge' : 'Get VIP & Coins'}</span>
            </button>
          </div>

          {/* Non-Member Warning Notice */}
          {!isMember && (
            <div className="mb-3 p-2.5 rounded-xl bg-[#FF3B80]/15 border border-[#FF3B80]/40 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-white/90">
                <Lock className="w-3.5 h-3.5 text-[#FF3B80] shrink-0" />
                <span className="text-[11px] font-bold">Rule: Only VIP Members can buy & send gifts!</span>
              </div>
              <button
                onClick={onOpenMembership}
                className="text-[10px] font-black uppercase tracking-wider text-[#FF3B80] underline hover:text-white"
              >
                Unlock VIP
              </button>
            </div>
          )}

          {/* Gifts Grid (7 Official Gifts) */}
          <div className="grid grid-cols-4 gap-2.5 my-2 overflow-y-auto max-h-56 p-1">
            {GIFTS_CATALOG.map((gift) => {
              const isSelected = selectedGift.id === gift.id;

              return (
                <button
                  key={gift.id}
                  id={`gift-item-${gift.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedGift(gift);
                    soundEffects.playPop();
                  }}
                  className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center relative group ${
                    isSelected
                      ? 'bg-[#231252] border-[#6C3BFF] shadow-[0_0_20px_rgba(108,59,255,0.5)] scale-105 ring-1 ring-[#6C3BFF]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Gift Emoji / Icon */}
                  <span className="text-3xl filter drop-shadow-md transform group-hover:scale-110 transition-transform mb-1">
                    {gift.icon}
                  </span>

                  <span className="text-[11px] font-black text-white font-['Syne',sans-serif]">
                    {gift.name}
                  </span>

                  <div className="mt-1 flex items-center gap-0.5 text-[10px] font-black text-[#FFD700] font-mono">
                    <span>🪙</span>
                    <span>{gift.coins}</span>
                  </div>

                  {/* Rarity Pill */}
                  <span
                    className="mt-1 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full"
                    style={{
                      backgroundColor: `${gift.animationColor}22`,
                      color: gift.animationColor,
                    }}
                  >
                    {gift.rarity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Multiplier Pills & Info */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              {[1, 5, 10, 99].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  id={`multiplier-btn-${amt}`}
                  onClick={() => {
                    setMultiplier(amt);
                    soundEffects.playPop();
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                    multiplier === amt
                      ? 'bg-[#6C3BFF] text-white shadow-[0_0_10px_rgba(108,59,255,0.5)]'
                      : 'bg-white/5 text-white/50 hover:text-white border border-white/10'
                  }`}
                >
                  {amt}x
                </button>
              ))}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-white/50 block uppercase">Total Cost</span>
              <span className="text-sm font-black text-[#FFD700] font-mono">
                🪙 {totalCoinsNeeded} Coins
              </span>
            </div>
          </div>

          {/* Send CTA Button */}
          <div className="mt-4 shrink-0">
            {!isMember ? (
              <button
                id="unlock-vip-to-gift-btn"
                type="button"
                onClick={onOpenMembership}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#8C62FF] to-[#FF3B80] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(108,59,255,0.6)] flex items-center justify-center gap-2 hover:opacity-95 transition-transform active:scale-95"
              >
                <Crown className="w-4 h-4" />
                <span>Join VIP Membership to Send Gifts</span>
              </button>
            ) : !hasEnoughCoins ? (
              <button
                id="insufficient-coins-btn"
                type="button"
                onClick={onOpenMembership}
                className="w-full py-3.5 rounded-2xl bg-[#FF3B80] hover:bg-[#ff1cae] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,59,128,0.5)] flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Need {totalCoinsNeeded - userCoinBalance} More Coins (Recharge Now)</span>
              </button>
            ) : (
              <button
                id="send-gift-action-btn"
                type="button"
                disabled={isSending}
                onClick={handleSend}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#00D1FF] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(108,59,255,0.6)] flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending {selectedGift.name}...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      Send {multiplier > 1 ? `${multiplier}x ` : ''}{selectedGift.name} ({totalCoinsNeeded} Coins)
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
