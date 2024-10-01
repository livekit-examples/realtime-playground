"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ConfigurationFormFieldProps,
  ConfigurationFormSchema,
} from "@/components/configuration-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { modalities } from "@/data/modalities";

export function ModalitiesSelector({
  form,
  ...props
}: ConfigurationFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="modalities"
      render={({ field }) => (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <FormItem className="flex flex-row items-center space-y-0 justify-between">
              <FormLabel className="text-sm">Response modalities</FormLabel>
              <Select
                onValueChange={(v) => {
                  if (
                    ConfigurationFormSchema.shape.modalities.safeParse(v)
                      .success
                  ) {
                    field.onChange(v);
                  }
                }}
                defaultValue={form.formState.defaultValues!.modalities!}
                value={field.value}
                aria-label="Response modalities"
                disabled={true}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose modalities" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {modalities.map((modality) => (
                    <SelectItem
                      key={`select-item-modality-${modality.id}`}
                      value={modality.id}
                    >
                      {modality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            className="w-[260px] text-sm"
            side="bottom"
          >
            The set of modalities the model can respond with.
          </HoverCardContent>
        </HoverCard>
      )}
    />
  );
}
