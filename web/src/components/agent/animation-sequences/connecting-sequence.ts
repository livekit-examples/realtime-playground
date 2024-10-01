export const generateConnectingSequence = (
  rows: number,
  columns: number,
  ringDistance: number,
) => {
  let seq = [];
  const centerX = Math.floor(columns / 2);
  const centerY = Math.floor(rows / 2);

  // Calculate the boundaries of the ring based on the ring distance
  const topLeft = {
    x: Math.max(0, centerY - ringDistance),
    y: Math.max(0, centerY - ringDistance),
  };
  const bottomRight = {
    x: columns - 1 - topLeft.x,
    y: Math.min(rows - 1, centerY + ringDistance),
  };

  // Top edge
  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    seq.push({ x, y: topLeft.y });
  }

  // Right edge
  for (let y = topLeft.y + 1; y <= bottomRight.y; y++) {
    seq.push({ x: bottomRight.x, y });
  }

  // Bottom edge
  for (let x = bottomRight.x - 1; x >= topLeft.x; x--) {
    seq.push({ x, y: bottomRight.y });
  }

  // Left edge
  for (let y = bottomRight.y - 1; y > topLeft.y; y--) {
    seq.push({ x: topLeft.x, y });
  }

  return seq;
};

export const generateConnectingSequenceBar = (
  columns: number,
): number[] | number[][] => {
  let seq = [];

  for (let x = 0; x <= columns; x++) {
    seq.push([x, columns - 1 - x]);
  }

  return seq;
};

export const generateConnectingSequenceRadialBar = (
  columns: number,
): number[] | number[][] => {
  let seq = [];

  for (let x = 0; x <= columns; x++) {
    seq.push([x, columns - 1 - x]);
  }

  return seq;
};
