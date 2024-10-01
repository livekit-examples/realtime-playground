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
import { models } from "@/data/models";

export function ModelSelector({ form, ...props }: ConfigurationFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <FormItem className="flex flex-row items-center space-y-0 justify-between">
              <FormLabel className="text-sm">Model</FormLabel>
              <Select
                onValueChange={(v) => {
                  if (
                    ConfigurationFormSchema.shape.model.safeParse(v).success
                  ) {
                    field.onChange(v);
                  }
                }}
                defaultValue={form.formState.defaultValues!.model!}
                value={field.value}
                aria-label="Model"
                disabled={true}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem
                      key={`select-item-model-${model.id}`}
                      value={model.id}
                    >
                      {model.name}
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
            Use the new realtime version of GPT-4o
          </HoverCardContent>
        </HoverCard>
      )}
    />
  );
}
