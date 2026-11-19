"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DEFAULT_TIME_ZONE,
  getLocalTimeZone,
  getSupportedTimeZones,
  getTimeZoneKeywords,
  getTimeZoneOffsetLabel,
  groupTimeZones,
  scoreTimeZoneMatch,
} from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * cmdk's default matcher is fuzzy (any letters in order), which ranks unrelated zones first,
 * so use a strict one: every typed word must appear, and word-start matches rank highest.
 */
const filterZones = (value, search, keywords) =>
  scoreTimeZoneMatch(`${value} ${(keywords ?? []).join(" ")}`, search);

/** One selectable zone: tick if current, name, and its UTC offset on the right. */
function ZoneItem({ zone, offset, isSelected, onSelect, valuePrefix = "" }) {
  // The search text is matched against `value` (name, id, offset) and `keywords` (aliases).
  const searchValue = `${valuePrefix}${zone.replaceAll("_", " ")} ${zone} ${offset}`;

  return (
    <CommandItem
      value={searchValue}
      keywords={getTimeZoneKeywords(zone)}
      onSelect={() => onSelect(zone)}
    >
      <Check className={cn("size-4", isSelected ? "opacity-100" : "opacity-0")} />
      <span className="truncate">{zone}</span>
      <span className="ml-auto shrink-0 text-xs text-muted-foreground">{offset}</span>
    </CommandItem>
  );
}

/**
 * Searchable time-zone picker: type a city or an offset to filter, zones are grouped by region,
 * and the viewer's own zone plus UTC are pinned on top.
 */
export default function TimeZoneSelect({ id, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // The zone list and the viewer's zone are only known in the browser, so they load after mount
  // (keeps server and client markup identical during hydration).
  const [zones, setZones] = useState([]);
  const [localZone, setLocalZone] = useState(null);
  useEffect(() => {
    setZones(getSupportedTimeZones());
    setLocalZone(getLocalTimeZone());
  }, []);


  // The current value is always included: the browser can report an alias ("Asia/Calcutta")
  // that is missing from the standard list ("Asia/Kolkata").
  const suggested = useMemo(
    () => [...new Set([value, localZone, DEFAULT_TIME_ZONE].filter(Boolean))],
    [value, localZone],
  );

  // While browsing (not searching) the pinned zones are listed once, under Suggested only.
  const groups = useMemo(() => {
    const browsable = search ? zones : zones.filter((zone) => !suggested.includes(zone));
    return groupTimeZones(browsable);
  }, [zones, suggested, search]);

  // About 100 ms for all zones, so only compute once the picker is actually opened.
  const offsets = useMemo(() => {
    const map = new Map();
    if (!open) return map;
    for (const zone of [...suggested, ...zones]) map.set(zone, getTimeZoneOffsetLabel(zone));
    return map;
  }, [open, suggested, zones]);

  const handleSelect = (zone) => {
    onChange(zone);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-72 justify-between font-normal"
        >
          <span className="truncate">{value || "Select time zone"}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-72">
        <Command filter={filterZones}>
          <CommandInput
            placeholder="Search city or region..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="thin-scrollbar max-h-64">
            <CommandEmpty>No time zone found.</CommandEmpty>

            {/* Pinned shortcuts are hidden while searching so results aren't duplicated. */}
            {!search && (
              <CommandGroup heading="Suggested">
                {suggested.map((zone) => (
                  <ZoneItem
                    key={zone}
                    zone={zone}
                    valuePrefix="suggested "
                    offset={offsets.get(zone) ?? ""}
                    isSelected={zone === value}
                    onSelect={handleSelect}
                  />
                ))}
              </CommandGroup>
            )}

            {groups.map(({ region, zones: regionZones }) => (
              <CommandGroup key={region} heading={region}>
                {regionZones.map((zone) => (
                  <ZoneItem
                    key={zone}
                    zone={zone}
                    offset={offsets.get(zone) ?? ""}
                    isSelected={zone === value}
                    onSelect={handleSelect}
                  />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
