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

  const pythonCode = `from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, WorkerType, cli, multimodal
from livekit.plugins import openai

async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    agent = multimodal.MultimodalAgent(
        model=openai.realtime.RealtimeModel(
            instructions="""${formatInstructions(pgState.instructions.replace(/"/g, '\\"'))}""",
            voice="${pgState.sessionConfig.voice}",
            temperature=${pgState.sessionConfig.temperature},
            max_response_output_tokens=${pgState.sessionConfig.maxOutputTokens === null ? '"inf"' : pgState.sessionConfig.maxOutputTokens},
            modalities=${pgState.sessionConfig.modalities == "text_and_audio" ? '["text", "audio"]' : '["text"]'},
            turn_detection=openai.realtime.ServerVadOptions(
                threshold=${pgState.sessionConfig.vadThreshold},
                silence_duration_ms=${pgState.sessionConfig.vadSilenceDurationMs},
                prefix_padding_ms=${pgState.sessionConfig.vadPrefixPaddingMs},
            )
        )
    )
    agent.start(ctx.room)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, worker_type=WorkerType.ROOM))
`;

  const typescriptCode = `import { JobContext, WorkerOptions, cli, defineAgent, multimodal } from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import { JobType } from '@livekit/protocol';
import { fileURLToPath } from 'node:url';

export default defineAgent({
  entry: async (ctx: JobContext) => {
    await ctx.connect();

    const agent = new multimodal.MultimodalAgent({
      model: new openai.realtime.RealtimeModel({
        instructions: \`${formatInstructions(pgState.instructions)}\`,
        voice: '${pgState.sessionConfig.voice}',
        temperature: ${pgState.sessionConfig.temperature},
        maxResponseOutputTokens: ${pgState.sessionConfig.maxOutputTokens === null ? Infinity : pgState.sessionConfig.maxOutputTokens},
        modalities: ${pgState.sessionConfig.modalities === "text_and_audio" ? "['text', 'audio']" : "['text']"},
        turnDetection: {
          type: 'server_vad',
          threshold: ${pgState.sessionConfig.vadThreshold},
          silence_duration_ms: ${pgState.sessionConfig.vadSilenceDurationMs},
          prefix_padding_ms: ${pgState.sessionConfig.vadPrefixPaddingMs},
        },
      }),
    });

    await agent.start(ctx.room)
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url), workerType: JobType.JT_ROOM }));
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
