import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages } from "@/lib/languages";

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
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {includeAuto && (
          <SelectItem value="auto">Auto Detect</SelectItem>
        )}
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
