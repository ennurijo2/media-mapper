"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

interface SearchProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function Search({ value, onValueChange }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8 text-base"
        placeholder="Search Media Locations"
        aria-label="Search media locations"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
}
