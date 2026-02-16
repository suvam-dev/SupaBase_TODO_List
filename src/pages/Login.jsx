import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, Github } from 'lucide-react';

export default function Login() {
  const { user, signIn, signUp, signInWithMagicLink, signInWithGitHub } = useAuth();
  const [tab, setTab] = useState('login'); // login | signup | magic
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
      } else if (tab === 'signup') {
        await signUp(email, password);
        setSuccess('Account created! Check your email to confirm, then log in.');
        setTab('login');
      } else if (tab === 'magic') {
        await signInWithMagicLink(email);
        setSuccess('Magic link sent! Check your email to sign in.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>
        <p className="login-subtitle">Organize your life, one task at a time.</p>

        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
          >
            Log In
          </button>
          <button
            className={`login-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        {tab !== 'magic' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
              <Sparkles size={16} />
            </button>
          </form>
        )}

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          className="btn-magic-link"
          onClick={signInWithGitHub}
          style={{ marginBottom: 10 }}
        >
          <Github size={18} /> Sign in with GitHub
        </button>

        <button
          className="btn-magic-link"
          onClick={() => { setTab(tab === 'magic' ? 'login' : 'magic'); setError(''); setSuccess(''); }}
        >
          {tab === 'magic' ? (
            <>
              <Lock size={16} /> Sign in with password
            </>
          ) : (
            <>
              <Sparkles size={16} /> Sign in with Magic Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
