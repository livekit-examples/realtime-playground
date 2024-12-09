"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect,
  useState,
} from "react";
import {
  PlaygroundState,
  defaultSessionConfig,
  defaultPlaygroundState,
} from "@/data/playground-state";
import { playgroundStateHelpers } from "@/lib/playground-state-helpers";

import { Preset, defaultPresets } from "@/data/presets";

// const LS_OPENAI_API_KEY_NAME = "OPENAI_API_KEY";
const LS_USER_PRESETS_KEY = "PG_USER_PRESETS";
const LS_SELECTED_PRESET_ID_KEY = "PG_SELECTED_PRESET_ID";

const presetStorageHelper = {
  getStoredPresets: (): Preset[] => {
    const storedPresets = localStorage.getItem(LS_USER_PRESETS_KEY);
    return storedPresets ? JSON.parse(storedPresets) : [];
  },
  setStoredPresets: (presets: Preset[]): void => {
    localStorage.setItem(LS_USER_PRESETS_KEY, JSON.stringify(presets));
  },
  getStoredSelectedPresetId: (): string => {
    return (
      localStorage.getItem(LS_SELECTED_PRESET_ID_KEY) || defaultPresets[0].id
    );
  },
  setStoredSelectedPresetId: (presetId: string | null): void => {
    if (presetId !== null) {
      localStorage.setItem(LS_SELECTED_PRESET_ID_KEY, presetId);
    } else {
      localStorage.removeItem(LS_SELECTED_PRESET_ID_KEY);
    }
  },
};

// Define action types and payloads
type Action =
  | {
      type: "SET_SESSION_CONFIG";
      payload: Partial<PlaygroundState["sessionConfig"]>;
    }
  // | { type: "SET_API_KEY"; payload: string | null }
  | { type: "SET_INSTRUCTIONS"; payload: string }
  | { type: "SET_USER_PRESETS"; payload: Preset[] }
  | { type: "SET_SELECTED_PRESET_ID"; payload: string | null }
  | { type: "SAVE_USER_PRESET"; payload: Preset }
  | { type: "DELETE_USER_PRESET"; payload: string };

// Create the reducer function
function playgroundStateReducer(
  state: PlaygroundState,
  action: Action,
): PlaygroundState {
  switch (action.type) {
    case "SET_SESSION_CONFIG":
      return {
        ...state,
        sessionConfig: {
          ...state.sessionConfig,
          ...action.payload,
        },
      };
    // case "SET_API_KEY":
    //   if (action.payload) {
    //     localStorage.setItem(LS_OPENAI_API_KEY_NAME, action.payload);
    //   } else {
    //     localStorage.removeItem(LS_OPENAI_API_KEY_NAME);
    //   }
    //   return {
    //     ...state,
    //     openaiAPIKey: action.payload,
    //   };
    case "SET_INSTRUCTIONS":
      return {
        ...state,
        instructions: action.payload,
      };
    case "SET_USER_PRESETS":
      return {
        ...state,
        userPresets: action.payload,
      };
    case "SET_SELECTED_PRESET_ID":
      presetStorageHelper.setStoredSelectedPresetId(action.payload);

      let newState = {
        ...state,
        selectedPresetId: action.payload,
      };

      newState.instructions =
        playgroundStateHelpers.getSelectedPreset(newState)?.instructions || "";
      newState.sessionConfig =
        playgroundStateHelpers.getSelectedPreset(newState)?.sessionConfig ||
        defaultSessionConfig;
      return newState;
    case "SAVE_USER_PRESET":
      const updatedPresetsAdd = state.userPresets.map((preset) =>
        preset.id === action.payload.id ? action.payload : preset,
      );
      if (
        !updatedPresetsAdd.some((preset) => preset.id === action.payload.id)
      ) {
        updatedPresetsAdd.push(action.payload);
      }
      presetStorageHelper.setStoredPresets(updatedPresetsAdd);
      return {
        ...state,
        userPresets: updatedPresetsAdd,
      };
    case "DELETE_USER_PRESET":
      const updatedPresetsDelete = state.userPresets.filter(
        (preset: Preset) => preset.id !== action.payload,
      );
      presetStorageHelper.setStoredPresets(updatedPresetsDelete);
      return {
        ...state,
        userPresets: updatedPresetsDelete,
      };
    default:
      return state;
  }
}

// Update the context type
interface PlaygroundStateContextProps {
  pgState: PlaygroundState;
  dispatch: Dispatch<Action>;
  helpers: typeof playgroundStateHelpers;
  showAuthDialog: boolean;
  setShowAuthDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const PlaygroundStateContext = createContext<
  PlaygroundStateContextProps | undefined
>(undefined);

// Create a custom hook to use the global state
export const usePlaygroundState = (): PlaygroundStateContextProps => {
  const context = useContext(PlaygroundStateContext);
  if (!context) {
    throw new Error(
      "usePlaygroundState must be used within a PlaygroundStateProvider",
    );
  }
  return context;
};

// Create the provider component
interface PlaygroundStateProviderProps {
  children: ReactNode;
}

export const PlaygroundStateProvider = ({
  children,
}: PlaygroundStateProviderProps) => {
  const [state, dispatch] = useReducer(
    playgroundStateReducer,
    defaultPlaygroundState,
  );
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    // const storedKey = localStorage.getItem(LS_OPENAI_API_KEY_NAME);
    // if (storedKey && storedKey.length >= 1) {
    //   dispatch({ type: "SET_API_KEY", payload: storedKey });
    // } else {
    //   dispatch({ type: "SET_API_KEY", payload: null });
    //   setShowAuthDialog(true);
    // }

    // Load presets from localStorage
    const storedPresets = localStorage.getItem(LS_USER_PRESETS_KEY);
    const userPresets = storedPresets ? JSON.parse(storedPresets) : [];

    dispatch({ type: "SET_USER_PRESETS", payload: userPresets });

    // Read the URL
    const urlData = playgroundStateHelpers.decodeFromURLParams(
      window.location.search,
    );

    if (urlData.state.selectedPresetId) {
      const defaultPreset = playgroundStateHelpers
        .getDefaultPresets()
        .find((preset) => preset.id === urlData.state.selectedPresetId);

      if (defaultPreset) {
        dispatch({ type: "SET_SELECTED_PRESET_ID", payload: defaultPreset.id });
        // Don't clear the URL for default presets
        return;
      }

      // Handle non-default preset from URL
      if (urlData.preset && urlData.preset.name) {
        const newPreset: Preset = {
          id: urlData.state.selectedPresetId,
          name: urlData.preset.name || "Shared Preset",
          description: urlData.preset.description,
          instructions: urlData.state.instructions || "",
          sessionConfig: urlData.state.sessionConfig || defaultSessionConfig,
          defaultGroup: undefined,
        };

        const updatedUserPresets = [...userPresets, newPreset];
        presetStorageHelper.setStoredPresets(updatedUserPresets);
        dispatch({ type: "SET_USER_PRESETS", payload: updatedUserPresets });
        dispatch({ type: "SET_SELECTED_PRESET_ID", payload: newPreset.id });
      }

      // Clear the URL for non-default presets
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <PlaygroundStateContext.Provider
      value={{
        pgState: state,
        dispatch,
        helpers: playgroundStateHelpers,
        showAuthDialog,
        setShowAuthDialog,
      }}
    >
      {children}
    </PlaygroundStateContext.Provider>
  );
};
