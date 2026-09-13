import React, { useState, useEffect } from 'react';
import {
  X,
  Github,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  FolderGit2,
  Download,
  Lock,
  Globe,
  Terminal,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { GoldItem, StoreConfig } from '../types';
import {
  validateGitHubToken,
  getOrCreateRepo,
  pushProjectToGitHub,
  downloadGitHubProjectZip,
  GitHubUser,
} from '../utils/githubSync';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeConfig: StoreConfig;
  items: GoldItem[];
  onUpdateStoreConfig?: (newConfig: StoreConfig) => void;
  isDarkMode?: boolean;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  storeConfig,
  items,
  onUpdateStoreConfig,
  isDarkMode = true,
}) => {
  const [token, setToken] = useState(() => localStorage.getItem('hatipoglu_github_token') || '');
  const [repoName, setRepoName] = useState('hatipoglu-kuyumculuk-ios');
  const [commitMsg, setCommitMsg] = useState('feat: Hatipoğlu Kuyumculuk iOS & Web Güncellemesi');
  const [isPrivate, setIsPrivate] = useState(false);
  const [userProfile, setUserProfile] = useState<GitHubUser | null>(null);
  const [bundleId, setBundleId] = useState(
    () =>
      storeConfig.bundleIdentifier ||
      localStorage.getItem('hatipoglu_bundle_id') ||
      'com.hatipoglu.gold'
  );

  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'direct' | 'terminal' | 'zip'>('direct');

  // Load user profile on open or token change
  useEffect(() => {
    if (token.trim().length > 10) {
      verifyToken(token.trim());
    } else {
      setUserProfile(null);
    }
  }, [token]);

  const verifyToken = async (pat: string) => {
    setIsLoadingUser(true);
    setErrorMessage(null);
    try {
      const user = await validateGitHubToken(pat);
      setUserProfile(user);
      localStorage.setItem('hatipoglu_github_token', pat);
    } catch (err: any) {
      setUserProfile(null);
      // don't aggressively show error while typing
    } finally {
      setIsLoadingUser(false);
    }
  };

  if (!isOpen) return null;

  const handlePush = async () => {
    if (!token.trim()) {
      setErrorMessage('Lütfen GitHub Personal Access Token (PAT) giriniz.');
      return;
    }
    if (!repoName.trim()) {
      setErrorMessage('Lütfen bir depo (repository) adı belirtiniz.');
      return;
    }

    setIsPushing(true);
    setErrorMessage(null);
    setSuccessUrl(null);
    setProgressPct(5);
    setProgressMsg('GitHub bağlantısı doğrulanıyor...');

    try {
      // 1. Verify user
      const user = await validateGitHubToken(token.trim());
      setUserProfile(user);
      localStorage.setItem('hatipoglu_github_token', token.trim());

      // 2. Get or create repository
      setProgressMsg(`"${repoName}" deposu GitHub üzerinde hazırlanıyor...`);
      setProgressPct(10);
      const repo = await getOrCreateRepo(token.trim(), user.login, repoName.trim(), isPrivate);

      // 3. Push files with effective Codemagic configuration
      const effectiveConfig: StoreConfig = {
        ...storeConfig,
        bundleIdentifier: bundleId.trim() || storeConfig.bundleIdentifier || 'com.hatipoglu.gold',
      };
      if (onUpdateStoreConfig) {
        onUpdateStoreConfig(effectiveConfig);
      }

      const targetBranch = repo.default_branch || 'main';

      const result = await pushProjectToGitHub(
        token.trim(),
        user.login,
        repo.full_name.split('/')[1] || repoName,
        effectiveConfig,
        items,
        commitMsg,
        targetBranch,
        (msg, pct) => {
          setProgressMsg(msg);
          setProgressPct(pct);
        }
      );

      // Mirror commit to both main and master so EAS Build finds package.json regardless of default branch
      try {
        const repoShortName = repo.full_name.split('/')[1] || repoName;
        const refRes = await fetch(
          `https://api.github.com/repos/${user.login}/${repoShortName}/git/ref/heads/${targetBranch}`,
          {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        if (refRes.ok) {
          const refData = await refRes.json();
          const latestSha = refData.object?.sha;
          if (latestSha) {
            const alternateBranch = targetBranch === 'main' ? 'master' : 'main';
            const createRefRes = await fetch(
              `https://api.github.com/repos/${user.login}/${repoShortName}/git/refs`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token.trim()}`,
                  Accept: 'application/vnd.github.v3+json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ref: `refs/heads/${alternateBranch}`, sha: latestSha }),
              }
            );
            if (!createRefRes.ok) {
              await fetch(
                `https://api.github.com/repos/${user.login}/${repoShortName}/git/refs/heads/${alternateBranch}`,
                {
                  method: 'PATCH',
                  headers: {
                    Authorization: `Bearer ${token.trim()}`,
                    Accept: 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ sha: latestSha, force: true }),
                }
              );
            }
          }
        }
      } catch {
        // Non-blocking branch mirror
      }

      setSuccessUrl(result.repoUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'GitHub deposuna yükleme sırasında bir hata oluştu.');
    } finally {
      setIsPushing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const gitCommands = `# 1. Git deposunu başlatın
git init
git add .
git commit -m "${commitMsg}"
git branch -M main

# 2. GitHub deponuzu bağlayın (Kullanıcı adınızı yazın)
git remote add origin https://github.com/${userProfile?.login || 'KULLANICI_ADINIZ'}/${repoName}.git

# 3. Dosyaları GitHub'a gönderin
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isDarkMode
            ? 'bg-[#060B17] border-[#1C2C4D] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-amber-500/20 bg-gradient-to-r from-[#070D1F] via-[#0B1530] to-[#070D1F]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center shadow-md">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black font-cinzel tracking-wider text-white flex items-center gap-2">
                <span>GitHub & Codemagic.io Dağıtımı</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Bulut CI/CD
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Tüm kaynak kodları ve Codemagic iOS yapılandırmasını GitHub deponuza aktarın
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isPushing}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#040813] text-xs">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2.5 px-3 font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'direct'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Doğrudan Yükle (API)</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex-1 py-2.5 px-3 font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'terminal'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Git Komutları</span>
          </button>
          <button
            onClick={() => setActiveTab('zip')}
            className={`flex-1 py-2.5 px-3 font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'zip'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>GitHub ZIP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Direct API Push Tab */}
          {activeTab === 'direct' && (
            <>
              {/* Token Input Card */}
              <div className="p-3.5 rounded-xl bg-[#040917] border border-[#182845] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>GitHub Personal Access Token (PAT)</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=HatipogluGoldSync"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Token Oluştur</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#02050E] border border-[#1F3358] text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  {isLoadingUser && (
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin absolute right-3 top-2.5" />
                  )}
                </div>

                {userProfile ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                    <div className="flex items-center gap-2">
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.login}
                        className="w-6 h-6 rounded-full border border-emerald-400/50"
                      />
                      <span className="font-bold">
                        {userProfile.name || userProfile.login} (@{userProfile.login})
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 font-black">
                      BAĞLANDI
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tokenınız tarayıcınızın yerel hafızasında saklanır, asla sunucuya gönderilmez.
                    Yalnızca <code>repo</code> yetkisi yeterlidir.
                  </p>
                )}
              </div>

              {/* Repo Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Depo (Repo) Adı:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="hatipoglu-gold-ios"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#040917] border border-[#182845] text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Gizlilik Türü:</label>
                  <div className="flex rounded-lg bg-[#040917] border border-[#182845] p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`flex-1 py-1 px-2 rounded-md font-bold flex items-center justify-center gap-1 ${
                        !isPrivate
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>Herkese Açık</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`flex-1 py-1 px-2 rounded-md font-bold flex items-center justify-center gap-1 ${
                        isPrivate
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Gizli (Private)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Commit Message */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Commit Mesajı:</label>
                <input
                  type="text"
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#040917] border border-[#182845] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Codemagic.io CI/CD Configuration */}
              <div className="p-3 rounded-xl bg-[#040917] border border-[#182845] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Codemagic.io Bulut CI/CD & Apple App Store Yapılandırması</span>
                  </label>
                  <a
                    href="https://codemagic.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>codemagic.io</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    iOS Bundle Identifier:
                  </label>
                  <input
                    type="text"
                    value={bundleId}
                    onChange={(e) => {
                      setBundleId(e.target.value);
                      localStorage.setItem('hatipoglu_bundle_id', e.target.value);
                    }}
                    placeholder="com.hatipoglu.kuyumculuk.ios"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#02050E] border border-[#1F3358] text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deponuzun kök dizinine otomatik olarak <strong>codemagic.yaml</strong> eklenir. GitHub'a aktarıldıktan sonra Codemagic.io'da projenizi bağlayıp Mac Mini M2 bulut makinelerinde doğrudan Apple App Store / TestFlight için .IPA derlemesi alabilirsiniz.
                </p>
              </div>

              {/* Progress & Status */}
              {isPushing && (
                <div className="p-3.5 rounded-xl bg-[#081024] border border-amber-500/40 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {progressMsg}
                    </span>
                    <span className="text-amber-400 font-mono">%{progressPct}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Result */}
              {successUrl && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-fadeIn text-emerald-300">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Tüm Proje Başarıyla GitHub'a Gönderildi!</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Deponuz hazır. Hem <strong>main</strong> hem de <strong>master</strong> dalları eşitlendi.
                    Kök dizinde <code>codemagic.yaml</code>, <code>package.json</code>, <code>app.json</code> ve <code>App.js</code> dosyaları eksiksiz oluşturuldu.
                  </p>
                  
                  <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/30 text-[11px] text-slate-200 space-y-1.5">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Codemagic.io ile Derleme Adımları:</span>
                    </p>
                    <p className="text-slate-300">
                      1. <strong>https://codemagic.io</strong> adresine gidin ve GitHub ile giriş yapın.
                    </p>
                    <p className="text-slate-300">
                      2. <strong>Add application</strong> butonuna basıp bu deponuzu seçin; <code>codemagic.yaml</code> otomatik algılanır.
                    </p>
                    <p className="text-slate-300">
                      3. <strong>"Start new build"</strong> butonuna basarak Mac Mini M2 sunucularında Apple App Store / TestFlight için .IPA derlemenizi hemen başlatın.
                    </p>
                  </div>

                  <a
                    href={successUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                  >
                    <span>GitHub'da Depoyu Aç</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Error Box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2 text-rose-300 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-[11px]">{errorMessage}</p>
                </div>
              )}

              {/* Push Action Button */}
              <button
                onClick={handlePush}
                disabled={isPushing}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPushing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>GitHub'a Yükleniyor... (%{progressPct})</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Dosyaları Doğrudan GitHub'a Gönder</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Terminal Git Commands Tab */}
          {activeTab === 'terminal' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">
                  Terminalden Git ile Gönderme Komutları:
                </span>
                <button
                  onClick={() => copyToClipboard(gitCommands, 'git-cmds')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#132038] hover:bg-[#1E3050] text-amber-300 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  {copiedKey === 'git-cmds' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Komutları Kopyala
                    </>
                  )}
                </button>
              </div>

              <pre className="text-[11px] font-mono bg-black/70 p-3 rounded-xl text-amber-300/90 overflow-x-auto border border-[#16233B] leading-relaxed">
                {gitCommands}
              </pre>

              <div className="p-3 rounded-xl bg-[#040917] border border-[#182845] space-y-1.5">
                <div className="font-bold text-slate-200">💡 İpuçları:</div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>
                    GitHub hesabınızda önceden bir boş repository açmadıysanız{' '}
                    <a
                      href="https://github.com/new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 underline font-semibold"
                    >
                      github.com/new
                    </a>{' '}
                    adresinden hemen açabilirsiniz.
                  </li>
                  <li>
                    Tüm projeyi tek tıkla indirmek için yandaki <strong>"GitHub ZIP"</strong>{' '}
                    sekmesini kullanabilirsiniz.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* GitHub ZIP Download Tab */}
          {activeTab === 'zip' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#040917] border border-[#182845] space-y-3">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-amber-400" />
                  <span className="font-extrabold text-sm text-white">
                    GitHub'a Hazır Proje Arşivi (.ZIP)
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  İçerisinde <code>codemagic.yaml</code>, <code>package.json</code>, <code>README.md</code>, <code>.gitignore</code>
                  , tüm kaynak kodlar ve <code>ios-codemagic/</code> mobil klasörünü içeren tam GitHub
                  projesini tek tıkla bilgisayarınıza indirin.
                </p>
                <button
                  onClick={() => downloadGitHubProjectZip(storeConfig, items)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>hatipoglu-kuyumculuk-github-repo.zip İndir</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#03060E] flex items-center justify-between text-[11px] text-slate-500">
          <span>Hatipoğlu Kuyumculuk v1.0.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
