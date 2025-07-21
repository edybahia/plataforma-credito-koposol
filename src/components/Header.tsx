import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de logout do Supabase
    // supabase.auth.signOut();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
      <div className="flex items-center">
        <Button size="icon" variant="outline" onClick={toggleSidebar}>
          <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isSidebarCollapsed && "rotate-180")} />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar propostas, clientes, integradores..."
            className="w-full rounded-lg bg-slate-100 pl-8 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="sr-only">Notificações</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="overflow-hidden rounded-full border-2 border-slate-200 hover:border-blue-500 transition-colors">
              <User className="h-5 w-5 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
