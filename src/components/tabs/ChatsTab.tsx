import React, { useState } from 'react';
import { ChatThread, UserProfile } from '../../types';
import { Search, MessageSquarePlus, Mic, Image as ImageIcon, Video, Pin, CheckCheck, UserCheck, Sparkles, UserPlus, Gift, Crown } from 'lucide-react';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  threads: ChatThread[];
  onOpenThread: (thread: ChatThread) => void;
  onAcceptFriendRequest: (threadId: string) => void;
  onNewChatClick: () => void;
}

export const ChatsTab: React.FC<Props> = ({
  threads,
  onOpenThread,
  onAcceptFriendRequest,
  onNewChatClick,
}) => {
  const [search, setSearch] = useState('');

  const filteredThreads = threads.filter(
    (t) =>
      t.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      t.lastMessage.content.toLowerCase().includes(search.toLowerCase())
  );

  const pendingReceivedThreads = threads.filter((t) => t.friendStatus === 'pending_received');

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-white bg-[#0E0720] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar */}
      <div className="px-4 py-3.5 bg-[#170D38] border-b border-[#6C3BFF]/25 flex items-center justify-between shrink-0 shadow-lg">
        <div>
          <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2 font-['Syne',sans-serif]">
            MESSAGES
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6C3BFF]/20 text-[#6C3BFF] font-black border border-[#6C3BFF]/40 tracking-wider">
              {threads.length}
            </span>
          </h2>
          <p className="text-[10px] text-[#00D1FF] font-bold uppercase tracking-wider">Real-time 1-to-1 conversations</p>
        </div>

        <button
          onClick={onNewChatClick}
          className="p-2.5 rounded-2xl bg-[#6C3BFF] text-white shadow-[0_0_20px_rgba(108,59,255,0.4)] hover:bg-[#8C62FF] transition-all"
        >
          <MessageSquarePlus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Pending Friend Requests Notification Banner */}
      {pendingReceivedThreads.length > 0 && (
        <div className="p-3 bg-white/5 border-b border-[#6C3BFF]/30 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
              <UserPlus className="w-4 h-4 text-[#00D1FF]" />
              Requests Received ({pendingReceivedThreads.length})
            </span>
            <span className="text-[9px] text-[#6C3BFF] font-black uppercase tracking-wider">Unlocks Chat</span>
          </div>

          <div className="space-y-2">
            {pendingReceivedThreads.map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-2xl bg-white/5 flex items-center justify-between border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={t.participant.avatar}
                    alt={t.participant.name}
                    className="w-8 h-8 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h5 className="text-xs font-black text-white font-['Syne',sans-serif]">{t.participant.name}</h5>
                    <p className="text-[10px] text-white/60">Sent you a friend request</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      onAcceptFriendRequest(t.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#00D1FF] hover:bg-[#38d9ff] text-black text-[10px] font-black uppercase tracking-wider shadow"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-3 bg-[#170D38]/60 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6C3BFF]"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 pb-20">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Sparkles className="w-10 h-10 text-white/20 mx-auto" />
            <p className="text-xs text-white/60">No active conversations match.</p>
            <button
              onClick={onNewChatClick}
              className="text-xs text-[#6C3BFF] font-black uppercase tracking-wider underline"
            >
              Find nearby users to start chatting
            </button>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const { participant, lastMessage, unreadCount, isPinned, friendStatus, messageCountFromMe } = thread;
            const isFriend = friendStatus === 'accepted';

            return (
              <div
                key={thread.id}
                onClick={() => {
                  soundEffects.playPop();
                  onOpenThread(thread);
                }}
                className={`p-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${
                  unreadCount > 0 ? 'bg-white/5' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-white/15"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0E0720] ${
                      participant.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black text-white truncate flex items-center gap-1.5 font-['Syne',sans-serif]">
                      {participant.name}
                      {participant.isMember && <Crown className="w-3 h-3 text-[#FFD700]" />}
                      {isFriend ? (
                        <UserCheck className="w-3.5 h-3.5 text-[#00D1FF]" title="Friend" />
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-white/70 border border-white/10 font-bold uppercase">
                          {messageCountFromMe}/4 used
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-white/50 shrink-0 font-mono">
                      {lastMessage.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-white/60 truncate">
                      {lastMessage.type === 'gift' && (
                        <span className="text-[#FFD700] flex items-center gap-1 font-bold">
                          <Gift className="w-3.5 h-3.5" />
                          <span>Gift: {lastMessage.giftData?.giftName || 'Virtual Gift'}</span>
                        </span>
                      )}
                      {lastMessage.type === 'voice' && (
                        <span className="text-[#FF3B80] flex items-center gap-1 font-bold">
                          <Mic className="w-3.5 h-3.5" /> Voice note
                        </span>
                      )}
                      {lastMessage.type === 'image' && (
                        <span className="text-[#00D1FF] flex items-center gap-1 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" /> Photo
                        </span>
                      )}
                      {lastMessage.type === 'video' && (
                        <span className="text-[#FF3B80] flex items-center gap-1 font-bold">
                          <Video className="w-3.5 h-3.5" /> Video
                        </span>
                      )}
                      {lastMessage.type === 'text' && (
                        <span className="truncate">{lastMessage.content}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {isPinned && <Pin className="w-3 h-3 text-[#6C3BFF] fill-current" />}
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#6C3BFF] text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(108,59,255,0.7)]">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
