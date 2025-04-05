import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";

interface DropdownProps {
  options: { label: string; value: string }[];
  placeholder: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const Dropdown = ({ options, placeholder, onValueChange, className }: DropdownProps) => {
  return (
    <Select onValueChange={onValueChange} className={`${className}`}>
      <SelectTrigger variant="outline" size="md" className="border-accent flex justify-between">
        <SelectInput placeholder={placeholder} className="placeholder:text-accent text-accent py-2" />
        <SelectIcon className="mr-3 text-accent" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop className="bg-secondary" />
        <SelectContent className="bg-black">
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator className="bg-white" />
          </SelectDragIndicatorWrapper>
          {options.map((option) => (
            <SelectItem key={option.value} label={option.label} value={option.value} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default Dropdown;
