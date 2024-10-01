"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ConfigurationFormFieldProps } from "@/components/configuration-form";
import { Input } from "@/components/ui/input";

export function MaxOutputTokensSelector({
  form,
  schema,
  ...props
}: ConfigurationFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="maxOutputTokens"
      render={({ field }) => (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">Max output tokens</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    step={1}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? null
                          : Math.max(1, parseInt(e.target.value));
                      field.onChange(value);
                    }}
                    className="w-[100px]"
                    placeholder="No limit"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            className="w-[260px] text-sm"
            side="bottom"
          >
            The maximum number of tokens used in each response output. Leave
            empty for no limit.
          </HoverCardContent>
        </HoverCard>
      )}
    />
  );
}
