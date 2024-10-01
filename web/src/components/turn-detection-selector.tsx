"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { turnDetectionTypes } from "@/data/turn-end-types";
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
import { ConfigurationFormFieldProps } from "@/components/configuration-form";
import { VadThresholdSelector } from "./vad-threshold-selector";
import { VadPrefixPaddingSelector } from "./vad-prefix-padding-selector";
import { VadSilenceDurationSelector } from "./vad-silence-duration-selector";

export function TurnDetectionSelector({
  form,
  ...props
}: ConfigurationFormFieldProps) {
  const turnDetection = form.watch("turnDetection");

  return (
    <div>
      <FormField
        control={form.control}
        name="turnDetection"
        render={({ field }) => (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <FormItem className="flex flex-row items-center space-y-0 justify-between">
                <FormLabel className="text-sm">Turn detection</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={true}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a turn detection mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {turnDetectionTypes.map((endType) => (
                      <SelectItem
                        key={`turn-detection-type-${endType.id}`}
                        value={endType.id}
                      >
                        {endType.name}
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
              Currently only Server VAD is supported. The model will perform
              automatic turn detection.
            </HoverCardContent>
          </HoverCard>
        )}
      />
      {turnDetection === "server_vad" && (
        <div className="ml-2 space-y-2 border-l-2 border-gray-200 pl-4 mt-2">
          <VadThresholdSelector form={form} />
          <VadPrefixPaddingSelector form={form} />
          <VadSilenceDurationSelector form={form} />
        </div>
      )}
    </div>
  );
}
