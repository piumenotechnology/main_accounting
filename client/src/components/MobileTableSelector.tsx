import { useState, useRef, useEffect } from "react";
import { TableOption } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

interface MobileTableSelectorProps {
  options: TableOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function MobileTableSelector({ options, value, onChange }: MobileTableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get the selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayLabel = selectedOption ? selectedOption.label : "Select a table";
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };
  
  // Select an option
  const selectOption = (option: TableOption) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        onClick={toggleDropdown}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className="h-5 w-5 text-gray-500 ml-2 shrink-0" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-y-auto border border-gray-200">
          <div className="p-2">
            <Input
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <ul className="py-1">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                  option.value === value ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`}
                onClick={() => selectOption(option)}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
