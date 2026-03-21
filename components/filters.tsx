"use client";

import { useState } from "react";
import { MapFilters, MultiSelectOption } from "@/lib/airtable/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import MultiSelect from "./ui/multi-select";

interface FilterProps {
  filters: MapFilters;
  countryOptions: MultiSelectOption[];
  bodiesOfWaterOptions: MultiSelectOption[];
  minYear: number;
  maxYear: number;
}

function filtersResetKey(f: MapFilters): string {
  return [
    [...f.countries].sort().join(","),
    [...f.bodiesOfWater].sort().join(","),
    f.startYear,
    f.endYear,
  ].join("|");
}

function FiltersForm({
  filters,
  minYear,
  maxYear,
  countryOptions,
  bodiesOfWaterOptions,
}: FilterProps) {
  const [selectedCountry, setSelectedCountry] = useState<string[]>(
    filters.countries
  );
  const [selectedWater, setSelectedWater] = useState<string[]>(
    filters.bodiesOfWater
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [startYear, setStartYear] = useState(filters.startYear || "");
  const [endYear, setEndYear] = useState(filters.endYear || "");

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();

    if (selectedWater.length) {
      newParams.append("body_of_water", selectedWater.join(","));
    }
    if (selectedCountry.length) {
      newParams.append("country", selectedCountry.join(","));
    }
    if (startYear) {
      newParams.append("start_year", "" + startYear);
    }
    if (endYear) {
      newParams.append("end_year", "" + endYear);
    }

    setFiltersOpen(false);
    history.pushState({}, "", `/?${newParams.toString()}`);
  };

  return (
    <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-6 shadow-md bg-background text-base"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Filter media points shown on the map. Click apply when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <MultiSelect
            values={countryOptions}
            label="Countries"
            onSelect={setSelectedCountry}
            selectedOptions={selectedCountry}
          />

          <MultiSelect
            values={bodiesOfWaterOptions}
            label="Bodies of Water"
            onSelect={setSelectedWater}
            selectedOptions={selectedWater}
          />

          <div className="flex flex-col gap-1">
            <Label>Date Range</Label>
            <div className="flex gap-1 items-center">
              <Input
                value={startYear}
                min={minYear}
                max={maxYear}
                onChange={(e) => setStartYear(e.target.value)}
                aria-label="From year"
                type="number"
                placeholder="Start Year"
                className="min-w-28 text-base"
              />
              -
              <Input
                value={endYear}
                min={minYear}
                max={maxYear}
                onChange={(e) => setEndYear(e.target.value)}
                type="number"
                aria-label="Filter by latest release year"
                placeholder="To year"
                className="min-w-28 text-base"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" aria-label="Cancel">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleApplyFilters} aria-label="Apply filters">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Filters(props: FilterProps) {
  return <FiltersForm key={filtersResetKey(props.filters)} {...props} />;
}
