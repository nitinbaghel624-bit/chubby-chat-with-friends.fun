import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  user: UserProfile | null;
  onClose: () => void;
  onSubmitReport: (userId: string, reason: string) => void;
}

const REPORT_REASONS = [
  'Inappropriate content or messages',
  'Harassment or hate speech',
  'Fake profile or impersonation',
  'Spam or advertising',
  'Underage account',
  'Other safety concern'
];

export const ReportModal: React.FC<Props> = ({ user, onClose, onSubmitReport }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(user.id, `${selectedReason}: ${details}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
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

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-[#00D1FF] mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-white font-['Syne',sans-serif]">REPORT SUBMITTED</h3>
              <p className="text-xs text-white/80 font-medium">
                Thank you for keeping Chubby Chat safe. Our safety team will review {user.name}’s profile immediately.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#E11299]/20 text-[#E11299] border border-[#E11299]/30 shadow-[0_0_15px_rgba(225,18,153,0.3)]">
                  <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-['Syne',sans-serif]">REPORT {user.name.toUpperCase()}</h3>
                  <p className="text-xs text-white/60 font-medium">Help us understand the issue</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Select Reason</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      type="button"
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedReason === reason
                          ? 'bg-[#E11299]/20 border border-[#E11299] text-white shadow-[0_0_10px_rgba(225,18,153,0.3)]'
                          : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1 block">Additional details (optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context or description..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E11299]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white text-xs font-black uppercase tracking-wider hover:bg-white/15 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#E11299] hover:bg-[#ff1cae] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(225,18,153,0.5)]"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
