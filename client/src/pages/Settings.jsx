import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateUsernames, refreshGitHub, refreshLeetCode, refreshCodeforces } from '../api/profile';
import { RefreshCw, Github, Code, Trophy, Save } from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [github, setGithub] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?._id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfileData(data);
      setGithub(data.githubUsername || '');
      setLeetcode(data.leetcodeUsername || '');
      setCodeforces(data.codeforcesUsername || '');
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const data = await updateUsernames({ githubUsername: github, leetcodeUsername: leetcode, codeforcesUsername: codeforces });
      updateUser(data);
      setMessage('Usernames saved successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async (source) => {
    setRefreshing(source);
    setMessage('');
    try {
      if (source === 'github') await refreshGitHub();
      else if (source === 'leetcode') await refreshLeetCode();
      else if (source === 'codeforces') await refreshCodeforces();
      await loadProfile();
      setMessage(`${source.charAt(0).toUpperCase() + source.slice(1)} data refreshed`);
    } catch (err) {
      setMessage(err.response?.data?.message || `Failed to refresh ${source}`);
    } finally {
      setRefreshing('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Connect your developer accounts</p>
      </div>

      {message && (
        <div className={`text-sm p-3 rounded-lg ${message.includes('Failed') || message.includes('failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {message}
        </div>
      )}

      <div className="card space-y-4">
        <h3 className="section-title">Connected Accounts</h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <Github className="w-4 h-4" /> GitHub Username
            </label>
            <div className="flex gap-2">
              <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="input-field flex-1" placeholder="e.g. octocat" />
              <button onClick={() => handleRefresh('github')} disabled={refreshing === 'github'} className="btn-primary !px-3">
                <RefreshCw className={`w-4 h-4 ${refreshing === 'github' ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <Code className="w-4 h-4" /> LeetCode Username
            </label>
            <div className="flex gap-2">
              <input type="text" value={leetcode} onChange={(e) => setLeetcode(e.target.value)} className="input-field flex-1" placeholder="e.g. leetcoder" />
              <button onClick={() => handleRefresh('leetcode')} disabled={refreshing === 'leetcode'} className="btn-primary !px-3">
                <RefreshCw className={`w-4 h-4 ${refreshing === 'leetcode' ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <Trophy className="w-4 h-4" /> Codeforces Username
            </label>
            <div className="flex gap-2">
              <input type="text" value={codeforces} onChange={(e) => setCodeforces(e.target.value)} className="input-field flex-1" placeholder="e.g. tourist" />
              <button onClick={() => handleRefresh('codeforces')} disabled={refreshing === 'codeforces'} className="btn-primary !px-3">
                <RefreshCw className={`w-4 h-4 ${refreshing === 'codeforces' ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {profileData?.githubData && (
        <div className="card">
          <h3 className="section-title">Last Synced Data</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {profileData.githubData && (
              <p>GitHub: {profileData.githubData.profile?.username} — {profileData.githubData.totalCommits} commits</p>
            )}
            {profileData.leetcodeData && (
              <p>LeetCode: {profileData.leetcodeData.username} — {profileData.leetcodeData.stats?.total} solved</p>
            )}
            {profileData.codeforcesData && (
              <p>Codeforces: {profileData.codeforcesData.username} — Rating {profileData.codeforcesData.rating}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
