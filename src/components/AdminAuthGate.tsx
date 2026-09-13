import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, LogIn, AlertTriangle, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { verifyAdminLogin, getAdminCredentials } from '../utils/adminAuth';

interface AdminAuthGateProps {
  onSuccess: (remember: boolean) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onSuccess,
  onCancel,
  isDarkMode = true,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCreds] = useState(() => getAdminCredentials());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const isSuccess = verifyAdminLogin(username, password);

    setTimeout(() => {
      if (isSuccess) {
        setIsLoading(false);
        onSuccess(rememberMe);
      } else {
        setIsLoading(false);
        setErrorMsg('Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol ediniz.');
      }
    }, 250);
  };

  return (
    <div className={`flex-1 flex flex-col justify-center px-4 py-6 overflow-y-auto no-scrollbar transition-colors ${
      isDarkMode ? 'text-slate-100' : 'text-slate-800'
    }`}>
      <div className="w-full max-w-sm mx-auto">
        {/* Top Back button */}
        <button
          onClick={onCancel}
          className={`flex items-center gap-1.5 text-xs font-semibold mb-4 transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fiyat Listesine Dön</span>
        </button>

        {/* Security Login Card */}
        <div className={`rounded-3xl p-6 shadow-2xl border transition-all ${
          isDarkMode
            ? 'bg-[#080E1C] border-amber-500/30 shadow-amber-950/30'
            : 'bg-white border-slate-200 shadow-xl'
        }`}>
          {/* Logo & Shield Header */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-blue-600'
            }`}>
              <ShieldCheck className="w-8 h-8" />
            </div>

            <span className={`text-[10px] font-cinzel font-bold tracking-widest uppercase flex items-center justify-center gap-1 ${
              isDarkMode ? 'text-amber-400' : 'text-blue-600'
            }`}>
              <Sparkles className="w-3 h-3" /> GÜVENLİK PROTOKOLÜ
            </span>

            <h2 className={`text-xl font-black font-cinzel tracking-tight mt-1 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Yönetici Girişi
            </h2>
            <p className={`text-xs mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Formül motoru ve mağaza ayarları için yetkili kimlik doğrulaması gereklidir.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 bg-rose-500/15 border border-rose-500/40 rounded-xl p-2.5 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className={`text-xs font-bold block mb-1.5 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeCreds.username || 'admin'}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="username"
                  className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold focus:outline-none transition-all ${
                    isDarkMode
                      ? 'bg-[#040813] border border-[#1C2C4A] text-white focus:border-amber-400 placeholder:text-slate-600'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`text-xs font-bold block mb-1.5 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Yönetici Şifresi
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-sm font-semibold focus:outline-none transition-all ${
                    isDarkMode
                      ? 'bg-[#040813] border border-[#1C2C4A] text-white focus:border-amber-400 placeholder:text-slate-600'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                />
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  Beni Hatırla
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Yönetici Paneline Giriş Yap</span>
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className={`mt-5 pt-3.5 border-t text-center ${
            isDarkMode ? 'border-[#15223A]' : 'border-slate-100'
          }`}>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SSL Şifreli Yerel Oturum Koruması</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
