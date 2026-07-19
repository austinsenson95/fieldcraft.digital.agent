"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  Lightbulb,
  MessageSquare,
  Terminal,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import { useSidebarStore } from '@/dashboard/store/useSidebarStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/approvals', label: 'Approvals', icon: CheckSquare },
  { path: '/dashboard/leads', label: 'Leads', icon: Users },
  { path: '/dashboard/content', label: 'Content', icon: Calendar },
  { path: '/dashboard/products', label: 'Products', icon: Lightbulb },
  { path: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { path: '/dashboard/logs', label: 'Logs', icon: Terminal },
  { path: '/dashboard/brand', label: 'Brand', icon: BookOpen },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: easeOut }}
      className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border-subtle bg-bg-secondary"
    >
      {/* Logo section */}
      <div className="flex h-14 items-center justify-between border-b border-border-subtle px-3">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-text-accent/10">
            <Sparkles className="h-[18px] w-[18px] text-text-accent" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap text-sm font-semibold text-text-primary"
              >
                FieldCraft
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={toggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          const Icon = item.icon;
          const isHovered = hoveredItem === item.path;

          return (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.path}
                className={cn(
                  'flex h-11 items-center gap-3 rounded-lg px-3 transition-all duration-150',
                  isActive
                    ? 'border-l-[3px] border-l-text-accent bg-bg-tertiary text-text-primary'
                    : 'border-l-[3px] border-l-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                )}
                style={{ justifyContent: collapsed ? 'center' : undefined, paddingLeft: collapsed ? 12 : undefined }}
              >
                <Icon
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-text-accent' : 'text-text-tertiary',
                    'h-5 w-5'
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        'whitespace-nowrap text-sm',
                        isActive ? 'font-medium text-text-primary' : 'font-normal'
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Tooltip for collapsed state */}
              <AnimatePresence>
                {collapsed && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.1 }}
                    className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-bg-quaternary px-3 py-1.5 text-sm text-text-primary shadow-modal whitespace-nowrap"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border-subtle p-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex h-10 items-center gap-3 rounded-lg px-3 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary',
            collapsed && 'justify-center'
          )}
        >
          <Settings className="h-5 w-5 shrink-0 text-text-tertiary" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
