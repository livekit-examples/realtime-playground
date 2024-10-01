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
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import {
  ConfigurationFormFieldProps,
  ConfigurationFormSchema,
} from "@/components/configuration-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const getMinMaxForField = (schema: z.ZodNumber) => {
  const minCheck = schema._def.checks.find((check) => check.kind === "min");
  const maxCheck = schema._def.checks.find((check) => check.kind === "max");

  return {
    minValue: minCheck ? minCheck.value : undefined,
    maxValue: maxCheck ? maxCheck.value : undefined,
  };
};

export function TemperatureSelector({
  form,
  schema,
  ...props
}: ConfigurationFormFieldProps) {
  const { minValue, maxValue } = getMinMaxForField(
    ConfigurationFormSchema.shape.temperature,
  );

  const [isHoveringSlider, setIsHoveringSlider] =
    React.useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHoveringSlider(true)}
      onMouseLeave={() => setIsHoveringSlider(false)}
      className="pb-2"
    >
      <FormField
        control={form.control}
        name="temperature"
        render={({ field }) => (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Temperature</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`shadow-none font-light py-0 h-8 max-w-[100px] text-right ${
                        isHoveringSlider ? " border" : " border-none"
                      }`}
                    />
                  </FormControl>
                </div>
                <FormControl>
                  <Slider
                    max={maxValue}
                    min={minValue}
                    defaultValue={[form.formState.defaultValues!.temperature!]}
                    step={0.01}
                    onValueChange={(v) => field.onChange(v[0])}
                    value={[field.value]}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    aria-label="Temperature"
                  />
                </FormControl>
              </FormItem>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-[260px]" side="bottom">
              Adjust the randomness of the response. Lowering the temperature
              will make the response more deterministic and repetitive.
            </HoverCardContent>
          </HoverCard>
        )}
      />
    </div>
  );
}
