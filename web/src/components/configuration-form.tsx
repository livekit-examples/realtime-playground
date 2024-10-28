"use client";

import { useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { SessionConfig } from "@/components/session-config";
import { TurnDetectionTypeId } from "@/data/turn-end-types";
import { VoiceId } from "@/data/voices";
import { ModelId } from "@/data/models";
import { UseFormReturn } from "react-hook-form";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import {
  useConnectionState,
  useLocalParticipant,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { Button } from "@/components/ui/button";
import { defaultSessionConfig } from "@/data/playground-state";
import { useConnection } from "@/hooks/use-connection";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModalitiesId } from "@/data/modalities";
import { TranscriptionModelId } from "@/data/transcription-models";
export const ConfigurationFormSchema = z.object({
  model: z.nativeEnum(ModelId),
  transcriptionModel: z.nativeEnum(TranscriptionModelId),
  turnDetection: z.nativeEnum(TurnDetectionTypeId),
  modalities: z.nativeEnum(ModalitiesId),
  voice: z.nativeEnum(VoiceId),
  temperature: z.number().min(0.6).max(1.2),
  maxOutputTokens: z.number().nullable(),
  vadThreshold: z.number().min(0).max(1),
  vadSilenceDurationMs: z.number().min(0).max(5000),
  vadPrefixPaddingMs: z.number().min(0).max(5000),
});

export interface ConfigurationFormFieldProps {
  form: UseFormReturn<z.infer<typeof ConfigurationFormSchema>>;
  schema?: typeof ConfigurationFormSchema;
}

export function ConfigurationForm() {
  const { pgState, dispatch } = usePlaygroundState();
  const connectionState = useConnectionState();
  const { voice, disconnect, connect } = useConnection();
  const { localParticipant } = useLocalParticipant();
  const form = useForm<z.infer<typeof ConfigurationFormSchema>>({
    resolver: zodResolver(ConfigurationFormSchema),
    defaultValues: { ...defaultSessionConfig },
    mode: "onChange",
  });
  const formValues = form.watch();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to track timeout
  const { toast } = useToast();
  const { agent } = useVoiceAssistant();

  const updateConfig = useCallback(async () => {
    const values = pgState.sessionConfig;
    const attributes: { [key: string]: string } = {
      instructions: pgState.instructions,
      voice: values.voice,
      turn_detection: JSON.stringify({
        type: values.turnDetection,
        threshold: values.vadThreshold,
        silence_duration_ms: values.vadSilenceDurationMs,
        prefix_padding_ms: values.vadPrefixPaddingMs,
      }),
      modalities: values.modalities,
      temperature: values.temperature.toString(),
      max_output_tokens: values.maxOutputTokens
        ? values.maxOutputTokens.toString()
        : "",
    };
    // Check if the local participant already has attributes set
    const hadExistingAttributes =
      Object.keys(localParticipant.attributes).length > 0;

    // Check if only the voice attribute has changed
    const onlyVoiceChanged = Object.keys(attributes).every(
      (key) =>
        key === "voice" ||
        attributes[key] === (localParticipant.attributes[key] as string),
    );

    // If only voice changed, or if there were no existing attributes, don't update or show toast
    if (onlyVoiceChanged) {
      return;
    }

    if (!agent?.identity) {
      return;
    }

    try {
      let response = await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "pg.updateConfig",
        payload: JSON.stringify(attributes),
      });
      let responseObj = JSON.parse(response);
      if (responseObj.changed) {
        toast({
          title: "Configuration Updated",
          description: "Your changes have been applied successfully.",
          variant: "success",
        });
      }
    } catch (e) {
      toast({
        title: "Error Updating Configuration",
        description:
          "There was an error updating your configuration. Please try again.",
        variant: "destructive",
      });
    }
  }, [
    pgState.sessionConfig,
    pgState.instructions,
    localParticipant,
    toast,
    agent,
  ]);

  // Function to debounce updates when user stops interacting
  const handleDebouncedUpdate = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current); // Clear existing timeout
    }

    // Set a new timeout to perform the update after 500ms of inactivity
    debounceTimeoutRef.current = setTimeout(() => {
      updateConfig();
    }, 500); // Adjust delay as needed
  }, [updateConfig]);

  // Propagate form upates from the user
  useEffect(() => {
    if (form.formState.isValid && form.formState.isDirty) {
      dispatch({
        type: "SET_SESSION_CONFIG",
        payload: formValues,
      });
    }
  }, [formValues, dispatch, form]);

  useEffect(() => {
    if (ConnectionState.Connected === connectionState) {
      handleDebouncedUpdate(); // Call debounced update when form changes
    }

    form.reset(pgState.sessionConfig);
  }, [pgState.sessionConfig, connectionState, handleDebouncedUpdate, form]);

  return (
    <Form {...form}>
      <form className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest">
              Configuration
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4 pt-0">
            <div className="space-y-4">
              <SessionConfig form={form} />

              {pgState.sessionConfig.voice !== voice &&
                ConnectionState.Connected === connectionState && (
                  <div className="flex flex-col">
                    <div className="text-xs bg-neutral-100 py-2 px-2 my-2 rounded-md">
                      Your change to the voice parameter requires a reconnect.
                    </div>
                    <div className="flex w-full">
                      <Button
                        className="flex-1"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          disconnect().then(() => {
                            connect();
                          });
                        }}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Reconnect Now
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
