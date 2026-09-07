const SIZE = 25;

function hash(seed: string) {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value;
}

function finder(x: number, y: number) {
  let cells = "";
  for (let row = 0; row < 7; row += 1) {
    for (let column = 0; column < 7; column += 1) {
      const edge = row === 0 || column === 0 || row === 6 || column === 6;
      const core = row > 1 && row < 5 && column > 1 && column < 5;
      if (edge || core)
        cells += `<rect x="${x + column}" y="${y + row}" width="1" height="1"/>`;
    }
  }
  return cells;
}

export function platePattern(seed: string) {
  let state = hash(seed);
  const random = () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };

  const reserved = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > SIZE - 9 && y < 8) || (x < 8 && y > SIZE - 9);

  let cells = "";
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (reserved(x, y)) continue;
      if (random() < 0.44)
        cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  }

  cells += finder(0, 0) + finder(SIZE - 7, 0) + finder(0, SIZE - 7);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges" fill="#111111">${cells}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}
