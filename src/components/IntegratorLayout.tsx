
import React from 'react';
import IntegratorSidebar from '@/components/IntegratorSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface IntegratorLayoutProps {
  children: React.ReactNode;
}

const IntegratorLayout = ({ children }: IntegratorLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <IntegratorSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default IntegratorLayout;
