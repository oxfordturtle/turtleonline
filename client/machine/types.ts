export type State = {
  // fixed state
  readonly options: Options;
  readonly pcode: number[][];
  // runtime state
  running: boolean;
  paused: boolean;
  line: number;
  code: number;
  memory: Memory;
  virtualCanvas: VirtualCanvas;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  console: HTMLPreElement;
  output: HTMLPreElement;
  detectInputcode: number;
  detectTimeoutID: number;
  readlineTimeoutID: number;
  startTime: number;
  update: boolean;
  keyecho: boolean;
  seed: number;
};

export type Options = {
  showCanvasOnRun: boolean;
  showOutputOnWrite: boolean;
  showMemoryOnDump: boolean;
  drawCountMax: number;
  codeCountMax: number;
  smallSize: number;
  stackSize: number;
  traceOnRun: boolean;
  activateHCLR: boolean;
  preventStackCollision: boolean;
  rangeCheckArrays: boolean;
};

export type Memory = {
  main: number[];
  keys: number[];
  query: number[];
  coords: [number, number][];
  stack: number[];
  memoryStack: number[];
  returnStack: number[];
  subroutineStack: number[];
  stackTop: number;
  heapGlobal: number;
  heapBase: number;
  heapPerm: number;
  heapTemp: number;
  heapMax: number;
  heapClearPending: boolean;
};

export type VirtualCanvas = {
  startx: number;
  starty: number;
  sizex: number;
  sizey: number;
  width: number;
  height: number;
  doubled: boolean;
};

export type Turtle = {
  x: number;
  y: number;
  d: number;
  a: number;
  p: number;
  c: string;
};

export type ActionResult = {
  state: State;
  drawn?: boolean;
  updated?: boolean;
  halted?: boolean;
  error?: string;
};
