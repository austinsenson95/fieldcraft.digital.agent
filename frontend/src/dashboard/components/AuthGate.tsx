"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AuthGateProps {
  onLogin: () => void;
}

export default function AuthGate({ onLogin }: AuthGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fieldcraft') {
      localStorage.setItem('dashboard_auth', 'true');
      onLogin();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: '#0f1f17' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center"
        style={{ padding: '24px' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center" style={{ marginBottom: '48px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
            <span
              className="text-white font-semibold"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '16px' }}
            >
              Fieldcraft
            </span>
            <span
              className="inline-block rounded-full"
              style={{ width: '8px', height: '8px', background: '#2ecc7a' }}
            />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#5a6a5a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Orchestrator
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-white text-center"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            marginBottom: '8px',
          }}
        >
          Agent Swarm Orchestrator
        </h3>
        <p
          className="text-center"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '16px',
            color: '#5a6a5a',
            marginBottom: '32px',
          }}
        >
          Authorized access only
        </p>

        {/* Form */}
        <motion.form
          animate={shaking ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full"
          style={{ maxWidth: '320px' }}
        >
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-full outline-none transition-all duration-200"
            style={{
              background: '#162b1f',
              border: `1px solid ${error ? '#e74c3c' : 'rgba(46, 204, 122, 0.1)'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '16px',
              boxShadow: error ? '0 0 0 3px rgba(231, 76, 60, 0.15)' : 'none',
            }}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '14px',
                color: '#e74c3c',
              }}
            >
              Incorrect password
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full rounded-full transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: '#2ecc7a',
              color: '#0f1f17',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Enter
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
