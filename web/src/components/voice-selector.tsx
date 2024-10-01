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
import { voices } from "@/data/voices";

export function VoiceSelector({ form, ...props }: ConfigurationFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="voice"
      render={({ field }) => (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <FormItem className="flex flex-row items-center space-y-0 justify-between">
              <FormLabel className="text-sm">Voice</FormLabel>
              <Select
                onValueChange={(v) => {
                  if (
                    ConfigurationFormSchema.shape.voice.safeParse(v).success
                  ) {
                    field.onChange(v);
                  }
                }}
                defaultValue={form.formState.defaultValues!.voice!}
                value={field.value}
                aria-label="Voice"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose voice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem
                      key={`select-item-voice-${voice.id}`}
                      value={voice.id}
                    >
                      {voice.name}
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
            Choose the base voice for the model. Changes require a reconnect.
          </HoverCardContent>
        </HoverCard>
      )}
    />
  );
}
