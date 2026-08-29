import React from 'react';
import { Flame, Database, Shield, Smartphone, Globe, Bell, Key, Copy, Check, Gift, Crown, Trophy, Coins } from 'lucide-react';

export const FirebaseSetupGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copySnippet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6 text-white bg-[#0E0720] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-[#170D38] border border-[#6C3BFF]/30 shadow-xl flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-[#6C3BFF]/20 text-[#6C3BFF] border border-[#6C3BFF]/30 shrink-0 shadow-[0_0_15px_rgba(108,59,255,0.3)]">
          <Flame className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 font-['Syne',sans-serif] tracking-tight">
            FIREBASE & FIRESTORE BACKEND ARCHITECTURE
          </h2>
          <p className="text-xs text-white/70 mt-1 leading-relaxed font-medium">
            Chubby Chat leverages <strong>Cloud Firestore</strong> for real-time 1-to-1 chat subscriptions,
            <strong> VIP Membership verification</strong>, <strong>Coin Wallet transactions</strong>, <strong>Virtual Gifts</strong>,
            and an automatic <strong>Hall of Fame Leaderboard</strong>.
          </p>
        </div>
      </div>

      {/* Firestore Data Schema */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00D1FF]" /> Cloud Firestore Collections & Schemas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* wallets collection */}
          <div className="p-4 rounded-2xl bg-[#170D38] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#FFD700] font-mono">/wallets/{'{userId}'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60 font-black uppercase">Coins & VIP Wallet</span>
            </div>
            <pre className="text-[11px] font-mono text-white/90 bg-[#070312] p-3 rounded-xl overflow-x-auto border border-white/5">
{`{
  "userId": "user_me",
  "userName": "Elena Rostova",
  "userAvatar": "https://...",
  "isMember": true,
  "membershipPlan": "plan_199",
  "coinBalance": 650,
  "lifetimeCoinsSent": 12850,
  "lifetimeCoinsReceived": 28400,
  "totalGiftsSent": 48,
  "totalGiftsReceived": 89,
  "rankTier": "DIAMOND", // Automatic from lifetime
  "updatedAt": Timestamp
}`}
            </pre>
          </div>

          {/* transactions subcollection */}
          <div className="p-4 rounded-2xl bg-[#170D38] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#6C3BFF] font-mono">/wallets/{'{uid}'}/transactions/{'{txId}'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60 font-black uppercase">Coin Passbook</span>
            </div>
            <pre className="text-[11px] font-mono text-white/90 bg-[#070312] p-3 rounded-xl overflow-x-auto border border-white/5">
{`{
  "id": "tx_839102",
  "type": "gift_sent" | "gift_received" | "membership_recharge",
  "amount": -150, // Coins deducted or added
  "giftName": "Crown",
  "giftIcon": "👑",
  "counterpartId": "user_2",
  "counterpartName": "Aarav Sharma",
  "timestamp": Timestamp
}`}
            </pre>
          </div>

          {/* chats/messages with gift support */}
          <div className="p-4 rounded-2xl bg-[#170D38] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#00D1FF] font-mono">/chats/{'{chatId}'}/messages/{'{msgId}'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60 font-black uppercase">Gift Messages</span>
            </div>
            <pre className="text-[11px] font-mono text-white/90 bg-[#070312] p-3 rounded-xl overflow-x-auto border border-white/5">
{`{
  "senderId": "user_me",
  "receiverId": "user_2",
  "type": "gift" | "text" | "voice" | "image" | "video",
  "content": "Sent 1 Crown 👑",
  "giftData": {
    "giftId": "gift_crown",
    "giftName": "Crown",
    "icon": "👑",
    "count": 1,
    "coinValue": 150,
    "totalCoins": 150
  },
  "timestamp": Timestamp,
  "isRead": false
}`}
            </pre>
          </div>

          {/* users profile */}
          <div className="p-4 rounded-2xl bg-[#170D38] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#FF3B80] font-mono">/users/{'{userId}'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60 font-black uppercase">User Profile</span>
            </div>
            <pre className="text-[11px] font-mono text-white/90 bg-[#070312] p-3 rounded-xl overflow-x-auto border border-white/5">
{`{
  "name": "Elena Rostova",
  "isMember": true,
  "coinBalance": 650,
  "rankTier": "DIAMOND",
  "gender": "female",
  "isOnline": true,
  "location": GeoPoint(37.78, -122.41),
  "city": "San Francisco",
  "blockedUserIds": []
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Rules & Business Logic Card */}
      <div className="p-5 rounded-2xl bg-[#170D38] border border-[#6C3BFF]/30 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-white/80 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00D1FF]" /> Membership, Gifts & Leaderboard Business Rules
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#FFD700] font-black">
              <Crown className="w-3.5 h-3.5" />
              <span>1. Membership Rule</span>
            </div>
            <p className="text-white/70 text-[11px]">
              Only active VIP members (Plans ₹49 – ₹249) can purchase coins and send virtual gifts.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#FF3B80] font-black">
              <Gift className="w-3.5 h-3.5" />
              <span>2. Atomic Gift Transfer</span>
            </div>
            <p className="text-white/70 text-[11px]">
              Sending a gift (Rose 7, Heart 15, Coffee 25, Cake 50, Teddy 100, Crown 150, Diamond 250) instantly deducts sender coins, credits receiver coins, and posts into chat.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#00D1FF] font-black">
              <Trophy className="w-3.5 h-3.5" />
              <span>3. Live Leaderboard & Ranks</span>
            </div>
            <p className="text-white/70 text-[11px]">
              Lifetime coins are persisted to determine Rank Tiers: Non (0), Bronze (1000), Silver (5000), Diamond (10000), Platinum (100000), Super Platinum (&gt;100000).
            </p>
          </div>
        </div>
      </div>

      {/* Quick Setup CLI Commands */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#00D1FF]" /> CLI Setup & Deployment Commands
        </h3>

        {[
          {
            title: '1. Deploy Firestore Security Rules & Indexes',
            cmd: 'firebase deploy --only firestore:rules,firestore:indexes',
          },
          {
            title: '2. Flutter / Android Firebase Configuration',
            cmd: 'flutterfire configure --project=YOUR_FIREBASE_PROJECT_ID',
          },
          {
            title: '3. Enable Google Maps API Key',
            cmd: '# Android: android/app/src/main/AndroidManifest.xml\n<meta-data android:name="com.google.android.geo.API_KEY" android:value="YOUR_KEY"/>\n\n# iOS: ios/Runner/AppDelegate.swift\nGMSServices.provideAPIKey("YOUR_KEY")',
          },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#170D38] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">{item.title}</span>
              <button
                onClick={() => copySnippet(item.cmd, idx)}
                className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 border border-white/10"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-[#00D1FF] stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-[#00D1FF] bg-[#070312] p-3 rounded-xl overflow-x-auto whitespace-pre border border-white/5">
              {item.cmd}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
