import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, CreditCard, Smartphone } from 'lucide-react';
import { MembershipPlan } from '../../types';
import { MEMBERSHIP_PLANS } from '../../data/membershipData';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: MembershipPlan) => void;
  currentPlanId?: string;
  isMember: boolean;
  userCoinBalance: number;
}

export const MembershipModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectPlan,
  currentPlanId,
  isMember,
  userCoinBalance,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>(
    MEMBERSHIP_PLANS.find((p) => p.isPopular) || MEMBERSHIP_PLANS[2]
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    soundEffects.playPop();

    setTimeout(() => {
      setIsProcessing(false);
      soundEffects.playGiftFanfare();
      soundEffects.playCoinChime();
      onSelectPlan(selectedPlan);
      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="w-full max-w-lg bg-[#0E0720] border border-[#6C3BFF]/40 rounded-3xl p-6 text-white shadow-[0_0_50px_rgba(108,59,255,0.35)] relative max-h-[90vh] overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Close Button */}
          <button
            id="close-membership-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/60 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Header Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] shadow-[0_0_25px_rgba(108,59,255,0.6)] mb-3">
              <Crown className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight font-['Syne',sans-serif] uppercase">
              Chubby VIP Membership
            </h2>
            <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto font-medium">
              Only members can purchase coins & unlock premium virtual gifting, animated perks, and leaderboard rankings!
            </p>

            {/* Current Balance Bar */}
            <div className="mt-3 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#170D38] border border-[#6C3BFF]/30">
              <span className="text-[11px] font-bold text-white/70">Current Balance:</span>
              <span className="text-xs font-black text-[#FFD700] flex items-center gap-1 font-mono">
                🪙 {userCoinBalance} Coins
              </span>
              {isMember && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#6C3BFF] text-white">
                  VIP Active
                </span>
              )}
            </div>
          </div>

          {/* Membership Plans List */}
          <div className="space-y-3 mb-6">
            <label className="text-[11px] font-black uppercase tracking-widest text-white/60 block">
              Select Your Coin & VIP Plan
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {MEMBERSHIP_PLANS.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                const isCurrent = currentPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    id={`plan-card-${plan.id}`}
                    onClick={() => {
                      setSelectedPlan(plan);
                      soundEffects.playPop();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1D0F47] border-[#6C3BFF] shadow-[0_0_20px_rgba(108,59,255,0.4)] scale-[1.01]'
                        : 'bg-[#140A2E]/60 border-white/10 hover:border-[#6C3BFF]/40 hover:bg-[#170D38]'
                    }`}
                  >
                    {/* Background glow on selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6C3BFF]/15 to-transparent pointer-events-none" />
                    )}

                    <div className="flex items-center gap-3.5 relative z-10">
                      {/* Radio Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#6C3BFF] bg-[#6C3BFF]' : 'border-white/30'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white font-['Syne',sans-serif]">
                            {plan.title}
                          </span>
                          {plan.isPopular && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF3B80] to-[#6C3BFF] text-white">
                              {plan.savings}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              Current Plan
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/60 font-medium">{plan.tagline}</p>
                      </div>
                    </div>

                    <div className="text-right relative z-10">
                      <div className="text-lg font-black text-[#FFD700] font-mono">
                        🪙 {plan.coins}
                      </div>
                      <div className="text-xs font-black text-white/90">
                        ₹{plan.priceInr}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Plan Perks */}
          <div className="p-4 rounded-2xl bg-[#140A2E] border border-white/10 mb-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#6C3BFF] flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-[#FFD700]" /> Included VIP Privileges ({selectedPlan.badge}):
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedPlan.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D1FF] shrink-0" />
                  <span className="text-[11px] font-semibold">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6 space-y-2.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-white/60 block">
              Payment Gateway Simulation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="payment-upi-btn"
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-black transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#6C3BFF] text-white border-[#6C3BFF] shadow-[0_0_12px_rgba(108,59,255,0.4)]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI / QR Pay
              </button>
              <button
                id="payment-card-btn"
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-black transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#6C3BFF] text-white border-[#6C3BFF] shadow-[0_0_12px_rgba(108,59,255,0.4)]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card / NetBanking
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="flex items-center justify-around p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                {(['gpay', 'phonepe', 'paytm'] as const).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiApp(app)}
                    className={`px-3 py-1 rounded-lg uppercase text-[10px] font-black transition-all ${
                      upiApp === app ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : 'Paytm'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Checkout CTA */}
          <button
            id="confirm-membership-checkout-btn"
            disabled={isProcessing}
            onClick={handleConfirmPurchase}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#8C62FF] to-[#FF3B80] hover:opacity-95 text-white text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(108,59,255,0.6)] flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing ₹{selectedPlan.priceInr}...</span>
              </div>
            ) : (
              <>
                <span>Pay ₹{selectedPlan.priceInr} & Get {selectedPlan.coins} Coins</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>

          {/* Security Guarantee */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span>256-Bit Encrypted Secure Checkout • Instant Coin Delivery</span>
          </div>

          {/* Success Overlay Toast */}
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 bg-[#0E0720]/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] flex items-center justify-center text-3xl mb-4 shadow-[0_0_30px_rgba(108,59,255,0.8)]">
                🎉
              </div>
              <h3 className="text-xl font-black text-white font-['Syne',sans-serif]">
                VIP MEMBERSHIP UNLOCKED!
              </h3>
              <p className="text-sm font-bold text-[#FFD700] mt-1 font-mono">
                +{selectedPlan.coins} Coins Credited Instantly
              </p>
              <p className="text-xs text-white/70 mt-2">
                Your rank and gifts are now ready to use!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
