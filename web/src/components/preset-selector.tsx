"use client";

import * as React from "react";
import { CaretSortIcon, FileIcon } from "@radix-ui/react-icons";
import { Check, Trash } from "lucide-react";
import { PopoverProps } from "@radix-ui/react-popover";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Preset, PresetGroup } from "../data/presets";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { useConnection } from "@/hooks/use-connection";

export function PresetSelector(props: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [presetToDelete, setPresetToDelete] = React.useState<Preset | null>(
    null,
  );
  const { pgState, dispatch, helpers } = usePlaygroundState();
  const { disconnect, connect, shouldConnect } = useConnection();

  const [lastPresetId, setLastPresetId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (pgState.selectedPresetId !== lastPresetId) {
      setLastPresetId(pgState.selectedPresetId);
      if (shouldConnect) {
        disconnect().then(() => {
          connect();
        });
      }
    }
  }, [
    pgState.selectedPresetId,
    shouldConnect,
    disconnect,
    connect,
    lastPresetId,
  ]);

  const handleDelete = () => {
    if (presetToDelete) {
      dispatch({
        type: "DELETE_USER_PRESET",
        payload: presetToDelete.id,
      });
      setShowDeleteDialog(false);
      setPresetToDelete(null);
      toast({
        title: "Preset removed",
        description: "Your saved preset has been removed.",
      });
    }
  };

  const handlePresetSelect = (presetId: string | null) => {
    dispatch({
      type: "SET_SELECTED_PRESET_ID",
      payload: presetId,
    });
    setOpen(false);

    // Clear URL for non-default presets
    const selectedPreset = helpers.getSelectedPreset({
      ...pgState,
      selectedPresetId: presetId,
    });
    if (selectedPreset && !selectedPreset.defaultGroup) {
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (selectedPreset && selectedPreset.defaultGroup) {
      // Update URL for default presets
      const params = helpers.encodeToUrlParams({
        ...pgState,
        selectedPresetId: presetId,
      });
      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}${params ? `?${params}` : ""}`,
      );
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-label="Load…"
            aria-expanded={open}
            className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
          >
            {(() => {
              const selectedPreset = helpers.getSelectedPreset(pgState);
              return (
                <div className="flex items-center">
                  {selectedPreset?.icon && (
                    <selectedPreset.icon className="mr-2 h-4 w-4" />
                  )}
                  <span>{selectedPreset?.name || "Load…"}</span>
                </div>
              );
            })()}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search…" />
            <CommandList className="max-h-[320px]">
              {pgState.userPresets.length > 0 && (
                <CommandGroup heading="Saved">
                  {pgState.userPresets.map((preset: Preset) => (
                    <CommandItem
                      key={preset.id}
                      value={preset.id}
                      onSelect={() => handlePresetSelect(preset.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="flex items-center">
                              {preset.icon && (
                                <preset.icon className="mr-2 h-4 w-4" />
                              )}
                              <span>{preset.name}</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="w-80"
                            side="bottom"
                            align="start"
                            alignOffset={20}
                          >
                            <p>{preset.description}</p>
                          </HoverCardContent>
                        </HoverCard>
                        <div className="flex items-center space-x-2">
                          <Check
                            className={cn(
                              "h-4 w-4",
                              pgState.selectedPresetId === preset.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPresetToDelete(preset);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
                          </Button>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator />

              <CommandGroup>
                <CommandItem
                  value="blank"
                  onSelect={() => handlePresetSelect(null)}
                >
                  <div className="flex items-center">
                    <FileIcon className="mr-2 h-4 w-4" />
                    <span>Start from scratch</span>
                  </div>
                </CommandItem>
              </CommandGroup>

              {Object.values(PresetGroup).map((group) => (
                <CommandGroup key={group} heading={group}>
                  <CommandEmpty>No examples found.</CommandEmpty>
                  {helpers
                    .getDefaultPresets()
                    .filter((preset) => preset.defaultGroup === group)
                    .map((preset: Preset) => (
                      <CommandItem
                        key={preset.id}
                        value={preset.id}
                        onSelect={() => handlePresetSelect(preset.id)}
                      >
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="flex items-center">
                              {preset.icon && (
                                <preset.icon className="mr-2 h-4 w-4" />
                              )}
                              <span>{preset.name}</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="w-80"
                            side="bottom"
                            align="start"
                            alignOffset={20}
                          >
                            <p>{preset.description}</p>
                          </HoverCardContent>
                        </HoverCard>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 mr-2",
                            pgState.selectedPresetId === preset.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{presetToDelete?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
