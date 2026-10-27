import React from 'react';
import { useToastStore } from '../../stores/useToastStore';
import { CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        return (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 transform animate-slide-down cursor-pointer ${
              t.type === 'success'
                ? 'bg-[#0E2018]/90 border-emerald-500/50 text-emerald-300 shadow-glow-emerald'
                : t.type === 'warning'
                ? 'bg-[#231A0B]/90 border-amber-500/50 text-amber-300 shadow-glow-gold'
                : t.type === 'error'
                ? 'bg-[#261014]/90 border-red-500/50 text-red-300 shadow-glow-danger'
                : 'bg-[#141A29]/90 border-blue-500/50 text-blue-300'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="text-xs font-bold leading-tight">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
