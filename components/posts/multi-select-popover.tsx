"use client"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export type MultiSelectOption = { value: string; label: string }

type Props = {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  /** Shown on the trigger button when nothing is selected yet. */
  placeholder: string
  /** Shown on the trigger button once at least one option is selected, e.g. `(n) => `${n} rutas seleccionadas`` */
  selectedLabel: (count: number) => string
  className?: string
}

/** Dropdown that lets the user pick several options at once (the list stays
 *  open across multiple picks) and shows the current picks as removable
 *  chips underneath once the dropdown is closed. Used for route selection
 *  (AscentForm) and the matching route filter (PostFeed). */
export function MultiSelectPopover({
  options,
  selected,
  onChange,
  placeholder,
  selectedLabel,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const selectedOptions = options.filter((o) => selected.includes(o.value))

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  function remove(value: string) {
    onChange(selected.filter((v) => v !== value))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className={cn(selected.length === 0 && "text-muted-foreground")}>
              {selected.length > 0 ? selectedLabel(selected.length) : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggle(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-forest bg-forest text-white"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="outline"
              className="gap-1 border-forest/40 pr-1 text-forest"
            >
              {option.label}
              <button
                type="button"
                onClick={() => remove(option.value)}
                aria-label={option.label}
                className="rounded-full p-0.5 hover:bg-forest/10"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
