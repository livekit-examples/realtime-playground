export const generateListeningSequence = (rows: number, columns: number) => {
  const center = { x: Math.floor(columns / 2), y: Math.floor(rows / 2) };
  const noIndex = { x: -1, y: -1 };

  return [
    center,
    noIndex,
    noIndex,
    noIndex,
    noIndex,
    noIndex,
    noIndex,
    noIndex,
    noIndex,
  ];
};

export const generateListeningSequenceBar = (columns: number) => {
  const center = Math.floor(columns / 2);
  const noIndex = -1;

  return [center, noIndex];
};

export const generateListeningSequenceRadialBar = (columns: number) => {
  const evenNumbers = Array.from({ length: columns }, (_, i) => i).filter(
    (num) => num % 2 === 0,
  );
  const oddNumbers = Array.from({ length: columns }, (_, i) => i).filter(
    (num) => num % 2 !== 0,
  );
  const noIndex = -1;

  return [evenNumbers, noIndex, oddNumbers, noIndex];
};
