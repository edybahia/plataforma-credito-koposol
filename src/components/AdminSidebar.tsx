import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, KanbanSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed }) => {
  const navLinks = [
    {
      href: '/admin/dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/integrators',
      title: 'Gerenciar Integradores',
      icon: Users,
    },
    {
      href: '/admin/proposals',
      title: 'Kanban de Propostas',
      icon: KanbanSquare,
    },
    {
      href: '/admin/settings',
      title: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-40 bg-gray-50 border-r h-screen p-4 transition-all duration-300",
        isCollapsed ? 'w-20' : 'w-64'
      )}>
      <div className="flex items-center justify-center mb-8 h-16">
        {/* Assuming logo path, adjust if necessary */}
        {isCollapsed ? (
          <img src="/lovable-uploads/miniloho.png" alt="Koposol Mini Logo" className="h-9" />
        ) : (
          <img src="/lovable-uploads/97f2478e-2e56-41c6-8d23-cbaf96c39384.png" alt="Koposol Logo" className="h-9" />
        )}
      </div>
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:bg-gray-100'
              )
            }
          >
            <link.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            <span className={cn("truncate", isCollapsed && "sr-only")}>{link.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
