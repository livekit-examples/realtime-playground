"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ConfigurationFormFieldProps,
  ConfigurationFormSchema,
} from "@/components/configuration-form";
import { transcriptionModels } from "@/data/transcription-models";

export function TranscriptionSelector({
  form,
  ...props
}: ConfigurationFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="transcriptionModel"
      render={({ field }) => (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <FormItem className="flex flex-row items-center space-y-0 justify-between">
              <FormLabel className="text-sm">Transcription</FormLabel>
              <Select
                onValueChange={(v) => {
                  if (
                    ConfigurationFormSchema.shape.transcriptionModel.safeParse(
                      v,
                    ).success
                  ) {
                    field.onChange(v);
                  }
                }}
                defaultValue={form.formState.defaultValues!.transcriptionModel!}
                value={field.value}
                aria-label="Transcription model"
                disabled={true}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose transcription model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transcriptionModels.map((transcriptionModel) => (
                    <SelectItem
                      key={`select-item-transcription-model-${transcriptionModel.id}`}
                      value={transcriptionModel.id}
                    >
                      {transcriptionModel.name}
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
            Transcription from whisper-1. Not configurable at this time.
          </HoverCardContent>
        </HoverCard>
      )}
    />
  );
}
