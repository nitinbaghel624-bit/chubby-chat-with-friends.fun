import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatThread, MessageType, ChatMessage } from '../../types';
import {
  ArrowLeft,
  Send,
  Mic,
  Image as ImageIcon,
  Video,
  MoreVertical,
  UserPlus,
  Play,
  Pause,
  Info,
  ShieldAlert,
  Ban,
  CheckCheck,
  Sparkles,
  Smile,
  Gift,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  thread: ChatThread;
  onClose: () => void;
  onSendMessage: (threadId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  onSendFriendRequest: (userId: string) => void;
  onAcceptFriendRequest: (threadId: string) => void;
  onReportUser: (user: UserProfile) => void;
  onBlockUser: (user: UserProfile) => void;
  onViewProfile: (user: UserProfile) => void;
  onOpenGiftSheet: () => void;
  onOpenMembership: () => void;
  userCoinBalance: number;
}

export const ChatRoomModal: React.FC<Props> = ({
  thread,
  onClose,
  onSendMessage,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onReportUser,
  onBlockUser,
  onViewProfile,
  onOpenGiftSheet,
  onOpenMembership,
  userCoinBalance,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const { participant, messages, messageCountFromMe, friendStatus } = thread;
  const isFriend = friendStatus === 'accepted';
  const isPendingSent = friendStatus === 'pending_sent';
  const isPendingReceived = friendStatus === 'pending_received';
  const freeMessagesLeft = Math.max(0, 4 - messageCountFromMe);
  const isLimitReached = !isFriend && messageCountFromMe >= 4;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (isLimitReached) {
      soundEffects.playPop();
      return;
    }

    const text = inputText.trim();
    setInputText('');
    soundEffects.playSend();

    onSendMessage(thread.id, {
      senderId: 'user_me',
      receiverId: participant.id,
      type: 'text',
      content: text,
    });

    // Simulate real-time active reply from other user!
    triggerAutoReply(text);
  };

  const triggerAutoReply = (userText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      soundEffects.playReceive();

      const responses = [
        `That sounds really interesting! Tell me more about that 😊`,
        `Totally agree! We definitely have similar taste! ✨`,
        `Haha love that! Have you been around ${participant.location.city} lately?`,
        `I’d love to connect more! Don't forget to send a gift or friend request so we can chat unlimited! 💖`,
        `Nice! Let me send you a voice note in a sec! 🎧`,
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];

      onSendMessage(thread.id, {
        senderId: participant.id,
        receiverId: 'user_me',
        type: 'text',
        content: reply,
      });
    }, 1800);
  };

  // Voice note recording simulation
  const toggleRecording = () => {
    if (isLimitReached) return;

    if (isRecording) {
      // Finish recording
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      soundEffects.playSend();

      onSendMessage(thread.id, {
        senderId: 'user_me',
        receiverId: participant.id,
        type: 'voice',
        content: `Voice note (0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 4})`,
        mediaDuration: recordingSeconds || 4,
      });
      setRecordingSeconds(0);
    } else {
      // Start recording
      soundEffects.playPop();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        soundEffects.playVoiceTone(400 + Math.random() * 80, 0.05);
      }, 1000);
    }
  };

  const handlePlayVoice = (msgId: string, duration = 4) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      soundEffects.playVoiceTone(520, duration * 0.1);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, duration * 1000);
    }
  };

  const sendSampleImage = (url: string) => {
    if (isLimitReached) return;
    setShowMediaPicker(false);
    soundEffects.playSend();
    onSendMessage(thread.id, {
      senderId: 'user_me',
      receiverId: participant.id,
      type: 'image',
      content: 'Shared a photo',
      mediaUrl: url,
    });
  };

  const sendSampleVideo = () => {
    if (isLimitReached) return;
    setShowMediaPicker(false);
    soundEffects.playSend();
    onSendMessage(thread.id, {
      senderId: 'user_me',
      receiverId: participant.id,
      type: 'video',
      content: 'Shared a video clip',
      mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      mediaDuration: 12,
    });
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#0E0720] flex flex-col text-white animate-fadeIn overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <div className="px-4 py-3 bg-[#170D38] border-b border-[#6C3BFF]/30 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div
            onClick={() => onViewProfile(participant)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#6C3BFF]"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0E0720] ${
                  participant.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
            </div>
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5 font-['Syne',sans-serif]">
                {participant.name}
                {isFriend && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] font-black uppercase tracking-wider border border-[#00D1FF]/40">
                    Friend
                  </span>
                )}
              </h4>
              <p className="text-[10px] text-white/60 font-medium">
                {participant.isOnline ? 'Active now' : participant.lastActive}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Gift Button in Header */}
          <button
            id="chat-header-send-gift-btn"
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenGiftSheet();
            }}
            className="p-2 rounded-xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] hover:opacity-90 text-white shadow-[0_0_12px_rgba(108,59,255,0.4)] flex items-center gap-1 text-xs font-black uppercase tracking-wider transition-transform active:scale-95"
            title="Send Gift"
          >
            <Gift className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline text-[10px]">Gift</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#170D38] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 text-xs font-black uppercase tracking-wider text-white">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onViewProfile(participant);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[#00D1FF]"
                >
                  <Sparkles className="w-4 h-4" /> View Profile
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenGiftSheet();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[#FFD700]"
                >
                  <Gift className="w-4 h-4" /> Send Gift (Coins)
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onReportUser(participant);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-white/10 text-rose-400 flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Report User
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onBlockUser(participant);
                    onClose();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-white/10 text-rose-400 flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" /> Block User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Free Messages Progress or Friend Request Bar */}
      {!isFriend && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-white/80 font-medium">
            <Info className="w-4 h-4 text-[#00D1FF]" />
            <span>
              {isLimitReached ? (
                <strong className="text-rose-400 font-black uppercase tracking-wider">Free limit reached (4/4 used)</strong>
              ) : (
                <span>
                  Preview: <strong className="text-white font-black">{messageCountFromMe} of 4</strong> free messages used
                </span>
              )}
            </span>
          </div>

          {isPendingReceived ? (
            <button
              onClick={() => onAcceptFriendRequest(thread.id)}
              className="px-3 py-1 rounded-xl bg-[#00D1FF] hover:bg-[#38d9ff] text-black text-[10px] font-black uppercase tracking-wider shadow"
            >
              Accept Request
            </button>
          ) : isPendingSent ? (
            <span className="text-[10px] text-[#00D1FF] font-black uppercase tracking-wider">Request Pending</span>
          ) : (
            <button
              onClick={() => onSendFriendRequest(participant.id)}
              className="px-3 py-1 rounded-xl bg-[#6C3BFF] hover:bg-[#8C62FF] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(108,59,255,0.4)]"
            >
              <UserPlus className="w-3 h-3" />
              Add Friend
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center my-2">
          <span className="text-[9px] uppercase tracking-widest font-black text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Encrypted 1-to-1 Chubby Chat
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'user_me';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                  msg.type === 'gift'
                    ? 'bg-gradient-to-r from-[#1F0E4D] via-[#2D126B] to-[#1F0E4D] border-2 border-[#6C3BFF] text-white shadow-[0_0_20px_rgba(108,59,255,0.4)]'
                    : isMe
                    ? 'bg-[#6C3BFF] text-white rounded-br-xs shadow-[0_0_15px_rgba(108,59,255,0.35)]'
                    : 'bg-white/10 border border-white/10 text-white rounded-bl-xs'
                }`}
              >
                {/* Gift Message Banner */}
                {msg.type === 'gift' && msg.giftData && (
                  <div className="p-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl filter drop-shadow-md animate-bounce">
                        {msg.giftData.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#FFD700]">
                            🎁 VIRTUAL GIFT
                          </span>
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-[#6C3BFF] text-white">
                            {msg.giftData.count}x
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white font-['Syne',sans-serif]">
                          {msg.giftData.giftName}
                        </h4>
                        <div className="text-[10px] font-bold text-[#FFD700] font-mono">
                          🪙 {msg.giftData.totalCoins} Coins Sent
                        </div>
                      </div>
                    </div>
                    {msg.content && (
                      <p className="text-xs text-white/90 font-medium italic border-t border-white/10 pt-1.5">
                        "{msg.content}"
                      </p>
                    )}
                  </div>
                )}

                {/* Text Message */}
                {msg.type === 'text' && (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* Voice Note */}
                {msg.type === 'voice' && (
                  <div className="flex items-center gap-3 min-w-[170px] py-1">
                    <button
                      onClick={() => handlePlayVoice(msg.id, msg.mediaDuration || 4)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isMe ? 'bg-white text-[#6C3BFF]' : 'bg-[#6C3BFF] text-white'
                      }`}
                    >
                      {playingAudioId === msg.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      )}
                    </button>
                    <div className="flex-1">
                      {/* Audio waveform simulator */}
                      <div className="flex items-center gap-1 h-6">
                        {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 70].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              playingAudioId === msg.id
                                ? 'bg-white animate-pulse'
                                : isMe
                                ? 'bg-white/70'
                                : 'bg-[#00D1FF]'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-white/70 block mt-0.5">
                        0:0{msg.mediaDuration || 4}
                      </span>
                    </div>
                  </div>
                )}

                {/* Image message */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="space-y-1.5">
                    <img
                      src={msg.mediaUrl}
                      alt="Attachment"
                      className="rounded-xl w-full max-h-48 object-cover cursor-pointer hover:opacity-95 border border-white/10"
                    />
                    {msg.content && <p className="text-xs text-white/90 font-medium">{msg.content}</p>}
                  </div>
                )}

                {/* Video message */}
                {msg.type === 'video' && msg.mediaUrl && (
                  <div className="relative rounded-xl overflow-hidden group max-h-48 border border-white/10">
                    <img
                      src={msg.mediaUrl}
                      alt="Video thumbnail"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#6C3BFF] flex items-center justify-center text-white shadow-lg">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 text-[9px] bg-black/80 px-2 py-0.5 rounded font-black text-white">
                      0:12
                    </span>
                  </div>
                )}

                {/* Time & Read Status */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                    isMe ? 'text-white/80' : 'text-white/50'
                  }`}
                >
                  <span className="font-mono">{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-white" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white/10 border border-white/10 w-20 text-white">
            <span className="w-2 h-2 rounded-full bg-[#6C3BFF] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#00D1FF] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Limit Lockout Alert / Friend Request Modal Banner */}
      {isLimitReached && (
        <div className="p-3 bg-white/5 border-t border-[#6C3BFF]/40 text-center space-y-2 shrink-0">
          <p className="text-xs text-white/80 font-medium">
            🔒 <strong className="text-white">Free message limit reached!</strong> Send a friend request or send a Gift to {participant.name} to continue chatting.
          </p>
          <div className="flex items-center justify-center gap-2">
            {isPendingSent ? (
              <div className="text-xs text-[#00D1FF] font-black uppercase tracking-wider py-1">
                ⏳ Friend request sent. Waiting for acceptance...
              </div>
            ) : (
              <button
                onClick={() => onSendFriendRequest(participant.id)}
                className="px-3 py-2 rounded-xl bg-[#6C3BFF] hover:bg-[#8C62FF] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(108,59,255,0.5)] transition-transform"
              >
                Add Friend
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playPop();
                onOpenGiftSheet();
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(108,59,255,0.5)] transition-transform flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" />
              <span>Send Gift to Connect</span>
            </button>
          </div>
        </div>
      )}

      {/* Media Picker Sheet */}
      {showMediaPicker && !isLimitReached && (
        <div className="p-3 bg-[#170D38] border-t border-white/10 grid grid-cols-3 gap-2 shrink-0 animate-fadeIn">
          <button
            onClick={() =>
              sendSampleImage(
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'
              )
            }
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-center flex flex-col items-center gap-1 text-xs font-black uppercase tracking-wider text-white border border-white/10"
          >
            <ImageIcon className="w-5 h-5 text-[#00D1FF]" />
            <span>Send Photo</span>
          </button>
          <button
            onClick={sendSampleVideo}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-center flex flex-col items-center gap-1 text-xs font-black uppercase tracking-wider text-white border border-white/10"
          >
            <Video className="w-5 h-5 text-[#FF3B80]" />
            <span>Send Video</span>
          </button>
          <button
            onClick={() => {
              setShowMediaPicker(false);
              onOpenGiftSheet();
            }}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-center flex flex-col items-center gap-1 text-xs font-black uppercase tracking-wider text-white border border-white/10"
          >
            <Gift className="w-5 h-5 text-[#FFD700]" />
            <span>Send Gift</span>
          </button>
        </div>
      )}

      {/* Message Composer Footer */}
      <div className="p-3 bg-[#170D38] border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Media Attachment Button */}
          <button
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            disabled={isLimitReached}
            className="p-2.5 rounded-xl bg-white/10 text-[#00D1FF] hover:bg-white/15 disabled:opacity-30 transition-colors border border-white/10"
          >
            <ImageIcon className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Dedicated Gift Button */}
          <button
            id="chat-composer-gift-btn"
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenGiftSheet();
            }}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] text-white hover:opacity-90 transition-transform active:scale-95 border border-[#6C3BFF]/40 shadow-[0_0_10px_rgba(108,59,255,0.4)]"
            title="Send Gift"
          >
            <Gift className="w-4 h-4 stroke-[2.5]" />
          </button>

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-4 py-2 bg-[#6C3BFF]/20 border border-[#6C3BFF] rounded-2xl text-xs font-black uppercase tracking-wider text-white animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6C3BFF] animate-ping" />
                <span>Recording... 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
              </div>
              <button
                onClick={toggleRecording}
                className="text-xs bg-[#6C3BFF] px-3 py-1 rounded-xl text-white font-black uppercase"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendText} className="flex-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLimitReached}
                  placeholder={
                    isLimitReached
                      ? 'Friend request needed to continue'
                      : `Type a message... (${freeMessagesLeft} free left)`
                  }
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6C3BFF] disabled:opacity-40"
                />
              </div>

              {inputText.trim() ? (
                <button
                  type="submit"
                  disabled={isLimitReached}
                  className="p-2.5 rounded-2xl bg-[#6C3BFF] text-white shadow-[0_0_15px_rgba(108,59,255,0.5)] hover:bg-[#8C62FF] disabled:opacity-30 transition-all"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isLimitReached}
                  className="p-2.5 rounded-2xl bg-white/10 text-[#FF3B80] hover:bg-white/15 disabled:opacity-30 transition-colors border border-white/10"
                >
                  <Mic className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
