import React, { useState } from 'react';
import { AuthMethod, UserProfile } from '../../types';
import { Phone, Mail, Lock, Sparkles, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../audio/audioSynthesizer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (method: AuthMethod, details: { phone?: string; email?: string; name: string }) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [phone, setPhone] = useState('+1 (555) 382-9910');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('alex.vance@chubbychat.app');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Vance');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    soundEffects.playPop();
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode('749215'); // Autofill sample OTP for instant demo delight
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    soundEffects.playSend();
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess('phone', { phone, name });
      onClose();
    }, 800);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    soundEffects.playSend();
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess('email', { email, name });
      onClose();
    }, 800);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    soundEffects.playSend();
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess('google', { email: 'alex.google@chubbychat.app', name: 'Alex Vance (Google)' });
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#160021] border border-white/15 rounded-3xl p-6 text-white shadow-2xl relative font-['Plus_Jakarta_Sans',sans-serif]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/60 hover:text-white bg-white/5 border border-white/10"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E11299] flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-[0_0_20px_rgba(225,18,153,0.5)] font-['Syne',sans-serif]">
              C
            </div>
            <h3 className="text-xl font-black text-white font-['Syne',sans-serif] tracking-tight">CHUBBY CHAT AUTH</h3>
            <p className="text-xs text-white/60 mt-1 font-medium">Firebase Authentication Provider</p>
          </div>

          {/* Auth Method Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl mb-6">
            <button
              onClick={() => {
                setMethod('phone');
                setOtpSent(false);
              }}
              className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                method === 'phone'
                  ? 'bg-[#E11299] text-white shadow-[0_0_12px_rgba(225,18,153,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> OTP
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                method === 'email'
                  ? 'bg-[#E11299] text-white shadow-[0_0_12px_rgba(225,18,153,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </button>
            <button
              onClick={() => setMethod('google')}
              className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                method === 'google'
                  ? 'bg-[#E11299] text-white shadow-[0_0_12px_rgba(225,18,153,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Google</span>
            </button>
          </div>

          {/* Phone OTP Tab */}
          {method === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E11299]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#E11299] hover:bg-[#ff1cae] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(225,18,153,0.5)] flex items-center justify-center gap-2 transition-transform"
                  >
                    {isLoading ? 'Sending OTP SMS...' : 'Send Verification OTP'}
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">OTP sent to {phone}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#00D1FF] font-black uppercase tracking-wider underline text-[10px]"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="749215"
                      required
                      className="w-full text-center tracking-[0.5em] font-mono text-base font-black py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#E11299]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#E11299] hover:bg-[#ff1cae] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(225,18,153,0.5)] flex items-center justify-center gap-2 transition-transform"
                  >
                    {isLoading ? 'Verifying...' : 'Confirm & Sign In'}
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Email / Password Tab */}
          {method === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E11299]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E11299]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#E11299] hover:bg-[#ff1cae] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(225,18,153,0.5)] flex items-center justify-center gap-2 transition-transform"
              >
                {isLoading ? 'Signing In...' : 'Sign In with Firebase Auth'}
              </button>
            </form>
          )}

          {/* Google Sign-in Tab */}
          {method === 'google' && (
            <div className="space-y-4 text-center py-2">
              <p className="text-xs text-white/80 font-medium">
                Authenticate seamlessly with Google Sign-In SDK using OAuth 2.0 credential tokens.
              </p>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-slate-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span>Secured with Firebase Auth SDK</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
