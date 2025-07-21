
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, Link2, Kanban, LogOut } from 'lucide-react';
import { KoposolLogo } from './KoposolLogo';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

const IntegratorSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/integrator/dashboard'
    },
    {
      title: 'Subir Proposta',
      icon: Plus,
      path: '/integrator/submit-proposal'
    },
    {
      title: 'Gerar Link de Proposta',
      icon: Link2,
      path: '/integrator/generate-link'
    },
    {
      title: 'Minhas Propostas',
      icon: Kanban,
      path: '/integrator/kanban'
    }
  ];

  const handleLogout = () => {
    toast.success('Logout realizado com sucesso!');
    window.location.href = '/login';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <KoposolLogo size={isCollapsed ? "sm" : "md"} />
          {!isCollapsed && (
            <div>
              <p className="text-xs text-sidebar-foreground/70 mt-1">
                Painel do Integrador
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">I</span>
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Integrador</p>
              <p className="text-xs text-sidebar-foreground/70">integrador@exemplo.com</p>
            </div>
          </div>
        )}
        
        <SidebarMenuButton 
          onClick={handleLogout}
          tooltip={isCollapsed ? "Logout" : undefined}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default IntegratorSidebar;
