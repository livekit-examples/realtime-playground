export const visualizerVariations: {
  name: string;
  style: "grid" | "bar" | "radial" | "waveform";
  count: number;
  options: any;
}[] = [
  {
    name: "Grid 1",
    style: "grid",
    count: 5,
    options: {
      baseStyle: {
        width: "32px",
        height: "32px",
        borderRadius: "4px",
      },
      offStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      onStyle: {
        backgroundColor: "#FFF",
        boxShadow: "0px 0px 32px 8px rgba(255, 255, 255, 0.20)",
      },
      gridSpacing: "48px",
      animationOptions: {
        interval: 70,
        connectingRing: 2,
      },
      minHeight: 32,
      maxHeight: 128,
    },
  },
  {
    name: "Grid 2",
    style: "grid",
    count: 20,
    options: {
      baseStyle: {
        width: "8px",
        height: "8px",
        borderRadius: "2px",
      },
      offStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      onStyle: {
        backgroundColor: "#FFF",
        boxShadow: "0px 0px 4px 2px rgba(255, 255, 255, 0.20)",
      },
      gridSpacing: "24px",
      animationOptions: {
        interval: 75,
        onTransition: "all 0.02s ease-out",
        offTransition: "all 0.5s ease-out",
        connectingRing: 2,
      },
      stateOptions: {
        listening: {
          animationOptions: {
            interval: 100,
            onTransition: "all 0.2s ease-out",
            offTransition: "all 0.5s ease-out",
          },
        },
      },
    },
  },
  {
    name: "Bar 1",
    style: "bar",
    count: 5,
    options: {
      baseStyle: {
        width: "64px",
        borderRadius: "32px",
      },
      offStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      onStyle: {
        backgroundColor: "#FFF",
        boxShadow: "0px 0px 32px 8px rgba(255, 255, 255, 0.20)",
      },
      gridSpacing: "24px",
      animationOptions: {
        interval: 70,
        onTransition: "all 0.2s ease-out",
        offTransition: "all 0.5s ease-out",
      },
      minHeight: 64,
      maxHeight: 256,
      stateOptions: {
        thinking: {
          animationOptions: {
            onTransition: "all 0.075s ease-out",
            interval: 40,
          },
        },
        connecting: {
          animationOptions: {
            interval: 350,
          },
        },
        speaking: {
          animationOptions: {
            onTransition: "none",
            offTransition: "none",
          },
        },
        listening: {
          animationOptions: {
            interval: 500,
          },
          offStyle: {
            // backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          onStyle: {
            transform: "scale(1.05)",
          },
        },
      },
    },
  },
  {
    name: "Bar 2",
    style: "bar",
    count: 50,
    options: {
      baseStyle: {
        width: "3px",
        borderRadius: "4px",
      },
      offStyle: {
        backgroundColor: "rgba(0, 0, 0, 0.25)",
      },
      onStyle: {
        backgroundColor: "#5ABE82",
        boxShadow: "0px 0px 32px 8px rgba(255, 255, 255, 0.20)",
      },
      gridSpacing: "4px",
      animationOptions: {
        interval: 25,
        onTransition: "all 0.0s ease-out",
        offTransition: "all 0.5s ease-out",
      },
      minHeight: 2,
      maxHeight: 256,
      stateOptions: {
        thinking: {
          animationOptions: {
            onTransition: "all 0.04s ease-out",
            interval: 40,
          },
        },
        connecting: {
          animationOptions: {
            interval: 200,
            onTransition: "all 0.2s ease-out",
            offTransition: "all 1.5s ease-out",
          },
        },
        speaking: {
          animationOptions: {
            onTransition: "none",
            offTransition: "none",
          },
        },
        listening: {
          animationOptions: {
            interval: 500,
          },
          offStyle: {
            // backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          onStyle: {
            transform: "scale(1.05)",
          },
        },
      },
    },
  },
  {
    name: "Radial",
    style: "radial",
    count: 14,
    options: {
      baseStyle: {
        borderRadius: "12px",
        width: "32px",
        background: "#FFF",
      },
      offStyle: {
        background: "rgba(255, 255, 255, 0.05)",
      },
      onStyle: {
        background: "#FFF",
        boxShadow: "0px 0px 8px 2px rgba(255, 255, 255, 0.4)",
      },
      animationOptions: {
        interval: 500,
        onTransition: "all 0.2s ease-out",
        offTransition: "all 0.5s ease-out",
      },
      stateOptions: {
        speaking: {
          animationOptions: {
            interval: 500,
            onTransition: "none",
            offTransition: "none",
          },
        },
        thinking: {
          animationOptions: {
            interval: 50,
            onTransition: "all 0.05s ease-out",
            offTransition: "all 0.5s ease-out",
          },
        },
      },
      gridSpacing: "8px",
      minHeight: 24,
      maxHeight: 84,
      radiusFactor: 3,
      radial: true,
    },
  },
];
