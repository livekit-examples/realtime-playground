import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { useState, useEffect } from "react";
import { Preset } from "@/data/presets";
import { Save } from "lucide-react";

export function PresetSave() {
  const { pgState, dispatch, helpers } = usePlaygroundState();
  const selectedPreset = helpers.getSelectedPreset(pgState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setName(
      selectedPreset?.defaultGroup
        ? `${selectedPreset.name} (copy)`
        : selectedPreset?.name || "",
    );
    setDescription(selectedPreset?.description || "");
  }, [selectedPreset]);

  const handleSave = () => {
    const newPreset: Preset = {
      id:
        selectedPreset && !selectedPreset.defaultGroup
          ? selectedPreset.id
          : Math.random().toString(36).substr(2, 9),
      name,
      description,
      instructions: pgState.instructions,
      sessionConfig: pgState.sessionConfig,
      defaultGroup: undefined,
    };

    dispatch({ type: "SAVE_USER_PRESET", payload: newPreset });
    if (selectedPreset?.id !== newPreset.id) {
      dispatch({ type: "SET_SELECTED_PRESET_ID", payload: newPreset.id });
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-sm font-semibold">
          <Save className="w-4 h-4" />
          <span className="md:ml-2 hidden md:block">Save</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Save preset</DialogTitle>
          <DialogDescription>
            This will save the current playground settings so you can access it
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            className="text-sm font-semibold"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
