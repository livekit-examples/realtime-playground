import {
  createAudioAnalyser,
  LocalAudioTrack,
  RemoteAudioTrack,
} from "livekit-client";

export class AudioVisualizer {
  private interval: any;
  private callback: (values: number[], volume: number) => void;
  private bands: number;
  private cleanup: (() => Promise<void>) | null = null;

  constructor({ bands, onTick }: AudioVisualizerParams) {
    this.bands = bands;
    this.callback = onTick;
  }

  setTrack(track: LocalAudioTrack | RemoteAudioTrack) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.cleanup) {
      this.cleanup();
    }
    const { analyser, cleanup, calculateVolume } = createAudioAnalyser(track, {
      fftSize: 256,
      smoothingTimeConstant: 0.7,
    });
    this.cleanup = cleanup;
    const dataArray = new Float32Array(this.bands);

    this.interval = setInterval(() => {
      analyser.getFloatFrequencyData(dataArray);
      const result: number[] = [];
      for (let i = 0; i < dataArray.length; i++) {
        result.push(Math.max(0, dataArray[i] + 140) / 140);
      }
      this.callback(result, calculateVolume());
    }, 1000 / 100);
  }
}

type AudioVisualizerParams = {
  bands: number;
  onTick: (values: number[], volume: number) => void;
};
