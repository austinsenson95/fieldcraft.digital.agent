"use client";

import { useState, useCallback, useSyncExternalStore, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import AuthGate from './AuthGate';
import { useSidebarStore } from '@/dashboard/store/useSidebarStore';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

// Static auth flag: nothing to subscribe to — it only changes via AuthGate.
const emptySubscribe = () => () => {};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  // Read the stored auth flag via useSyncExternalStore so the first client
  // render matches the server (both false) and the real value resolves
  // after hydration — same timing as the previous mount effect.
  // Gate on `mounted` so SSR/first client render shows nothing, matching
  // the previous effect-based mount behaviour exactly.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const storedAuth = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem('dashboard_auth') === 'true',
    () => false
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const isAuthenticated = storedAuth || loggedIn;
  const showAuth = mounted && !storedAuth;

  const handleLogin = useCallback(() => {
    setLoggedIn(true);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showAuth && !isAuthenticated && (
          <motion.div key="auth" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <AuthGate onLogin={handleLogin} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthenticated && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-[100dvh] bg-bg-primary"
          >
            <DashboardSidebar />
            <DashboardTopBar />
            <motion.main
              animate={{ marginLeft: collapsed ? 64 : 240 }}
              transition={{ duration: 0.2, ease: easeOut }}
              className="mt-14 min-h-[calc(100dvh-56px)] p-6"
            >
              {children}
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
