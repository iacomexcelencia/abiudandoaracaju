import { useState } from "react";
import { Menu, X, Home, Plus, Settings, Users, BarChart3, Map, FileText, LogOut, CreditCard, Award, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import secretariaLogo from "@assets/secretaria_logo.jpeg";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title = "Painel Administrativo", subtitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/admin",
      active: location === "/admin"
    },
    {
      icon: Plus,
      label: "Pontos Turísticos",
      href: "/admin/spots",
      active: location.startsWith("/admin/spots")
    },
    {
      icon: BarChart3,
      label: "Relatórios",
      href: "/admin/reports",
      active: location.startsWith("/admin/reports")
    },
    {
      icon: Users,
      label: "Feedbacks",
      href: "/admin/feedback",
      active: location.startsWith("/admin/feedback")
    },
    {
      icon: CreditCard,
      label: "Passaportes Digitais",
      href: "/admin/passports",
      active: location.startsWith("/admin/passports")
    },
    {
      icon: Award,
      label: "Badges e Conquistas",
      href: "/admin/badges",
      active: location.startsWith("/admin/badges")
    },
    {
      icon: Route,
      label: "Rotas Turísticas",
      href: "/admin/routes",
      active: location.startsWith("/admin/routes")
    },
    {
      icon: Map,
      label: "Mapa Interativo",
      href: "/admin/map",
      active: location.startsWith("/admin/map")
    },
    {
      icon: FileText,
      label: "QR Codes",
      href: "/admin/qr-codes",
      active: location.startsWith("/admin/qr-codes")
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "/admin/settings",
      active: location.startsWith("/admin/settings")
    }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-3 py-10 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-center">
                <img 
                  src={logoAbiudando} 
                  alt="ABIUDANDO AJU" 
                  className="w-full h-64 object-contain"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden text-orange-600 hover:bg-orange-50 ml-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={`
                      w-full justify-start text-left font-medium transition-all duration-200
                      ${item.active 
                        ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-700 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-700'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                    {item.active && (
                      <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700">
                        Ativo
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Footer com Logo da Secretaria */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <div className="w-full h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center mb-3 shadow-sm">
                <img 
                  src={secretariaLogo} 
                  alt="Logo da Secretaria de Turismo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Sistema oficial da Prefeitura de Aracaju
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-600 hover:text-red-600 hover:border-red-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair do Sistema
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </Button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600">{subtitle}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Sistema Online
                </Badge>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrador'}</p>
                  <p className="text-xs text-gray-500">Secretaria de Turismo</p>
                </div>
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user ? getInitials(user.name) : 'A'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>© 2025 Prefeitura de Aracaju</span>
                <span>•</span>
                <span>Secretaria de Turismo</span>
                <span>•</span>
                <span>Sistema ABIUDANDO AJU v2.0</span>
              </div>
              <div className="text-sm text-gray-500">
                Desenvolvido com ❤️ para o turismo de Aracaju
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}