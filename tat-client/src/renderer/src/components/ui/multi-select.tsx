import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FRAMEWORKS = [
  "React",
  "Next.js",
  "Angular",
  "Vue",
  "Spring Boot",
  "Node.js",
  "Express",
  "Tailwind CSS",
  "MySQL",
  "MongoDB",
];

export default function MultiSelect() {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  function toggle(item: string) {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between min-h-10"
        >
          <div className="flex flex-wrap gap-2">
            {selected.length === 0
              ? "Select Frameworks"
              : selected.map((item) => (
                  <Badge key={item}>
                    {item}
                  </Badge>
                ))}
          </div>

          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[350px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search framework..." />

          <CommandEmpty>No framework found.</CommandEmpty>

          <CommandGroup>
            {FRAMEWORKS.map((framework) => (
              <CommandItem
                key={framework}
                onSelect={() => toggle(framework)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selected.includes(framework)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

                {framework}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}