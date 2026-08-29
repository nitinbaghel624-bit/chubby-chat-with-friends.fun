import React, { useState } from 'react';
import { UserProfile, Gender } from '../../types';
import { X, Camera, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<Props> = ({ user, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [dob, setDob] = useState(user.dob);
  const [gender, setGender] = useState<Gender>(user.gender);
  const [city, setCity] = useState(user.location.city);

  if (!isOpen) return null;

  const calculateAge = (dobString: string): number => {
    const birth = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(18, isNaN(age) ? 24 : age);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      avatar,
      bio,
      dob,
      age: calculateAge(dob),
      gender,
      location: {
        ...user.location,
        city,
      }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#160021] border border-white/15 rounded-3xl p-6 text-white shadow-2xl relative max-h-[90vh] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <h3 className="text-xl font-black text-white flex items-center gap-2 font-['Syne',sans-serif]">
              <Sparkles className="w-5 h-5 text-[#E11299]" /> EDIT PROFILE
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white bg-white/5 border border-white/10"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <form onSubmit={handleSave} className="overflow-y-auto space-y-4 py-4 pr-1 flex-1">
            {/* Avatar picker */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-2">Avatar Photo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#E11299] shadow-[0_0_15px_rgba(225,18,153,0.4)] shrink-0">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/60 mb-1.5 font-medium">Choose preset or paste URL:</p>
                  <div className="flex gap-2 mb-2">
                    {SAMPLE_AVATARS.map((src, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setAvatar(src)}
                        className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-transform ${
                          avatar === src ? 'border-[#E11299] scale-110 shadow-[0_0_10px_#E11299]' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={src} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E11299]"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-bold focus:outline-none focus:border-[#E11299]"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Write a little about yourself..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E11299]"
              />
            </div>

            {/* DOB & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#E11299]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 rounded-xl bg-[#160021] border border-white/10 text-xs text-white focus:outline-none focus:border-[#E11299]"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#E11299]"
              />
            </div>

            <div className="pt-4 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white text-xs font-black uppercase tracking-wider hover:bg-white/15 border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#E11299] hover:bg-[#ff1cae] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(225,18,153,0.5)] flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" /> Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
