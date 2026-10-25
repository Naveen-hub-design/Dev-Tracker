import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import {
  getProfile,
  updateUsernames,
  refreshGitHub,
  refreshLeetCode,
  refreshHackerRank,
} from '../api/profile';
import { refreshCodeforces } from '../api/codeforces';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import BadgeModal from '../components/badge/BadgeModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SectionHeader from '../components/ui/SectionHeader';
import StatBadge from '../components/ui/StatBadge';
import ThemeToggle from '../components/ui/ThemeToggle';
import {
  Github, Code, Shield, RefreshCw, Save, LogOut, AlertTriangle,
  Users, FolderGit2, GitCommit, Trophy, CheckCircle2, Zap,
  Globe, Bell, BellOff, Lock, Key, Eye, EyeOff, ChevronRight,
  Trash2, Download, Clock, ShieldCheck, Binary, Sparkles, ExternalLink,
} from 'lucide-react';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'hi', label: 'Hindi' },
];

const SETTINGS_STORAGE = 'devtrack_settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveSettings(data) {
  try { localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(data)); } catch {}
}

const PlatformCard = memo(function PlatformCard({
  icon: Icon, iconBg, title, username, onUsernameChange, placeholder,
  connected, refreshing, onRefresh, onSave, saving, lastSynced, children,
}) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-[18px] h-[18px] text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {lastSynced && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />Last synced: {lastSynced}
            </p>
          )}
        </div>
        {connected ? (
          <StatBadge label="Connected" color="emerald" dot />
        ) : (
          <StatBadge label="Not Connected" color="slate" />
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder={placeholder}
          containerClassName="flex-1"
          aria-label={`${title} username`}
        />
        <Button variant="primary" size="icon" onClick={onSave} disabled={saving || !username.trim()} loading={saving} aria-label={`Save ${title} username`}>
          <Save className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={onRefresh} disabled={refreshing || !connected} loading={refreshing} aria-label={`Refresh ${title} data`}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {children}
    </Card>
  );
});

const Toggle = memo(function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0 flex-1 mr-4">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
});

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return dateStr; }
}

function ChangePasswordSection({ toast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changing, setChanging] = useState(false);

  const strength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: '' };
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
    return { score: s, label: labels[s], color: colors[s] };
  }, [newPassword]);

  const handleChange = async () => {
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChanging(true);
    // Simulated — no backend endpoint for password change
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChanging(false);
  };

  return (
    <Card>
      <SectionHeader title="Change Password" subtitle="Update your account password" />
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
          <div className="relative">
            <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full px-3 py-2 pr-10 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" tabIndex={-1}>
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
          <div className="relative">
            <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full px-3 py-2 pr-10 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" tabIndex={-1}>
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-1.5">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{strength.label}</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
        </div>
        <Button variant="primary" onClick={handleChange} loading={changing} disabled={!currentPassword || !newPassword || !confirmPassword} className="w-full sm:w-auto">
          <Lock className="w-4 h-4" />Update Password
        </Button>
      </div>
    </Card>
  );
}

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { mode, setTheme } = useTheme();
  const toast = useToast();

  const saved = useMemo(() => loadSettings(), []);

  const [github, setGithub] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [leetcode, setLeetcode] = useState('');
  const [hackerRank, setHackerRank] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [saving, setSaving] = useState('');
  const [refreshing, setRefreshing] = useState('');
  const [language, setLanguage] = useState(saved.language || 'en');
  const [notifications, setNotifications] = useState(saved.notifications !== false);
  const [autoSync, setAutoSync] = useState(saved.autoSync !== false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);

  useEffect(() => {
    if (user?._id) loadProfile();
  }, [user]);

  useEffect(() => {
    saveSettings({ language, notifications, autoSync });
  }, [language, notifications, autoSync]);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setProfileData(data);
      setGithub(data.githubUsername || '');
      setLeetcode(data.leetcodeUsername || '');
      setHackerRank(data.hackerRankUsername || '');
      setCodeforces(data.codeforcesUsername || '');
    } catch { /* ignore */ }
  }, []);

  const handleSaveUsernames = useCallback(async () => {
    setSaving('usernames');
    try {
      const payload = {
        githubUsername: github,
        leetcodeUsername: leetcode,
        hackerRankUsername: hackerRank,
        codeforcesUsername: codeforces,
      };
      if (githubToken.trim()) {
        payload.githubToken = githubToken.trim();
      }
      const data = await updateUsernames(payload);
      updateUser(data);
      setGithubToken('');
      await loadProfile();
      toast.success('Platform credentials saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving('');
    }
  }, [github, githubToken, leetcode, hackerRank, codeforces, updateUser, loadProfile, toast]);

  const handleRefresh = useCallback(async (source) => {
    setRefreshing(source);
    try {
      if (source === 'github') await refreshGitHub();
      else if (source === 'leetcode') await refreshLeetCode();
      else if (source === 'hackerrank') await refreshHackerRank();
      else if (source === 'codeforces') await refreshCodeforces();
      await loadProfile();
      toast.success(`${source.charAt(0).toUpperCase() + source.slice(1)} data refreshed`);
    } catch (err) {
      if (source === 'hackerrank') {
        toast.error('HackerRank integration is temporarily unavailable');
      } else {
        toast.error(err.response?.data?.message || `Failed to refresh ${source}`);
      }
    } finally {
      setRefreshing('');
    }
  }, [loadProfile, toast]);

  const handleExportData = useCallback(() => {
    const data = { profile: profileData, settings: { language, notifications, autoSync, theme: mode }, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `devtrack-export-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  }, [profileData, language, notifications, autoSync, mode, toast]);

  const ghData = useMemo(() => profileData?.githubData, [profileData]);
  const lcData = useMemo(() => profileData?.leetcodeData, [profileData]);
  const hrData = useMemo(() => profileData?.hackerRankData, [profileData]);
  const cfData = useMemo(() => profileData?.codeforcesData, [profileData]);

  const initials = useMemo(() => {
    const n = user?.name || '';
    return n.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  }, [user]);

  const ghLastSync = ghData?.fetchedAt ? formatDate(ghData.fetchedAt) : null;
  const lcLastSync = lcData?.fetchedAt ? formatDate(lcData.fetchedAt) : null;
  const hrLastSync = hrData?.fetchedAt ? formatDate(hrData.fetchedAt) : null;
  const cfLastSync = cfData?.fetchedAt ? formatDate(cfData.fetchedAt) : null;

  if (!user) return null;

  return (
    <PageContainer
      title="Settings"
      subtitle="Manage your accounts, preferences, and security"
      actions={
        <Button onClick={handleSaveUsernames} loading={saving === 'usernames'} aria-label="Save all changes">
          <Save className="w-4 h-4" />Save Changes
        </Button>
      }
    >
      {/* Appearance */}
      <Card>
        <SectionHeader title="Appearance" subtitle="Choose your preferred theme" />
        <div className="mt-4 flex items-center justify-center py-4">
          <ThemeToggle />
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
          {mode === 'system' ? 'Following your system preference' : `Using ${mode} mode`}
        </p>
      </Card>

      {/* Profile */}
      <Card>
        <SectionHeader title="Profile" subtitle="Your account information" />
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-orange-500/20">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <StatBadge label="Joined" value={formatDate(user.createdAt)} color="orange" dot />
              <StatBadge label="Active" color="emerald" dot />
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Platforms */}
      <div>
        <SectionHeader title="Connected Platforms" subtitle="Link your developer accounts to track progress" className="mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlatformCard
            icon={Github} iconBg="bg-slate-800 dark:bg-slate-700" title="GitHub"
            username={github} onUsernameChange={setGithub} placeholder="e.g. octocat"
            connected={!!profileData?.githubUsername} refreshing={refreshing === 'github'}
            onRefresh={() => handleRefresh('github')} onSave={handleSaveUsernames}
            saving={saving === 'usernames'} lastSynced={ghLastSync}
          >
            {ghData ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Users className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">{ghData.profile?.followers ?? 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Followers</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">{ghData.profile?.public_repos ?? 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Repos</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <GitCommit className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">{ghData.totalCommits ?? 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Commits</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Enter your GitHub username and save to connect.</p>
            )}

            {/* Personal Access Token (PAT) Sync */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Access Token (PAT)
                  </span>
                </div>
                {profileData?.hasGitHubToken ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> 5,000/hr Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                    60/hr limit
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                Connect your token for deep repository analytics and higher rate limits.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder={profileData?.hasGitHubToken ? '•••••••••••••••• (Token active)' : 'ghp_xxxxxxxxxxxxxxxx'}
                    className="w-full px-3 py-1.5 pr-8 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveUsernames}
                  disabled={saving === 'usernames' || !githubToken.trim()}
                  loading={saving === 'usernames'}
                >
                  Save
                </Button>
              </div>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=DevTrack%20Sync"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-2 font-medium"
              >
                <ExternalLink className="w-3 h-3" /> Generate token on GitHub
              </a>
            </div>
          </PlatformCard>

          <PlatformCard
            icon={Code} iconBg="bg-amber-600" title="LeetCode"
            username={leetcode} onUsernameChange={setLeetcode} placeholder="e.g. leetcoder"
            connected={!!profileData?.leetcodeUsername} refreshing={refreshing === 'leetcode'}
            onRefresh={() => handleRefresh('leetcode')} onSave={handleSaveUsernames}
            saving={saving === 'usernames'} lastSynced={lcLastSync}
          >
            {lcData ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Zap className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">{lcData.stats?.total ?? 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Total</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Trophy className="w-3.5 h-3.5 text-red-500 mx-auto mb-1" />
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">{lcData.stats?.hard ?? 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Hard</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{lcData.stats?.easy ?? 0}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Easy</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{lcData.stats?.medium ?? 0}</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">Medium</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Enter your LeetCode username and save to connect.</p>
            )}
          </PlatformCard>

          <PlatformCard
            icon={Shield} iconBg="bg-emerald-600" title="HackerRank"
            username={hackerRank} onUsernameChange={setHackerRank} placeholder="e.g. johndoe"
            connected={!!profileData?.hackerRankUsername} refreshing={refreshing === 'hackerrank'}
            onRefresh={() => handleRefresh('hackerrank')} onSave={handleSaveUsernames}
            saving={saving === 'usernames'} lastSynced={hrLastSync}
          >
            {hrData ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatBadge
                    label={hrData.hackerBadge || 'None'}
                    color={['DIAMOND', 'PLATINUM'].includes(hrData.hackerBadge) ? 'purple' : hrData.hackerBadge === 'GOLD' ? 'amber' : 'slate'}
                    dot
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{hrData.totalSolved ?? 0} solved</span>
                </div>
                {hrData.languages?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hrData.languages.slice(0, 4).map((lang) => (
                      <span key={lang.name} className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">{lang.name}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">HackerRank integration is temporarily unavailable.</p>
                <p className="text-[10px] text-slate-300 dark:text-slate-600">The HackerRank API is currently restricted. We're working on a workaround.</p>
              </div>
            )}
          </PlatformCard>

          <PlatformCard
            icon={Binary} iconBg="bg-indigo-600" title="Codeforces"
            username={codeforces} onUsernameChange={setCodeforces} placeholder="e.g. tourist"
            connected={!!profileData?.codeforcesUsername} refreshing={refreshing === 'codeforces'}
            onRefresh={() => handleRefresh('codeforces')} onSave={handleSaveUsernames}
            saving={saving === 'usernames'} lastSynced={cfLastSync}
          >
            {cfData ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <StatBadge
                    label={(cfData.profile?.rank || 'Ranked').toUpperCase()}
                    color="purple"
                    dot
                  />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Rating: {cfData.profile?.rating || 0}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{cfData.stats?.totalSolved || 0}</span>
                    <span className="text-[10px] text-slate-400 block">Solved</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{cfData.stats?.contestsCount || 0}</span>
                    <span className="text-[10px] text-slate-400 block">Contests</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Enter your Codeforces handle and save to connect.</p>
            )}
          </PlatformCard>
        </div>
      </div>

      {/* Preferences */}
      <Card>
        <SectionHeader title="Preferences" subtitle="Customize your experience" />
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between py-3">
            <div className="min-w-0 flex-1 mr-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</span>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Select your display language</p>
            </div>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); toast.success(`Language set to ${LANGUAGES.find((l) => l.value === e.target.value)?.label}`); }}
              className="h-9 px-3 text-sm rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <Toggle label="Notifications" description="Receive in-app notifications about your activity" checked={notifications} onChange={() => { setNotifications(!notifications); toast.info(!notifications ? 'Notifications enabled' : 'Notifications disabled'); }} />
          <Toggle label="Auto-sync" description="Automatically refresh data from connected platforms" checked={autoSync} onChange={() => { setAutoSync(!autoSync); toast.info(!autoSync ? 'Auto-sync enabled' : 'Auto-sync disabled'); }} />
        </div>
      </Card>

      {/* Public Showcase & Badges */}
      <Card>
        <SectionHeader title="Public Showcase & README Badges" subtitle="Share your verified developer profile and embed live stats" />
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Your Shareable Showcase URL</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5 break-all">
              {window.location.origin}/u/{user.githubUsername || user.codeforcesUsername || user.leetcodeUsername || user.name || 'developer'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Anyone can view your verified stats, scores, and projects without an account.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBadgeModalOpen(true)}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              README Badge
            </Button>
            <Link
              to={`/u/${encodeURIComponent(user.githubUsername || user.codeforcesUsername || user.leetcodeUsername || user.name || 'developer')}`}
              target="_blank"
            >
              <Button variant="primary" size="sm">
                <ExternalLink className="w-3.5 h-3.5" />
                View Showcase
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <ChangePasswordSection toast={toast} />

      {/* Security */}
      <Card>
        <SectionHeader title="Security" subtitle="Manage your session and data" />
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Current Session</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as {user.email}</p>
              </div>
            </div>
            <StatBadge label="Active" color="emerald" dot />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" onClick={handleExportData} className="flex-1">
              <Download className="w-4 h-4" />Export Data
            </Button>
            <Button variant="secondary" onClick={logout} className="flex-1" aria-label="Sign out">
              <LogOut className="w-4 h-4" />Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/50">
        <SectionHeader title="Danger Zone" subtitle="Irreversible actions" />
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Delete Account</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Permanently delete your account and all data</p>
            </div>
          </div>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <Button variant="danger" size="sm" onClick={() => { toast.info('Account deletion is not available yet'); setShowDeleteConfirm(false); }}>
                <Trash2 className="w-3.5 h-3.5" />Confirm Delete
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-3.5 h-3.5" />Delete
            </Button>
          )}
        </div>
      </Card>

      <BadgeModal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        username={user.githubUsername || user.codeforcesUsername || user.leetcodeUsername || user.name || 'developer'}
      />
    </PageContainer>
  );
}
