// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import {
  type JobContext,
  WorkerOptions,
  cli,
  defineAgent,
  multimodal,
} from "@livekit/agents";
import * as openai from "@livekit/agents-plugin-openai";
import type {
  LocalParticipant,
  Participant,
  TrackPublication,
} from "@livekit/rtc-node";
import { RemoteParticipant, TrackSource } from "@livekit/rtc-node";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

function safeLogConfig(config: SessionConfig): string {
  const safeConfig = { ...config, openaiApiKey: "[REDACTED]" };
  return JSON.stringify(safeConfig);
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    await ctx.connect();

    const participant = await ctx.waitForParticipant();

    await runMultimodalAgent(ctx, participant);
  },
});

type TurnDetectionType = {
  type: "server_vad";
  threshold?: number;
  prefix_padding_ms?: number;
  silence_duration_ms?: number;
};

interface SessionConfig {
  openaiApiKey: string;
  instructions: string;
  voice: string;
  temperature: number;
  maxOutputTokens?: number;
  modalities: string[];
  turnDetection: TurnDetectionType;
}

function parseSessionConfig(data: any): SessionConfig {
  return {
    openaiApiKey: data.openai_api_key || "",
    instructions: data.instructions || "",
    voice: data.voice || "",
    temperature: parseFloat(data.temperature || "0.8"),
    maxOutputTokens:
      data.max_output_tokens === "inf"
        ? Infinity
        : parseInt(data.max_output_tokens) || undefined,
    modalities: modalitiesFromString(data.modalities || "text_and_audio"),
    turnDetection: data.turn_detection ? JSON.parse(data.turn_detection) : null,
  };
}

function modalitiesFromString(
  modalities: string
): ["text", "audio"] | ["text"] {
  const modalitiesMap: { [key: string]: ["text", "audio"] | ["text"] } = {
    text_and_audio: ["text", "audio"],
    text_only: ["text"],
  };
  return modalitiesMap[modalities] || ["text", "audio"];
}

function getMicrophoneTrackSid(participant: Participant): string | undefined {
  return Array.from(participant.trackPublications.values()).find(
    (track: TrackPublication) => track.source === TrackSource.SOURCE_MICROPHONE
  )?.sid;
}

async function runMultimodalAgent(
  ctx: JobContext,
  participant: RemoteParticipant
) {
  const metadata = JSON.parse(participant.metadata);
  const config = parseSessionConfig(metadata);
  var lastConfig = config;
  console.log(
    `starting multimodal agent with config: ${safeLogConfig(config)}`
  );

  const model = new openai.realtime.RealtimeModel({
    apiKey: config.openaiApiKey,
    instructions: config.instructions,
    voice: config.voice,
    temperature: config.temperature,
    maxResponseOutputTokens: config.maxOutputTokens,
    modalities: config.modalities as ["text", "audio"] | ["text"],
    turnDetection: config.turnDetection,
  });

  const agent = new multimodal.MultimodalAgent({ model });
  const session = (await agent.start(
    ctx.room
  )) as openai.realtime.RealtimeSession;

  session.conversation.item.create({
    type: "message",
    role: "user",
    content: [
      {
        type: "input_text",
        text: "Please begin the interaction with the user in a manner consistent with your instructions.",
      },
    ],
  });
  session.response.create();

  ctx.room.localParticipant?.registerRpcMethod(
    "pg.updateConfig",
    async (requestId: string, callerIdentity: string, payload: string, responseTimeoutMs: number) => {
      const newConfig = parseSessionConfig(JSON.parse(payload));
      if (!configEqual(newConfig, lastConfig)) {
        console.log(`updating config: ${JSON.stringify(newConfig)} from ${JSON.stringify(lastConfig)}`);
        lastConfig = newConfig;
        session.sessionUpdate({
          instructions: newConfig.instructions,
          temperature: newConfig.temperature,
          maxResponseOutputTokens: newConfig.maxOutputTokens,
          modalities: newConfig.modalities as ["text", "audio"] | ["text"],
          turnDetection: newConfig.turnDetection,
        });

        return JSON.stringify({ changed: true });
      } else {
        return JSON.stringify({ changed: false });
      }
    }
  );

  session.on("response_done", (response: openai.realtime.RealtimeResponse) => {
    let error: "max_output_tokens" | "content_filter" | "incomplete" | "server_error" | "rate_limit" | "failed" | undefined;
    if (response.status === "incomplete") {
      if (response.statusDetails?.reason) {
        const reason = response.statusDetails.reason;
        switch (reason) {
          case "max_output_tokens":
            error = "max_output_tokens";
            break;
          case "content_filter":
            error = "content_filter";
            break;
          default:
            error = "incomplete";
            break;
        }
      } else {
        error = "incomplete";
      }
    } else if (response.status === "failed") {
      if (response.statusDetails?.error) {
        switch (response.statusDetails.error.code) {
          case "server_error":
            error = "server_error";
            break;
          case "rate_limit_exceeded":
            error = "rate_limit";
            break;
          default:
            error = "failed";
            break;
        }
      } else {
        error = "failed";
      }
    } else {
      return;
    }

    (async () => {
      await ctx.room.localParticipant?.performRpc(participant.identity, "pg.responseError", error);
    })();
  });
}

function configEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (key === "openaiApiKey") continue;
    if (!keys2.includes(key) || !configEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
