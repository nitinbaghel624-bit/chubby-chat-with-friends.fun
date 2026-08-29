import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wallet, Crown, Plus, TrendingUp, History, Sparkles, ArrowDownLeft, ArrowUpRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { UserWallet } from '../../types';
import { RANK_TIERS, getNextRankProgress } from '../../data/membershipData';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onOpenMembership: () => void;
}

export const WalletModal: React.FC<Props> = ({
  isOpen,
  onClose,
  wallet,
  onOpenMembership,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  if (!isOpen) return null;

  const totalLifetimeCoins = wallet.lifetimeCoinsSent + wallet.lifetimeCoinsReceived;
  const progressInfo = getNextRankProgress(totalLifetimeCoins);
  const currentTierInfo = RANK_TIERS[progressInfo.currentTier];
  const nextTierInfo = progressInfo.nextTier ? RANK_TIERS[progressInfo.nextTier] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="w-full max-w-md bg-[#0E0720] border border-[#6C3BFF]/40 rounded-3xl p-6 text-white shadow-[0_0_50px_rgba(108,59,255,0.35)] relative max-h-[90vh] overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Close Button */}
          <button
            id="close-wallet-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/60 hover:text-white bg-white/5 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#6C3BFF] to-[#8C62FF] text-white shadow-[0_0_20px_rgba(108,59,255,0.5)]">
              <Wallet className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Syne',sans-serif] tracking-tight uppercase">
                Chubby Coin Wallet
              </h2>
              <p className="text-xs text-white/60 font-semibold">
                Real-time coins, rank progress & transactions
              </p>
            </div>
          </div>

          {/* Balance Card with Deep Violet Glow */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1F0E4D] via-[#170D38] to-[#0E0720] border border-[#6C3BFF]/50 shadow-[0_0_30px_rgba(108,59,255,0.3)] relative overflow-hidden mb-5">
            <div className="absolute top-0 right-0 p-8 bg-[#6C3BFF]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block">
                  Available Coin Balance
                </span>
                <div className="text-3xl font-black text-[#FFD700] font-mono mt-1 flex items-center gap-1.5 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                  <span>🪙</span>
                  <span>{wallet.coinBalance}</span>
                </div>
              </div>

              <button
                id="wallet-add-coins-btn"
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onOpenMembership();
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#6C3BFF] hover:bg-[#8C62FF] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(108,59,255,0.6)] transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Coins</span>
              </button>
            </div>

            {/* Lifetime Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-black uppercase text-white/50 block">Lifetime Sent</span>
                <span className="text-sm font-black text-rose-400 font-mono flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {wallet.lifetimeCoinsSent} Coins
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-black uppercase text-white/50 block">Lifetime Received</span>
                <span className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  {wallet.lifetimeCoinsReceived} Coins
                </span>
              </div>
            </div>
          </div>

          {/* Ranking Tier & Progress Card */}
          <div className="p-4 rounded-2xl bg-[#140A2E] border border-white/10 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentTierInfo.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block">
                    Gifter Rank Tier
                  </span>
                  <span
                    className="text-sm font-black font-['Syne',sans-serif]"
                    style={{ color: currentTierInfo.color }}
                  >
                    {currentTierInfo.badge}
                  </span>
                </div>
              </div>

              <span
                className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: `${currentTierInfo.color}15`,
                  borderColor: `${currentTierInfo.color}40`,
                  color: currentTierInfo.color,
                }}
              >
                {progressInfo.currentTier}
              </span>
            </div>

            {/* Progress Bar */}
            {nextTierInfo ? (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-white/70 mb-1">
                  <span>{totalLifetimeCoins} Coins</span>
                  <span>Next: {nextTierInfo.tier} ({nextTierInfo.minCoins} Coins)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressInfo.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#6C3BFF] to-[#00D1FF]"
                  />
                </div>
                <p className="text-[10px] text-white/50 mt-1 font-medium text-right">
                  {nextTierInfo.minCoins - totalLifetimeCoins} more coins to reach {nextTierInfo.tier}
                </p>
              </div>
            ) : (
              <div className="mt-2 p-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-center text-xs font-black text-[#FFD700]">
                👑 MAXIMUM TIER REACHED • SUPER PLATINUM GOD
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl mb-4 border border-white/10">
            <button
              id="wallet-tab-overview"
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#6C3BFF] text-white shadow-[0_0_12px_rgba(108,59,255,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              VIP Perks
            </button>
            <button
              id="wallet-tab-history"
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'history'
                  ? 'bg-[#6C3BFF] text-white shadow-[0_0_12px_rgba(108,59,255,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Passbook ({wallet.transactions.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white">VIP Membership Status</span>
                    <p className="text-[10px] text-white/60">
                      {wallet.isMember ? 'Active VIP Member' : 'Non-Member (Gifting Locked)'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    onOpenMembership();
                  }}
                  className="text-xs font-black text-[#6C3BFF] hover:underline flex items-center gap-0.5 uppercase"
                >
                  <span>{wallet.isMember ? 'Upgrade' : 'Join VIP'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ranking Rules Breakdown */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block">
                  Chubby Ranking System
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-bold text-white/60">Non</div>
                    <div className="font-mono text-white/40">0 Coins</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#CD7F32]/10 border border-[#CD7F32]/30">
                    <div className="font-bold text-[#CD7F32]">Bronze</div>
                    <div className="font-mono text-white/60">1,000 Coins</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-300/10 border border-slate-300/30">
                    <div className="font-bold text-slate-200">Silver</div>
                    <div className="font-mono text-white/60">5,000 Coins</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                    <div className="font-bold text-[#00F0FF]">Diamond</div>
                    <div className="font-mono text-white/60">10,000 Coins</div>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-400/10 border border-purple-400/30">
                    <div className="font-bold text-purple-300">Platinum</div>
                    <div className="font-mono text-white/60">100,000 Coins</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40">
                    <div className="font-bold text-[#FFD700]">Super Plat.</div>
                    <div className="font-mono text-white/80">&gt;100,000</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Passbook History */
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {wallet.transactions.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/50">
                  No transactions yet
                </div>
              ) : (
                wallet.transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm ${
                            isCredit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {tx.giftIcon ? tx.giftIcon : isCredit ? '🪙' : '🎁'}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{tx.description}</span>
                          <span className="text-[10px] text-white/50">{tx.timestamp}</span>
                        </div>
                      </div>

                      <span
                        className={`font-black font-mono text-sm ${
                          isCredit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isCredit ? '+' : '-'}{tx.amount}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
