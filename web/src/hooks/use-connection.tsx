"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { PlaygroundState } from "@/data/playground-state";
import { usePlaygroundState } from "./use-playground-state";
import { VoiceId } from "@/data/voices";

export type ConnectFn = () => Promise<void>;

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  pgState: PlaygroundState;
  voice: VoiceId;
  disconnect: () => Promise<void>;
  connect: ConnectFn;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(
  undefined,
);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    shouldConnect: boolean;
    voice: VoiceId;
  }>({ wsUrl: "", token: "", shouldConnect: false, voice: VoiceId.alloy });

  const { pgState, dispatch } = usePlaygroundState();

  const connect = async () => {
    // if (!pgState.openaiAPIKey) {
    //   throw new Error("OpenAI API key is required to connect");
    // }
    console.log(pgState)
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pgState),

    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const { accessToken, url } = await response.json();

    setConnectionDetails({
      wsUrl: url,
      token: accessToken,
      shouldConnect: true,
      voice: pgState.sessionConfig.voice,
    });
  };

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  // Effect to handle API key changes
  useEffect(() => {
    // if (pgState.openaiAPIKey === null && connectionDetails.shouldConnect) {
    //   disconnect();
    // }
  }, [connectionDetails.shouldConnect, disconnect]); //pgState.openaiAPIKey,

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        voice: connectionDetails.voice,
        pgState,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }

  return context;
};
