import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prevState => !prevState);
  };

  // Efeito para ajustar a classe do body, útil para alguns estilos globais se necessário
  useEffect(() => {
    document.body.classList.add('admin-layout');
    return () => {
      document.body.classList.remove('admin-layout');
    };
  }, []);

  return (
    <div>
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar}
      />
      <div className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        )}>
        <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 bg-slate-50/50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
