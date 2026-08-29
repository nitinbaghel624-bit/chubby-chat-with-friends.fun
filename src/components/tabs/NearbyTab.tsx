import React, { useState } from 'react';
import { UserProfile, Gender } from '../../types';
import { Radar, MapPin, SlidersHorizontal, MessageCircle, Sparkles, Navigation, Globe, Check, Gift, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  currentUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onStartChat: (user: UserProfile) => void;
  onSendGiftDirect?: (user: UserProfile) => void;
}

export const NearbyTab: React.FC<Props> = ({
  currentUser,
  users,
  onSelectUser,
  onStartChat,
  onSendGiftDirect,
}) => {
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const filteredUsers = users.filter((u) => {
    const withinRadius = (u.distanceKm || 0) <= radiusKm;
    const matchesGender = selectedGender === 'all' || u.gender === selectedGender;
    const matchesOnline = !onlyOnline || u.isOnline;
    return withinRadius && matchesGender && matchesOnline;
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRadiusKm(val);
    if (val % 25 === 0) {
      soundEffects.playPop();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-white bg-[#0E0720] relative font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#170D38] border-b border-[#6C3BFF]/25 flex items-center justify-between z-20 shrink-0 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#6C3BFF]/20 text-[#6C3BFF] border border-[#6C3BFF]/40 shadow-[0_0_15px_rgba(108,59,255,0.3)]">
            <Radar className="w-5 h-5 animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white flex items-center gap-1.5 font-['Syne',sans-serif]">
              NEARBY <span className="text-[#00D1FF]">RADAR</span>
            </h2>
            <p className="text-[10px] text-[#00D1FF] font-bold uppercase tracking-wider">
              Radius: <strong className="text-white">{radiusKm.toLocaleString()} km</strong> • {filteredUsers.length} active
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFilterSheet(!showFilterSheet)}
          className={`px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            showFilterSheet
              ? 'bg-[#6C3BFF] text-white border-[#6C3BFF] shadow-[0_0_15px_rgba(108,59,255,0.4)]'
              : 'bg-white/10 text-white/80 border-white/10 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Overlay / Drawer */}
      {showFilterSheet && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#170D38] border-b border-[#6C3BFF]/30 z-20 space-y-4 shadow-2xl shrink-0 text-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-black uppercase tracking-wider text-white/80">Distance Radius (1 – 10,000 km)</span>
              <span className="font-black text-[#6C3BFF] text-sm font-mono">{radiusKm.toLocaleString()} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              step="1"
              value={radiusKm}
              onChange={handleSliderChange}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6C3BFF]"
            />
            <div className="flex justify-between text-[9px] font-bold text-white/50 mt-1 uppercase tracking-wider">
              <span>1 km (Local)</span>
              <span>500 km (State)</span>
              <span>10,000 km (Global)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-white/60 font-bold uppercase text-[10px]">Gender:</span>
              {(['all', 'female', 'male', 'non-binary'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all ${
                    selectedGender === g
                      ? 'bg-[#6C3BFF] text-white shadow-[0_0_10px_rgba(108,59,255,0.5)]'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border transition-all ${
                onlyOnline
                  ? 'bg-[#00D1FF]/20 text-[#00D1FF] border-[#00D1FF]/50 shadow-[0_0_10px_rgba(0,209,255,0.3)]'
                  : 'bg-white/5 text-white/60 border-white/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${onlyOnline ? 'bg-[#00D1FF]' : 'bg-slate-500'}`} />
              Active Only
            </button>
          </div>
        </motion.div>
      )}

      {/* Interactive Google Map & Radar Canvas Simulation */}
      <div className="flex-1 relative overflow-hidden bg-[#0E0720] flex items-center justify-center">
        {/* Map Grid Background Lines */}
        <div className="absolute inset-0 dot-pattern-cyan opacity-20 pointer-events-none" />

        {/* Radar Concentric Rings */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-[#00D1FF]/30" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-[#00D1FF]/20" />
        <div className="absolute w-[460px] h-[460px] rounded-full border border-[#00D1FF]/15" />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#00D1FF]/10" />

        {/* Animated Radar Pulse Waves */}
        <div className="absolute w-64 h-64 rounded-full bg-[#6C3BFF]/10 border border-[#6C3BFF]/40 radar-sweep pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full bg-[#00D1FF]/10 border border-[#00D1FF]/30 radar-sweep-delayed pointer-events-none" />

        {/* Center User Pin (Me) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#6C3BFF] to-[#00D1FF] shadow-[0_0_20px_rgba(108,59,255,0.5)] animate-pulse">
              <img
                src={currentUser.avatar}
                alt="Me"
                className="w-full h-full rounded-full object-cover border-2 border-[#0E0720]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#6C3BFF] text-[8px] font-black text-white uppercase tracking-wider">
              YOU
            </span>
          </div>
          <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-white bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
            {currentUser.location.city}
          </span>
        </div>

        {/* Orbiting Nearby Users Pin Markers */}
        {filteredUsers.map((user, index) => {
          const angle = (index * (360 / Math.max(1, filteredUsers.length)) * Math.PI) / 180;
          const distanceScale = Math.min(140, Math.max(55, Math.log10((user.distanceKm || 1) + 1) * 35));
          const x = Math.cos(angle) * distanceScale;
          const y = Math.sin(angle) * distanceScale;

          return (
            <motion.div
              key={user.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1, x, y }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={() => onSelectUser(user)}
              className="absolute z-20 cursor-pointer group flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#6C3BFF] via-[#8C62FF] to-[#FF3B80] group-hover:scale-125 transition-transform shadow-[0_0_15px_rgba(108,59,255,0.4)]">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover border-2 border-[#0E0720]"
                  />
                </div>
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00D1FF] border border-black" />
                )}
                {user.isMember && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#FFD700] border border-black" />
                )}
              </div>
              <span className="mt-0.5 text-[9px] font-bold bg-[#170D38]/90 border border-white/15 px-2 py-0.5 rounded-md text-white whitespace-nowrap shadow uppercase">
                {user.name.split(' ')[0]} ({user.distanceKm}km)
              </span>
            </motion.div>
          );
        })}

        {/* Location GPS indicator badge */}
        <div className="absolute top-3 left-3 bg-[#170D38]/90 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white/90 flex items-center gap-1.5 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>Radar: Active</span>
        </div>

        <div className="absolute top-3 right-3 bg-[#170D38]/90 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] text-[#6C3BFF] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <Globe className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>Range: {radiusKm} km</span>
        </div>
      </div>

      {/* Bottom Floating Carousel of Nearby Users */}
      <div className="p-3 bg-[#170D38] border-t border-white/10 shrink-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
            Users within {radiusKm.toLocaleString()} km ({filteredUsers.length})
          </span>
          <span className="text-[9px] text-[#00D1FF] font-bold uppercase tracking-wider">Tap user to inspect</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-4 text-center text-xs text-white/60 bg-white/5 rounded-2xl border border-dashed border-white/10">
            No users found within {radiusKm} km. Try increasing the radar radius slider!
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="w-60 shrink-0 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#6C3BFF]/50 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center gap-2.5" onClick={() => onSelectUser(user)}>
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-xl object-cover border border-white/10"
                    />
                    {user.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00D1FF] border border-[#0E0720]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white truncate font-['Syne',sans-serif] flex items-center gap-1">
                      {user.name}, {user.age}
                      {user.isMember && <Crown className="w-3 h-3 text-[#FFD700]" />}
                    </h4>
                    <p className="text-[10px] text-white/60 truncate">{user.location.city}</p>
                    <p className="text-[10px] text-[#6C3BFF] font-black uppercase mt-0.5">
                      📍 {user.distanceKm} km away
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onSelectUser(user)}
                    className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-black uppercase tracking-wider text-white"
                  >
                    Profile
                  </button>
                  {onSendGiftDirect && (
                    <button
                      onClick={() => onSendGiftDirect(user)}
                      className="py-1.5 px-2.5 rounded-lg bg-gradient-to-tr from-[#6C3BFF] to-[#FF3B80] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"
                      title="Send Gift"
                    >
                      <Gift className="w-3 h-3" />
                      <span>Gift</span>
                    </button>
                  )}
                  <button
                    onClick={() => onStartChat(user)}
                    className="flex-1 py-1.5 rounded-lg bg-[#6C3BFF] hover:bg-[#8C62FF] text-[10px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(108,59,255,0.4)]"
                  >
                    <MessageCircle className="w-3 h-3 stroke-[2.5]" /> Say Hi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
