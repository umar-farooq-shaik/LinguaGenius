import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { languages, getLanguageName } from "@/lib/languages";

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  includeAuto?: boolean;
}

export default function LanguageSelect({
  value,
  onChange,
  disabled = false,
  includeAuto = false,
}: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(languages);
  const [searchQuery, setSearchQuery] = useState("");

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery) {
      const results = languages.filter(
        (lang) =>
          lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(languages);
    }
  }, [searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[220px] justify-between",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {value === "auto"
            ? "Auto Detect"
            : value
            ? getLanguageName(value)
            : "Select language..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search language..."
              className="h-9 border-0 outline-none focus:ring-0"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {includeAuto && (
                <CommandItem
                  key="auto"
                  value="auto"
                  onSelect={() => {
                    onChange("auto");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "auto" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Auto Detect
                </CommandItem>
              )}
              {searchResults.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={() => {
                    onChange(language.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === language.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
