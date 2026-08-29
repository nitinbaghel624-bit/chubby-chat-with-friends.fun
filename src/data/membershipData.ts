import { GiftItem, MembershipPlan, RankTier, UserWallet } from '../types';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan_49',
    priceInr: 49,
    coins: 200,
    title: 'Starter Club',
    tagline: 'Basic entry into Chubby VIP membership',
    badge: 'Bronze VIP',
    perks: ['200 Instant Coins', 'Verified VIP Badge in Chat', 'Unlock Gift Sending', 'No 4-Msg Chat Limit'],
    savings: 'Value Deal',
    gradient: 'from-[#6C3BFF] to-[#8C62FF]',
  },
  {
    id: 'plan_89',
    priceInr: 89,
    coins: 250,
    title: 'Silver Elite',
    tagline: 'Popular starter pack for active daters',
    badge: 'Silver VIP',
    perks: ['250 Instant Coins', 'Glowing Purple Border', 'Priority in Radar Nearby', 'Exclusive Voice Gifts'],
    savings: '15% Extra Coins',
    gradient: 'from-[#7E42FF] to-[#A855F7]',
  },
  {
    id: 'plan_149',
    priceInr: 149,
    coins: 350,
    title: 'Gold Star',
    tagline: 'Supercharge your dating & gifting power',
    badge: 'Gold VIP',
    perks: ['350 Instant Coins', 'Animated Crown in Profile', 'Read Receipts & Priority DM', 'Leaderboard Boost x1.2'],
    isPopular: true,
    savings: 'Best Seller',
    gradient: 'from-[#6C3BFF] via-[#9B51E0] to-[#FF3B80]',
  },
  {
    id: 'plan_199',
    priceInr: 199,
    coins: 500,
    title: 'Diamond Luxe',
    tagline: 'High tier perks with massive coin pack',
    badge: 'Diamond VIP',
    perks: ['500 Instant Coins', 'Diamond Badge in Leaderboard', 'Infinite Profile Rewinds', 'Exclusive Gift Animations'],
    savings: '30% Bonus Coins',
    gradient: 'from-[#9B51E0] to-[#FF007A]',
  },
  {
    id: 'plan_249',
    priceInr: 249,
    coins: 1000,
    title: 'Super Platinum VIP',
    tagline: 'Ultimate King & Queen package - 1000 Coins',
    badge: 'Super Platinum VIP',
    perks: ['1000 Massive Coins', 'Golden Spotlight Banner', 'Instant Global Top 10 Rank', 'All Super Gifts Unlocked'],
    savings: '🔥 4x Maximum Value',
    gradient: 'from-[#6C3BFF] via-[#FF007A] to-[#FFB800]',
  },
];

export const GIFTS_CATALOG: GiftItem[] = [
  {
    id: 'rose',
    name: 'Rose',
    coins: 7,
    icon: '🌹',
    lottieOrEmoji: '🌹',
    description: 'A sweet romantic gesture to break the ice',
    animationColor: '#FF2E63',
    rarity: 'Common',
  },
  {
    id: 'heart',
    name: 'Heart',
    coins: 15,
    icon: '💖',
    lottieOrEmoji: '💖',
    description: 'Show genuine love and adoration',
    animationColor: '#FF3366',
    rarity: 'Special',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    coins: 25,
    icon: '☕️',
    lottieOrEmoji: '☕️',
    description: 'Ask them out for a cozy warm brew',
    animationColor: '#D4A373',
    rarity: 'Rare',
  },
  {
    id: 'cake',
    name: 'Cake',
    coins: 50,
    icon: '🎂',
    lottieOrEmoji: '🎂',
    description: 'Celebrate a sweet connection together',
    animationColor: '#FF70A6',
    rarity: 'Epic',
  },
  {
    id: 'teddy',
    name: 'Teddy',
    coins: 100,
    icon: '🧸',
    lottieOrEmoji: '🧸',
    description: 'Cuddly soft teddy bear with animated hugs',
    animationColor: '#F4A261',
    rarity: 'Legendary',
  },
  {
    id: 'crown',
    name: 'Crown',
    coins: 150,
    icon: '👑',
    lottieOrEmoji: '👑',
    description: 'Crown your match with royal majesty',
    animationColor: '#FFD700',
    rarity: 'Mythic',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    coins: 250,
    icon: '💎',
    lottieOrEmoji: '💎',
    description: 'The supreme luxury gift of pure sparkle',
    animationColor: '#00F0FF',
    rarity: 'Divine',
  },
];

export interface RankInfo {
  tier: RankTier;
  minCoins: number;
  maxCoins: number | null;
  badge: string;
  color: string;
  bgGlow: string;
  icon: string;
  nextTier: RankTier | null;
}

export const RANK_TIERS: Record<RankTier, RankInfo> = {
  Non: {
    tier: 'Non',
    minCoins: 0,
    maxCoins: 999,
    badge: 'Novice Gifter',
    color: '#94A3B8',
    bgGlow: 'rgba(148, 163, 184, 0.2)',
    icon: '🌱',
    nextTier: 'Bronze',
  },
  Bronze: {
    tier: 'Bronze',
    minCoins: 1000,
    maxCoins: 4999,
    badge: 'Bronze Gifter',
    color: '#CD7F32',
    bgGlow: 'rgba(205, 127, 50, 0.35)',
    icon: '🥉',
    nextTier: 'Silver',
  },
  Silver: {
    tier: 'Silver',
    minCoins: 5000,
    maxCoins: 9999,
    badge: 'Silver Champion',
    color: '#E2E8F0',
    bgGlow: 'rgba(226, 232, 240, 0.4)',
    icon: '🥈',
    nextTier: 'Diamond',
  },
  Diamond: {
    tier: 'Diamond',
    minCoins: 10000,
    maxCoins: 99999,
    badge: 'Diamond Legend',
    color: '#00F0FF',
    bgGlow: 'rgba(0, 240, 255, 0.4)',
    icon: '💎',
    nextTier: 'Platinum',
  },
  Platinum: {
    tier: 'Platinum',
    minCoins: 100000,
    maxCoins: 100000,
    badge: 'Platinum Monarch',
    color: '#E5E4E2',
    bgGlow: 'rgba(229, 228, 226, 0.5)',
    icon: '🏆',
    nextTier: 'Super Platinum',
  },
  'Super Platinum': {
    tier: 'Super Platinum',
    minCoins: 100001,
    maxCoins: null,
    badge: 'Super Platinum God',
    color: '#FFD700',
    bgGlow: 'rgba(255, 215, 0, 0.6)',
    icon: '👑⚡️',
    nextTier: null,
  },
};

export function calculateRankTier(lifetimeCoins: number): RankTier {
  if (lifetimeCoins > 100000) return 'Super Platinum';
  if (lifetimeCoins === 100000) return 'Platinum';
  if (lifetimeCoins >= 10000) return 'Diamond';
  if (lifetimeCoins >= 5000) return 'Silver';
  if (lifetimeCoins >= 1000) return 'Bronze';
  return 'Non';
}

export function getNextRankProgress(lifetimeCoins: number): {
  currentTier: RankTier;
  nextTier: RankTier | null;
  currentCoins: number;
  targetCoins: number;
  percentage: number;
} {
  const currentTier = calculateRankTier(lifetimeCoins);
  const info = RANK_TIERS[currentTier];

  if (!info.nextTier) {
    return {
      currentTier,
      nextTier: null,
      currentCoins: lifetimeCoins,
      targetCoins: lifetimeCoins,
      percentage: 100,
    };
  }

  const nextTierInfo = RANK_TIERS[info.nextTier];
  const baseline = info.minCoins;
  const target = nextTierInfo.minCoins;
  const progress = Math.max(0, Math.min(100, ((lifetimeCoins - baseline) / (target - baseline)) * 100));

  return {
    currentTier,
    nextTier: info.nextTier,
    currentCoins: lifetimeCoins,
    targetCoins: target,
    percentage: Math.round(progress),
  };
}

export const INITIAL_USER_WALLET: UserWallet = {
  coinBalance: 500, // Starts with 500 coins so user can test gifting immediately
  lifetimeCoinsSent: 1250, // Starts at Bronze Tier
  lifetimeCoinsReceived: 450,
  isMember: true,
  activePlanId: 'plan_199',
  membershipExpiresAt: '2026-12-31',
  transactions: [
    {
      id: 'tx_init_1',
      type: 'credit',
      amount: 500,
      reason: 'membership_purchase',
      description: 'Diamond Luxe Membership (₹199)',
      inrAmount: 199,
      timestamp: 'Yesterday, 8:30 PM',
    },
    {
      id: 'tx_init_2',
      type: 'debit',
      amount: 250,
      reason: 'gift_sent',
      description: 'Sent Diamond to Elena Rostova',
      giftIcon: '💎',
      counterpartName: 'Elena Rostova',
      timestamp: 'Today, 10:15 AM',
    },
    {
      id: 'tx_init_3',
      type: 'credit',
      amount: 100,
      reason: 'gift_received',
      description: 'Received Teddy from Liam Chen',
      giftIcon: '🧸',
      counterpartName: 'Liam Chen',
      timestamp: 'Today, 11:40 AM',
    },
  ],
};
