"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TodoFilter } from "@/lib/types";
import Image from "next/image";

interface TodoNavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TodoFilter;
  onFilterChange: (value: TodoFilter) => void;
}

const filterOptions: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function TodoNavbar({ search, onSearchChange, filter, onFilterChange }: TodoNavbarProps) {
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between gap-3 h-14 px-8">
        <div className="flex items-center gap-4">
          <Image src="/images/logo.png" className="w-auto h-8" alt="Logo" width={1000} height={1000} />
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-96"
            />
          </div>
        </div>

        <Select value={filter} onValueChange={(v) => onFilterChange(v as TodoFilter)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
