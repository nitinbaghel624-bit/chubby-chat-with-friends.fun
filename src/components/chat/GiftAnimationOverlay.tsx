import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown } from 'lucide-react';
import { ChatGiftData } from '../../types';

interface Props {
  giftData: ChatGiftData | null;
  senderName: string;
  receiverName: string;
  onComplete: () => void;
}

export const GiftAnimationOverlay: React.FC<Props> = ({
  giftData,
  senderName,
  receiverName,
  onComplete,
}) => {
  useEffect(() => {
    if (giftData) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [giftData, onComplete]);

  if (!giftData) return null;

  // Generate floating emojis
  const particles = Array.from({ length: 18 });

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
        {/* Floating backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0E0720]/60 backdrop-blur-[2px]"
        />

        {/* Floating animated particles */}
        {particles.map((_, i) => {
          const randomX = (Math.random() - 0.5) * 320;
          const randomDelay = Math.random() * 0.4;
          const randomDuration = 1.6 + Math.random() * 0.8;
          const scale = 0.7 + Math.random() * 0.9;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 150, x: randomX * 0.3, scale: 0.4 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -250 - Math.random() * 100,
                x: randomX,
                scale: [0.4, scale, scale * 1.2, 0.2],
                rotate: (Math.random() - 0.5) * 90,
              }}
              transition={{
                duration: randomDuration,
                delay: randomDelay,
                ease: 'easeOut',
              }}
              className="absolute text-4xl select-none"
            >
              {giftData.icon}
            </motion.div>
          );
        })}

        {/* Centered Celebration Banner */}
        <motion.div
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          animate={{ scale: [0, 1.15, 1], rotate: [ -15, 5, 0 ], opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="relative z-10 px-6 py-5 rounded-3xl bg-gradient-to-tr from-[#170D38] via-[#231252] to-[#170D38] border-2 border-[#6C3BFF] text-center shadow-[0_0_40px_rgba(108,59,255,0.8)] mx-4"
        >
          <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-bounce mb-2">
            {giftData.icon}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00D1FF] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GIFT RECEIVED!</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h3 className="text-xl font-black text-white font-['Syne',sans-serif] tracking-tight">
            {giftData.count > 1 ? `${giftData.count}x ` : ''}{giftData.giftName}
          </h3>

          <div className="mt-2 text-xs text-white/80 font-medium">
            <span className="font-bold text-[#FFD700]">{senderName}</span> sent to{' '}
            <span className="font-bold text-[#00D1FF]">{receiverName}</span>
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C3BFF]/30 border border-[#6C3BFF]/60 text-[11px] font-black text-[#FFD700] font-mono">
            🪙 +{giftData.totalCoins} Lifetime Coins
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
