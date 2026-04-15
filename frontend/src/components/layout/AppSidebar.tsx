import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Target, ClipboardCheck, BarChart3,
  MessageSquare, UserCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Goals', path: '/goals', icon: Target },
  { label: 'Reviews', path: '/reviews', icon: ClipboardCheck },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: '360° Feedback', path: '/feedback', icon: MessageSquare },
  { label: 'Profiles', path: '/profile/', icon: UserCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { selectedEmployee, selectedEmployeeId } = usePerformanceContext();

  return (
    <aside
      className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-heading text-lg font-bold text-sidebar-primary-foreground tracking-tight">
            <span className="text-sidebar-primary">Perf</span>OS
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(item => {
          const to = item.path === '/profile/' ? `/profile/${selectedEmployeeId}` : item.path;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
              {selectedEmployee.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{selectedEmployee.name}</p>
              <p className="text-xs text-sidebar-muted truncate">{selectedEmployee.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
