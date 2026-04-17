import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(phone, password);
      navigate('/map');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      background: 'linear-gradient(135deg, #0a1118 0%, #050a0f 100%)'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', padding: '40px 30px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            background: 'var(--primary)',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 30px var(--primary-glow)'
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Suraksha Web</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '8px' }}>Safety first, everywhere.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              background: 'rgba(231, 76, 60, 0.1)', 
              color: '#e74c3c', 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              marginBottom: '20px',
              border: '1px solid rgba(231, 76, 60, 0.2)'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Smartphone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              <input 
                type="tel" 
                placeholder="9876543210" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '10px',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  padding: '12px 40px 12px 40px',
                  borderRadius: '10px',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <div 
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', color: 'var(--text-dim)' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: 'var(--text-dim)' }}>
          Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>Register</span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
