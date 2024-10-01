"use client";

import { useState, useEffect } from "react";
import { Instructions } from "@/components/instructions";
import { SessionControls } from "@/components/session-controls";
import { ConnectButton } from "./connect-button";
import { ConnectionState } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  useConnectionState,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react";
import { ChatControls } from "@/components/chat-controls";
import { useAgent } from "@/hooks/use-agent";
import { useConnection } from "@/hooks/use-connection";
import { toast } from "@/hooks/use-toast";

export function Chat() {
  const connectionState = useConnectionState();
  const { audioTrack, state } = useVoiceAssistant();
  const [isChatRunning, setIsChatRunning] = useState(false);
  const { agent } = useAgent();
  const { disconnect } = useConnection();
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);

  const [hasSeenAgent, setHasSeenAgent] = useState(false);

  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout | undefined;
    let appearanceTimer: NodeJS.Timeout | undefined;

    if (connectionState === ConnectionState.Connected && !agent) {
      appearanceTimer = setTimeout(() => {
        disconnect();
        setHasSeenAgent(false);

        toast({
          title: "Agent Unavailable",
          description:
            "Unable to connect to an agent right now. Please try again later.",
          variant: "destructive",
        });
      }, 5000);
    }

    if (agent) {
      setHasSeenAgent(true);
    }

    if (
      connectionState === ConnectionState.Connected &&
      !agent &&
      hasSeenAgent
    ) {
      // Agent disappeared while connected, wait 5s before disconnecting
      disconnectTimer = setTimeout(() => {
        if (!agent) {
          disconnect();
          setHasSeenAgent(false);
        }

        toast({
          title: "Agent Disconnected",
          description:
            "The AI agent has unexpectedly left the conversation. Please try again.",
          variant: "destructive",
        });
      }, 5000);
    }

    setIsChatRunning(
      connectionState === ConnectionState.Connected && hasSeenAgent,
    );

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (appearanceTimer) clearTimeout(appearanceTimer);
    };
  }, [connectionState, agent, disconnect, hasSeenAgent]);

  const toggleInstructionsEdit = () =>
    setIsEditingInstructions(!isEditingInstructions);

  const renderVisualizer = () => (
    <div className="flex w-full items-center">
      <div className="h-[320px] mt-16 md:mt-0 lg:pb-24 w-full">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          className="w-full h-full"
        />
      </div>
    </div>
  );

  const renderConnectionControl = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={isChatRunning ? "session-controls" : "connect-button"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
      >
        {isChatRunning ? <SessionControls /> : <ConnectButton />}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden p-2 lg:p-4">
      <ChatControls
        showEditButton={isChatRunning}
        isEditingInstructions={isEditingInstructions}
        onToggleEdit={toggleInstructionsEdit}
      />
      <div className="flex flex-col flex-grow items-center lg:justify-between mt-12 lg:mt-0">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-center w-full">
            <div className="lg:hidden w-full">
              {isChatRunning && !isEditingInstructions ? (
                renderVisualizer()
              ) : (
                <Instructions />
              )}
            </div>
            <div className="hidden lg:block w-full">
              <Instructions />
            </div>
          </div>
          <div className="grow h-full flex items-center justify-center">
            <div className="w-full hidden lg:block">
              {isChatRunning && !isEditingInstructions && renderVisualizer()}
            </div>
          </div>
        </div>

        <div className="md:mt-2 md:pt-2 md:mb-12 max-md:fixed max-md:bottom-12 max-md:left-1/2 max-md:-translate-x-1/2 max-md:z-50 xl:fixed xl:bottom-12 xl:left-1/2 xl:-translate-x-1/2 xl:z-50">
          {renderConnectionControl()}
        </div>
      </div>
    </div>
  );
}
