import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar pontos turísticos..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search after 300ms of no typing
    setTimeout(() => {
      if (value === e.target.value) {
        onSearch(value);
      }
    }, 300);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-ring focus:outline-none"
            data-testid="search-input"
          />
        </form>
      </div>
    </div>
  );
}
