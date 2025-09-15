import { Button } from "@/components/ui/button";
import { Rocket, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark as theme } from "react-syntax-highlighter/dist/esm/styles/hljs";

export function CodeViewer() {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"python" | "typescript">("python");
  const { pgState } = usePlaygroundState();

  const formatInstructions = (
    instructions: string,
    maxLineLength: number = 80,
  ): string => {
    return instructions
      .split(/\s+/)
      .reduce(
        (lines, word) => {
          if ((lines[lines.length - 1] + " " + word).length <= maxLineLength) {
            lines[lines.length - 1] +=
              (lines[lines.length - 1] ? " " : "") + word;
          } else {
            lines.push(word);
          }
          return lines;
        },
        [""],
      )
      .join("\n");
  };

    // example from: https://github.com/livekit-examples/python-agents-examples/blob/7b3ab6255be39305336b87d29f5e402bc77a3b31/realtime/openai-realtime.py
  const pythonCode = `
from dotenv import load_dotenv
from pathlib import Path
from livekit import agents
from livekit.agents.voice import AgentSession, Agent
from livekit.plugins import (
    openai,
    silero
)

load_dotenv(dotenv_path=Path(__file__).parent.parent / '.env')

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
          instructions="""${formatInstructions(pgState.instructions.replace(/"/g, '\\"'))}""",
        )

async def entrypoint(ctx: agents.JobContext):

    rtm = openai.realtime.RealtimeModel(
          modalities=${pgState.sessionConfig.modalities == "text_and_audio" ? '["text", "audio"]' : '["text"]'},
          temperature=${pgState.sessionConfig.temperature},
          voice="${pgState.sessionConfig.voice}",
        )
    # max_response_output_tokens must be set after initialization currently because this is missing in the init function currently
    rtm.update_options(max_response_output_tokens=${pgState.sessionConfig.maxOutputTokens === null ? '"inf"' : pgState.sessionConfig.maxOutputTokens})
    session = AgentSession(
        llm=rtm,
        vad=silero.VAD.load(
          activation_threshold=${pgState.sessionConfig.vadThreshold},
          min_silence_duration=${pgState.sessionConfig.vadSilenceDurationMs / 1000.0},
          prefix_padding_duration=${pgState.sessionConfig.vadPrefixPaddingMs / 1000.0},
        )
    )

    await session.start(
        room=ctx.room,
        agent=Assistant()
    )

    await session.generate_reply()

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
`;

  // example from: https://github.com/livekit/agents-js/blob/5d49babf25de1ba3816f1ec56a4c3dd825002e8c/examples/src/realtime_agent.ts
  const typescriptCode = `
import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  llm,
  voice,
} from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import * as silero from '@livekit/agents-plugin-silero';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const getWeather = llm.tool({
      description: 'Called when the user asks about the weather.',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        return \`The weather in \${location} is sunny today.\`;
      },
    });

    const agent = new voice.Agent({
      instructions: \`${formatInstructions(pgState.instructions)}\`,
      tools: {
        getWeather,
      },
    });

    const session = new voice.AgentSession({
      llm: new openai.realtime.RealtimeModel({
        voice: '${pgState.sessionConfig.voice}',
        temperature: ${pgState.sessionConfig.temperature},
        maxResponseOutputTokens: ${pgState.sessionConfig.maxOutputTokens === null ? Infinity : pgState.sessionConfig.maxOutputTokens},
      }),
      voiceOptions: {
        maxToolSteps: 5,
      },
    });

    await session.start({
      agent,
      room: ctx.room,
    });
    session.generateReply({ toolChoice: 'none' });
    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      console.log('metrics_collected', ev);
    });
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
`;

  const codeString = language === "python" ? pythonCode : typescriptCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDocsLink = () => {
    return language === "python"
      ? "https://github.com/livekit/agents"
      : "https://github.com/livekit/agents-js";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="group relative transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-semibold"
        >
          <Rocket className="h-5 w-5" />
          <span className="sm:ml-2 hidden sm:block">Build with LiveKit</span>
          <span className="ml-2 sm:hidden">Build</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl w-[95vw] flex flex-col mx-auto h-[90vh] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Build your own AI Agent with LiveKit &amp; OpenAI
          </DialogTitle>
          <DialogDescription>
            Use the starter code below with{" "}
            <a
              className="underline"
              href={getDocsLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              LiveKit Agents
            </a>{" "}
            to get started with the OpenAI Realtime API.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <Button
              variant={language === "python" ? "default" : "outline"}
              onClick={() => setLanguage("python")}
              className="mr-2"
            >
              Python
            </Button>
            <Button
              variant={language === "typescript" ? "default" : "outline"}
              onClick={() => setLanguage("typescript")}
            >
              Node.js
            </Button>
          </div>
          <div className="rounded-md bg-[#282c34] p-6 overflow-auto relative group flex-grow min-h-0">
            <Button
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-white hover:text-black bg-white text-black"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <div className="h-full overflow-auto">
              <SyntaxHighlighter language={language} style={theme}>
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="mt-4 flex justify-end flex-shrink-0">
            <Button asChild variant="default">
              <a href="https://docs.livekit.io/agents/openai" target="_blank">
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Get building!
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
