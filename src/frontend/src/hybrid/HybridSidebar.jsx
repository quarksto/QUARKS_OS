import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
  { path: '/workspace', icon: 'forum', label: 'Workspace', countKey: 'leadCount' },
  { path: '/funnel', icon: 'view_kanban', label: 'Funil' },
  { path: '/leads', icon: 'person_search', label: 'Leads' },
  { path: '/proposals', icon: 'description', label: 'Propostas' },
  { path: '/settings', icon: 'settings', label: 'Configurações' },
];

export function HybridSidebar({ collapsed, onToggle, leadCount }) {
  const location = useLocation();

  return (
    <aside
      className={`shrink-0 flex flex-col bg-petroleum-900 text-white transition-[width] duration-200 ${collapsed ? 'w-16' : 'w-52'
        }`}
    >
      <div className="p-3 flex items-center justify-between border-b border-white/10 min-h-[52px]">
        {!collapsed && (
          <span className="text-sm font-semibold text-white truncate">Quarks OS</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(({ path, icon, label, countKey }) => {
          const isActive =
            location.pathname === path ||
            (path === '/workspace' && location.pathname.startsWith('/workspace')) ||
            (path === '/proposals' && location.pathname.startsWith('/proposals')) ||
            (path === '/leads' && location.pathname.startsWith('/leads')) ||
            (path === '/settings' && location.pathname.startsWith('/settings'));
          const count = countKey === 'leadCount' ? leadCount : undefined;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${isActive
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/80 hover:bg-white/5 hover:text-white font-medium'
                } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? (count != null ? `${label} (${count})` : label) : undefined}
            >
              <span className="material-symbols-outlined shrink-0 relative" style={{ fontSize: '20px' }}>
                {icon}
                {collapsed && count != null && count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-solar-500 text-white text-[10px] font-bold">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </span>
              {!collapsed && (
                <span className="truncate flex-1 flex items-center gap-2">
                  <span>{label}</span>
                  {count != null && count > 0 && (
                    <span className="shrink-0 text-[10px] font-semibold text-white/90 bg-white/20 rounded-full px-1.5 py-0.5">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
