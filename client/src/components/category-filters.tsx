import { MapPin, Building, Palette, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "praia", name: "Praias", icon: MapPin, color: "primary" },
  { id: "historico", name: "Históricos", icon: Building, color: "accent" },
  { id: "cultura", name: "Cultura", icon: Palette, color: "secondary" },
  { id: "restaurante", name: "Restaurantes", icon: UtensilsCrossed, color: "secondary" },
];

export function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              variant={isSelected ? "default" : "secondary"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
              data-testid={`category-filter-${category.id}`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
