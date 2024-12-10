import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
//import { Auth } from "@/components/auth";
import LK from "@/components/lk";
// import Heart from "@/assets/heart.svg";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { defaultPresets } from "@/data/presets";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  let title = "Realtime Playground";
  let description =
    "Speech-to-speech playground for OpenAI's new Realtime API. Built on LiveKit Agents.";

  const presetId = searchParams?.preset;
  if (presetId) {
    const selectedPreset = defaultPresets.find(
      (preset) => preset.id === presetId,
    );
    if (selectedPreset) {
      title = `Realtime Playground`;
      description = `Speak to a "${selectedPreset.name}" in a speech-to-speech playground for OpenAI's new Realtime API.`;
    }
  }

  return {
    title,
    description,
    // openGraph: {
    //   title,
    //   description,
    //   type: "website",
    //   url: "https://playground.livekit.io/",
    //   images: [
    //     {
    //       url: "https://playground.livekit.io/og-image.png",
    //       width: 1200,
    //       height: 675,
    //       type: "image/png",
    //       alt: title,
    //     },
    //   ],
    // },
  };
}

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
        <LK />
        {/* <Auth /> */}
      </header>
      <main className="flex flex-col flex-grow overflow-hidden p-0 md:p-2 md:pt-0 w-full md:mx-auto">
        <Header />
        <RoomComponent />
      </main>
      {/* < footer className="hidden md:flex md:items-center md:gap-2 md:justify-end font-mono uppercase text-right pt-1 pb-2 px-8 text-xs text-gray-600 w-full md:mx-auto">
        Built with
        <Heart />
        on
        <a
          href="https://github.com/livekit/agents"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          LiveKit Agents
        </a>{" "}
        •
        <a
          href="https://github.com/livekit-examples/realtime-playground"
          target="_blank"
          rel="noopener noreferrer"
          className="underline inline-flex items-center gap-1"
        >
          <GitHubLogoIcon className="h-4 w-4" />
          View source on GitHub
        </a>
        • © 2024 LiveKit
      </footer> */}
    </div>
  );
}
