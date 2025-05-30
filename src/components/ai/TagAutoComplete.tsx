import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import AutoComplete from "./AutoComplete";

interface TagAutoCompleteProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  label?: string;
  className?: string;
}

const TagAutoComplete = ({ 
  tags, 
  onTagsChange, 
  suggestions, 
  placeholder = "Add a tag...", 
  label,
  className 
}: TagAutoCompleteProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium mb-2 block">{label}</label>
      )}
      
      <div className="space-y-3">
        {/* Existing tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Input with autocomplete */}
        <div className="flex gap-2">
          <AutoComplete
            value={inputValue}
            onChange={handleInputChange}
            suggestions={suggestions.filter(s => !tags.includes(s))}
            placeholder={placeholder}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="px-3 py-2 bg-atlas-purple text-white rounded-md hover:bg-opacity-90 flex items-center"
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter(suggestion => !tags.includes(suggestion))
              .slice(0, 6)
              .map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-atlas-purple hover:text-white text-xs"
                  onClick={() => addTag(suggestion)}
                >
                  + {suggestion}
                </Badge>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagAutoComplete;
