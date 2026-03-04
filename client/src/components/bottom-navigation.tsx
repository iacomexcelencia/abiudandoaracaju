import { MapPin, List, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "map", name: "Mapa", icon: MapPin },
  { id: "list", name: "Lista", icon: List },
  { id: "favorites", name: "Favoritos", icon: Heart },
  { id: "profile", name: "Perfil", icon: User },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 h-full rounded-none ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`nav-tab-${tab.id}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
