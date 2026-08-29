export type Gender = 'female' | 'male' | 'non-binary' | 'other';
export type MessageType = 'text' | 'image' | 'voice' | 'video' | 'gift';
export type FriendStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'blocked';
export type AuthMethod = 'phone' | 'email' | 'google';

export type RankTier = 'Non' | 'Bronze' | 'Silver' | 'Diamond' | 'Platinum' | 'Super Platinum';

export interface GiftItem {
  id: 'rose' | 'heart' | 'coffee' | 'cake' | 'teddy' | 'crown' | 'diamond';
  name: string;
  coins: number;
  icon: string;
  lottieOrEmoji: string;
  description: string;
  animationColor: string;
  rarity: 'Common' | 'Special' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Divine';
}

export interface MembershipPlan {
  id: string;
  priceInr: number;
  coins: number;
  title: string;
  tagline: string;
  badge: string;
  perks: string[];
  isPopular?: boolean;
  savings?: string;
  gradient: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: 'membership_purchase' | 'gift_sent' | 'gift_received' | 'bonus_reward';
  description: string;
  timestamp: string;
  inrAmount?: number;
  giftIcon?: string;
  counterpartName?: string;
}

export interface UserWallet {
  coinBalance: number;
  lifetimeCoinsSent: number;
  lifetimeCoinsReceived: number;
  isMember: boolean;
  activePlanId?: string;
  membershipExpiresAt?: string;
  transactions: WalletTransaction[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  age: number;
  city: string;
  isOnline: boolean;
  isMember: boolean;
  membershipBadge?: string;
  lifetimeCoinsSent: number;
  lifetimeCoinsReceived: number;
  currentRankTier: RankTier;
  rank: number;
  recentGiftIcon?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  dob: string;
  age: number;
  gender: Gender;
  isOnline: boolean;
  lastActive: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  distanceKm?: number;
  phone?: string;
  email?: string;
  isVerified?: boolean;
  photos: string[];
  interests: string[];
  blockedUserIds: string[];
  // Membership & Gift metadata
  isMember?: boolean;
  membershipTier?: string;
  lifetimeCoinsSent?: number;
  lifetimeCoinsReceived?: number;
  rankTier?: RankTier;
}

export interface ChatGiftData {
  giftId: string;
  giftName: string;
  coinValue: number;
  icon: string;
  count: number;
  totalCoins: number;
  animationColor?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  mediaDuration?: number; // for voice/video in seconds
  giftData?: ChatGiftData;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  participant: UserProfile;
  lastMessage: ChatMessage;
  unreadCount: number;
  messages: ChatMessage[];
  messageCountFromMe: number;
  friendStatus: FriendStatus;
  isPinned?: boolean;
}

export interface FlutterFile {
  path: string;
  filename: string;
  language: string;
  description: string;
  category: 'core' | 'features' | 'config' | 'firebase' | 'kotlin_compose';
  code: string;
}

