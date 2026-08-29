import React, { useState } from 'react';
import {
  UserProfile,
  ChatThread,
  ChatMessage,
  AuthMethod,
  UserWallet,
  MembershipPlan,
  GiftItem,
  LeaderboardUser
} from './types';
import {
  CURRENT_USER,
  MOCK_USERS,
  INITIAL_CHAT_THREADS,
  INITIAL_LEADERBOARD_USERS
} from './data/mockData';
import { INITIAL_USER_WALLET, calculateRankTier, RANK_TIERS } from './data/membershipData';
import { PhoneFrame, TabType } from './components/phone/PhoneFrame';
import { HomeTab } from './components/tabs/HomeTab';
import { NearbyTab } from './components/tabs/NearbyTab';
import { ChatsTab } from './components/tabs/ChatsTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { LeaderboardTab } from './components/leaderboard/LeaderboardTab';
import { ChatRoomModal } from './components/chat/ChatRoomModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { ReportModal } from './components/modals/ReportModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { MembershipModal } from './components/membership/MembershipModal';
import { WalletModal } from './components/wallet/WalletModal';
import { GiftBottomSheet } from './components/chat/GiftBottomSheet';
import { CodeViewer } from './components/code/CodeViewer';
import { FirebaseSetupGuide } from './components/setup/FirebaseSetupGuide';
import {
  Smartphone,
  Code2,
  Database,
  Download,
  Sparkles,
  Layers,
  CheckCircle,
  Bell,
  Heart,
  Radar
} from 'lucide-react';
import { soundEffects } from './components/audio/audioSynthesizer';

type MainViewMode = 'app' | 'code' | 'firebase';

export default function App() {
  const [viewMode, setViewMode] = useState<MainViewMode>('app');
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_USER_WALLET);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD_USERS);

  // Active Modals / Overlays
  const [activeChatThread, setActiveChatThread] = useState<ChatThread | null>(null);
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);
  const [reportingUser, setReportingUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState<UserProfile | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    soundEffects.playReceive();
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for Membership & Wallet
  const handleOpenMembership = () => {
    soundEffects.playPop();
    setIsMembershipModalOpen(true);
  };

  const handleOpenWallet = () => {
    soundEffects.playPop();
    setIsWalletModalOpen(true);
  };

  const handleOpenGiftSheet = (target: UserProfile) => {
    soundEffects.playPop();
    setGiftRecipient(target);
  };

  const handlePurchasePlan = (plan: MembershipPlan) => {
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'credit' as const,
      amount: plan.coins,
      reason: 'membership_purchase' as const,
      description: `${plan.title} (₹${plan.priceInr})`,
      inrAmount: plan.priceInr,
      timestamp: 'Just now',
    };

    setWallet((prev) => ({
      ...prev,
      isMember: true,
      activePlanId: plan.id,
      coinBalance: prev.coinBalance + plan.coins,
      transactions: [newTx, ...prev.transactions],
    }));

    setCurrentUser((prev) => ({
      ...prev,
      isMember: true,
      membershipTier: plan.badge,
    }));

    setLeaderboardUsers((prev) =>
      prev.map((u) =>
        u.id === 'user_me'
          ? {
              ...u,
              isMember: true,
              membershipBadge: plan.badge,
            }
          : u
      )
    );

    showNotification(`🎉 VIP ${plan.title} activated! +${plan.coins} coins added to wallet.`);
  };

  const handleSendGift = (gift: GiftItem, count: number, totalCoins: number) => {
    if (!giftRecipient) return;

    const recipient = giftRecipient;

    // Deduct coins & update lifetime coins
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'debit' as const,
      amount: totalCoins,
      reason: 'gift_sent' as const,
      description: `Sent ${count > 1 ? `${count}x ` : ''}${gift.name} ${gift.icon} to ${recipient.name}`,
      giftIcon: gift.icon,
      counterpartName: recipient.name,
      timestamp: 'Just now',
    };

    const newLifetimeSent = (wallet.lifetimeCoinsSent || 0) + totalCoins;
    const newRank = calculateRankTier(newLifetimeSent + (wallet.lifetimeCoinsReceived || 0));

    setWallet((prev) => ({
      ...prev,
      coinBalance: Math.max(0, prev.coinBalance - totalCoins),
      lifetimeCoinsSent: newLifetimeSent,
      transactions: [newTx, ...prev.transactions],
    }));

    setCurrentUser((prev) => ({
      ...prev,
      lifetimeCoinsSent: newLifetimeSent,
      currentRankTier: newRank,
    }));

    // Send gift message into chat thread
    let existingThread = threads.find((t) => t.participant.id === recipient.id);
    const giftContent = `Sent ${count > 1 ? `${count}x ` : ''}${gift.name} ${gift.icon} (${totalCoins} Coins)`;

    if (existingThread) {
      handleSendMessage(existingThread.id, {
        senderId: 'user_me',
        receiverId: recipient.id,
        type: 'gift',
        content: giftContent,
        giftData: {
          giftId: gift.id,
          giftName: gift.name,
          icon: gift.icon,
          count,
          coinValue: gift.coins,
          totalCoins,
          animationColor: gift.animationColor,
        },
      });
    } else {
      const newThread: ChatThread = {
        id: `chat_${recipient.id}`,
        participant: recipient,
        lastMessage: {
          id: `msg_${Date.now()}`,
          senderId: 'user_me',
          receiverId: recipient.id,
          type: 'gift',
          content: giftContent,
          timestamp: 'Just now',
          isRead: true,
          giftData: {
            giftId: gift.id,
            giftName: gift.name,
            icon: gift.icon,
            count,
            coinValue: gift.coins,
            totalCoins,
            animationColor: gift.animationColor,
          },
        },
        unreadCount: 0,
        friendStatus: 'none',
        messageCountFromMe: 1,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: 'user_me',
            receiverId: recipient.id,
            type: 'gift',
            content: giftContent,
            timestamp: 'Just now',
            isRead: true,
            giftData: {
              giftId: gift.id,
              giftName: gift.name,
              icon: gift.icon,
              count,
              coinValue: gift.coins,
              totalCoins,
              animationColor: gift.animationColor,
            },
          },
        ],
      };
      setThreads((prev) => [newThread, ...prev]);
    }

    // Update real-time Leaderboard rankings
    setLeaderboardUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === 'user_me') {
          const userLifetime = (u.lifetimeCoinsSent || 0) + totalCoins;
          return {
            ...u,
            lifetimeCoinsSent: userLifetime,
            currentRankTier: calculateRankTier(userLifetime + (u.lifetimeCoinsReceived || 0)),
            recentGiftIcon: gift.icon,
          };
        }
        if (u.id === recipient.id) {
          const recipLifetimeRecv = (u.lifetimeCoinsReceived || 0) + totalCoins;
          return {
            ...u,
            lifetimeCoinsReceived: recipLifetimeRecv,
            currentRankTier: calculateRankTier((u.lifetimeCoinsSent || 0) + recipLifetimeRecv),
            recentGiftIcon: gift.icon,
          };
        }
        return u;
      });

      return updated;
    });

    showNotification(`🎁 Sent ${count > 1 ? `${count}x ` : ''}${gift.name} ${gift.icon} to ${recipient.name}!`);
  };

  // Chat Handlers
  const handleOpenThread = (thread: ChatThread) => {
    // Mark as read
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
    );
    setActiveChatThread({ ...thread, unreadCount: 0 });
  };

  const handleStartChatWithUser = (targetUser: UserProfile) => {
    const existing = threads.find((t) => t.participant.id === targetUser.id);
    if (existing) {
      handleOpenThread(existing);
    } else {
      const newThread: ChatThread = {
        id: `chat_${targetUser.id}`,
        participant: targetUser,
        lastMessage: {
          id: `msg_init_${Date.now()}`,
          senderId: 'user_me',
          receiverId: targetUser.id,
          type: 'text',
          content: 'Started new conversation',
          timestamp: 'Just now',
          isRead: true,
        },
        unreadCount: 0,
        friendStatus: 'none',
        messageCountFromMe: 0,
        messages: [],
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveChatThread(newThread);
    }
  };

  const handleSendMessage = (
    threadId: string,
    msgData: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>
  ) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const isFromMe = msgData.senderId === 'user_me';
          return {
            ...t,
            lastMessage: newMsg,
            messageCountFromMe: isFromMe ? t.messageCountFromMe + 1 : t.messageCountFromMe,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    if (activeChatThread && activeChatThread.id === threadId) {
      const isFromMe = msgData.senderId === 'user_me';
      setActiveChatThread((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: newMsg,
              messageCountFromMe: isFromMe ? prev.messageCountFromMe + 1 : prev.messageCountFromMe,
              messages: [...prev.messages, newMsg],
            }
          : null
      );
    }
  };

  // Friend Request system
  const handleSendFriendRequest = (targetUserId: string) => {
    soundEffects.playSend();
    setThreads((prev) =>
      prev.map((t) => {
        if (t.participant.id === targetUserId) {
          return { ...t, friendStatus: 'pending_sent' };
        }
        return t;
      })
    );
    if (activeChatThread && activeChatThread.participant.id === targetUserId) {
      setActiveChatThread((prev) => (prev ? { ...prev, friendStatus: 'pending_sent' } : null));
    }
    showNotification('Friend request sent! Unlocks unlimited chatting when accepted.');
  };

  const handleAcceptFriendRequest = (threadId: string) => {
    soundEffects.playPop();
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return { ...t, friendStatus: 'accepted' };
        }
        return t;
      })
    );
    if (activeChatThread && activeChatThread.id === threadId) {
      setActiveChatThread((prev) => (prev ? { ...prev, friendStatus: 'accepted' } : null));
    }
    showNotification('Friend request accepted! Unlimited chatting is now active.');
  };

  // Safety: Block & Report
  const handleBlockUser = (userToBlock: UserProfile) => {
    soundEffects.playPop();
    setCurrentUser((prev) => ({
      ...prev,
      blockedUserIds: [...prev.blockedUserIds, userToBlock.id],
    }));
    setUsers((prev) => prev.filter((u) => u.id !== userToBlock.id));
    setThreads((prev) => prev.filter((t) => t.participant.id !== userToBlock.id));
    setInspectingUser(null);
    showNotification(`${userToBlock.name} has been blocked.`);
  };

  const handleUnblockUser = (userId: string) => {
    soundEffects.playPop();
    setCurrentUser((prev) => ({
      ...prev,
      blockedUserIds: prev.blockedUserIds.filter((id) => id !== userId),
    }));
    showNotification('User unblocked successfully.');
  };

  const handleReportSubmit = (userId: string, reason: string) => {
    showNotification('Report submitted to safety moderators.');
  };

  const handleAuthSuccess = (
    method: AuthMethod,
    details: { phone?: string; email?: string; name: string }
  ) => {
    setCurrentUser((prev) => ({
      ...prev,
      name: details.name,
      phone: details.phone || prev.phone,
      email: details.email || prev.email,
    }));
    showNotification(`Signed in with ${method.toUpperCase()} successfully!`);
  };

  const unreadMessagesCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const pendingRequestsCount = threads.filter((t) => t.friendStatus === 'pending_received').length;

  return (
    <div className="min-h-screen bg-[#160021] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Platform Top Header */}
      <header className="px-6 py-4 bg-[#160021]/95 border-b border-white/10 backdrop-blur-xl sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E11299] to-[#00D1FF] p-0.5 shadow-[0_0_20px_rgba(225,18,153,0.35)]">
            <div className="w-full h-full rounded-[14px] bg-[#160021] flex items-center justify-center font-black text-white text-xl">
              CC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white font-['Syne',sans-serif]">
                CHUBBY <span className="text-[#E11299]">CHAT</span>
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E11299]/20 text-[#E11299] font-black border border-[#E11299]/40 uppercase tracking-widest">
                FLUTTER + FIREBASE
              </span>
            </div>
            <p className="text-[#00D1FF] font-bold tracking-widest uppercase text-[11px] mt-1">
              Production Ready Messaging • VIP Gifting & Coin Wallet • Nearby Radar
            </p>
          </div>
        </div>

        {/* Live Active Badge & View Mode Navigation Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl items-center gap-2.5 text-xs font-semibold text-white/90">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
            <span>2,481 Active Nearby</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setViewMode('app');
                soundEffects.playPop();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-2 transition-all ${
                viewMode === 'app'
                  ? 'bg-[#E11299] text-white shadow-[0_0_25px_rgba(225,18,153,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Interactive App</span>
            </button>

            <button
              onClick={() => {
                setViewMode('code');
                soundEffects.playPop();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-2 transition-all ${
                viewMode === 'code'
                  ? 'bg-[#E11299] text-white shadow-[0_0_25px_rgba(225,18,153,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Flutter Source</span>
            </button>

            <button
              onClick={() => {
                setViewMode('firebase');
                soundEffects.playPop();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-2 transition-all ${
                viewMode === 'firebase'
                  ? 'bg-[#E11299] text-white shadow-[0_0_25px_rgba(225,18,153,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Firebase Blueprint</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex p-4 md:p-6 overflow-hidden bg-[#160021] relative">
        <div className="absolute inset-0 dot-pattern-cyan opacity-10 pointer-events-none" />
        {viewMode === 'app' && (
          <div className="w-full flex items-center justify-center relative">
            <PhoneFrame
              currentTab={currentTab}
              onTabChange={(tab) => {
                soundEffects.playPop();
                setCurrentTab(tab);
              }}
              unreadMessagesCount={unreadMessagesCount}
              pendingRequestsCount={pendingRequestsCount}
            >
              {/* Tab 1: Home */}
              {currentTab === 'home' && (
                <HomeTab
                  currentUser={currentUser}
                  wallet={wallet}
                  users={users}
                  threads={threads}
                  onSelectUser={(u) => setInspectingUser(u)}
                  onStartChat={handleStartChatWithUser}
                  onSendFriendRequest={(u) => handleSendFriendRequest(u.id)}
                  onOpenNotifications={() => showNotification('No new unread system announcements.')}
                  onOpenMembership={handleOpenMembership}
                  onOpenWallet={handleOpenWallet}
                  onSendGiftDirect={handleOpenGiftSheet}
                />
              )}

              {/* Tab 2: Nearby Radar */}
              {currentTab === 'nearby' && (
                <NearbyTab
                  currentUser={currentUser}
                  users={users}
                  onSelectUser={(u) => setInspectingUser(u)}
                  onStartChat={handleStartChatWithUser}
                  onSendGiftDirect={handleOpenGiftSheet}
                />
              )}

              {/* Tab 3: Leaderboard (Hall of Fame) */}
              {currentTab === 'leaderboard' && (
                <LeaderboardTab
                  leaderboardUsers={leaderboardUsers}
                  onOpenGiftSheetForUser={handleOpenGiftSheet}
                  onOpenWallet={handleOpenWallet}
                  onOpenMembership={handleOpenMembership}
                  currentUserWalletBalance={wallet.coinBalance}
                />
              )}

              {/* Tab 4: Chats */}
              {currentTab === 'chats' && (
                <ChatsTab
                  threads={threads}
                  onOpenThread={handleOpenThread}
                  onAcceptFriendRequest={handleAcceptFriendRequest}
                  onNewChatClick={() => setCurrentTab('nearby')}
                />
              )}

              {/* Tab 5: Profile */}
              {currentTab === 'profile' && (
                <ProfileTab
                  user={currentUser}
                  wallet={wallet}
                  blockedUsers={MOCK_USERS.filter((u) => currentUser.blockedUserIds.includes(u.id))}
                  onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
                  onOpenEditModal={() => setIsEditProfileOpen(true)}
                  onUnblockUser={handleUnblockUser}
                  onSignOut={() => setIsAuthModalOpen(true)}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onOpenMembership={handleOpenMembership}
                  onOpenWallet={handleOpenWallet}
                />
              )}

              {/* Real-time 1-on-1 Chat Room Modal */}
              {activeChatThread && (
                <ChatRoomModal
                  thread={activeChatThread}
                  onClose={() => setActiveChatThread(null)}
                  onSendMessage={handleSendMessage}
                  onSendFriendRequest={handleSendFriendRequest}
                  onAcceptFriendRequest={handleAcceptFriendRequest}
                  onReportUser={(u) => setReportingUser(u)}
                  onBlockUser={handleBlockUser}
                  onViewProfile={(u) => setInspectingUser(u)}
                  onOpenGiftSheet={() => handleOpenGiftSheet(activeChatThread.participant)}
                  onOpenMembership={handleOpenMembership}
                  userCoinBalance={wallet.coinBalance}
                />
              )}
            </PhoneFrame>
          </div>
        )}

        {viewMode === 'code' && <CodeViewer />}

        {viewMode === 'firebase' && <FirebaseSetupGuide />}
      </main>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1d143b] border border-[#ff2d75]/50 text-white shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="p-2 rounded-xl bg-[#ff2d75]/20 text-[#ff2d75]">
            <Bell className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <UserProfileModal
        user={inspectingUser}
        onClose={() => setInspectingUser(null)}
        onStartChat={handleStartChatWithUser}
        onSendFriendRequest={(u) => handleSendFriendRequest(u.id)}
        onReport={(u) => {
          setInspectingUser(null);
          setReportingUser(u);
        }}
        onBlock={handleBlockUser}
        onSendGift={handleOpenGiftSheet}
        friendStatus={inspectingUser ? (threads.find((t) => t.participant.id === inspectingUser.id)?.friendStatus || 'none') : 'none'}
      />

      <ReportModal
        user={reportingUser}
        onClose={() => setReportingUser(null)}
        onSubmitReport={handleReportSubmit}
      />

      <EditProfileModal
        user={currentUser}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(updated) => {
          setCurrentUser((prev) => ({ ...prev, ...updated }));
          showNotification('Profile updated successfully!');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* VIP Membership Modal */}
      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        onSelectPlan={handlePurchasePlan}
        currentPlanId={wallet.activePlanId}
        isMember={wallet.isMember}
        userCoinBalance={wallet.coinBalance}
      />

      {/* Wallet Passbook & Ranking Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onOpenMembership={() => {
          setIsWalletModalOpen(false);
          setIsMembershipModalOpen(true);
        }}
      />

      {/* Gift Bottom Sheet */}
      {giftRecipient && (
        <GiftBottomSheet
          isOpen={!!giftRecipient}
          onClose={() => setGiftRecipient(null)}
          recipient={giftRecipient}
          userCoinBalance={wallet.coinBalance}
          isMember={wallet.isMember}
          onOpenMembership={() => {
            setGiftRecipient(null);
            setIsMembershipModalOpen(true);
          }}
          onSendGift={handleSendGift}
        />
      )}
    </div>
  );
}
