import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { api } from './lib/api';

export function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const [selectedSymbol, setSelectedSymbol] = useState('BTC-USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [marketData, setMarketData] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [backtests, setBacktests] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadStrategies();
      loadBacktests();
    }
  }, [user]);

  const loadStrategies = async () => {
    try {
      const data = await api.getStrategies();
      setStrategies(data);
    } catch (err) {
      console.error('Failed to load strategies', err);
    }
  };

  const loadBacktests = async () => {
    try {
      const data = await api.getBacktests();
      setBacktests(data);
    } catch (err) {
      console.error('Failed to load backtests', err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('Check your email to confirm your account');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFetchData = async () => {
    try {
      const result = await api.fetchMarketData(selectedSymbol, selectedTimeframe);
      if (result.success) {
        setMarketData(result.data);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateStrategy = async (name: string) => {
    try {
      const newStrategy = await api.createStrategy(name, 'manual', {});
      setStrategies([newStrategy, ...strategies]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 700, textAlign: 'center' }}>Trading Sandbox</h1>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666', textAlign: 'center' }}>AI-Powered Strategy Training</p>

          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#667eea', border: '1px solid #667eea', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              {isSignUp ? 'Back to Sign In' : 'Don\'t have an account? Sign Up'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui' }}>
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 600 }}>AI Trading Strategy Sandbox</h1>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>Powered by Blofin + OpenRouter</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px' }}>{user.email}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Market Data</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Symbol</label>
              <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}>
                <option value="BTC-USDT">BTC-USDT</option>
                <option value="ETH-USDT">ETH-USDT</option>
                <option value="XRP-USDT">XRP-USDT</option>
                <option value="SOL-USDT">SOL-USDT</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Timeframe</label>
              <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}>
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="1H">1H</option>
                <option value="4H">4H</option>
                <option value="1D">1D</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={handleFetchData} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                Fetch Data
              </button>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#666' }}>{marketData.length} candles loaded</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Strategies ({strategies.length})</h3>
            {strategies.length === 0 ? (
              <p style={{ color: '#999', fontSize: '13px' }}>No strategies yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {strategies.map((s) => (
                  <div key={s.id} onClick={() => setSelectedStrategy(s)} style={{ padding: '12px', background: selectedStrategy?.id === s.id ? '#e8eaf6' : '#f5f5f5', borderRadius: '6px', cursor: 'pointer', border: selectedStrategy?.id === s.id ? '2px solid #667eea' : '1px solid #e0e0e0' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{s.name}</p>
                    <span style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', background: '#667eea', color: 'white', borderRadius: '4px', marginTop: '4px' }}>{s.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Backtests ({backtests.length})</h3>
            {backtests.length === 0 ? (
              <p style={{ color: '#999', fontSize: '13px' }}>No backtest results yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {backtests.map((bt) => (
                  <div key={bt.id} style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#999' }}>Return</p>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: bt.total_return > 0 ? '#4CAF50' : '#f44336' }}>
                          {(bt.total_return * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#999' }}>Drawdown</p>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#f44336' }}>
                          {(bt.max_drawdown * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#999' }}>Win Rate</p>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                          {(bt.win_rate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
