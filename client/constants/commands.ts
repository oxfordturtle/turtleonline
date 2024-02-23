import type { Type } from "../lexer/types.ts";
import type { Language } from "./languages.ts";
import PCode from "./pcodes.ts";

export interface Command {
  readonly __: "Command";
  readonly id: string;
  readonly names: Readonly<Record<Language, string | null>>;
  readonly code: (turtleAddress: number) => number[];
  readonly parameters: ReadonlyArray<Parameter>;
  readonly returns: Type | null;
  readonly type: "procedure" | "function";
  readonly category: number;
  readonly level: number;
  readonly description: string;
}

const command = (
  name:
    | string
    | [
        BASIC?: string,
        C?: string,
        Java?: string,
        Pascal?: string,
        Python?: string,
        TypeScript?: string
      ],
  code: (turtleAddress: number) => number[],
  parameters: ReadonlyArray<Parameter>,
  returns: Type | null,
  help: { category: number; level: number },
  description: string
): Command => {
  const id = typeof name === "string" ? name : name.find((n) => n !== null)!;
  const names: Readonly<Record<Language, string | null>> =
    typeof name === "string"
      ? {
          BASIC: name.toUpperCase(),
          C: name.toLowerCase(),
          Java: name,
          Pascal: name.toLowerCase(),
          Python: name.toLowerCase(),
          TypeScript: name,
        }
      : {
          BASIC: name[0] ?? null,
          C: name[1] ?? null,
          Java: name[2] ?? null,
          Pascal: name[3] ?? null,
          Python: name[4] ?? null,
          TypeScript: name[5] ?? null,
        };

  return {
    __: "Command",
    id,
    names,
    code,
    parameters,
    returns,
    type: returns === null ? "procedure" : "function",
    ...help,
    description,
  };
};

export interface Parameter {
  readonly __: "Parameter";
  readonly name: string;
  readonly type: Type;
  readonly isReferenceParameter: boolean;
  readonly length: number;
}

const p = (name: string, type: Type, isReferenceParameter = false, length = 1): Parameter => ({
  __: "Parameter",
  name,
  type,
  isReferenceParameter,
  length,
});

const commands = [
  // 0. Turtle: relative movement
  command(
    "forward",
    () => [PCode.fwrd],
    [p("n", "integer")],
    null,
    { category: 0, level: 0 },
    "Moves the Turtle forward <code>n</code> units, drawing as it goes (unless the pen is up)."
  ),
  command(
    "back",
    () => [PCode.back],
    [p("n", "integer")],
    null,
    { category: 0, level: 0 },
    "Moves the Turtle back <code>n</code> units, drawing as it goes (unless the pen is up)."
  ),
  command(
    "left",
    () => [PCode.left],
    [p("n", "integer")],
    null,
    { category: 0, level: 0 },
    "Rotates the Turtle left by <code>n</code> degrees."
  ),
  command(
    "right",
    () => [PCode.rght],
    [p("n", "integer")],
    null,
    { category: 0, level: 0 },
    "Rotates the Turtle right by <code>n</code> degrees."
  ),
  command(
    "drawXY",
    () => [PCode.drxy],
    [p("x", "integer"), p("y", "integer")],
    null,
    { category: 0, level: 1 },
    "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, drawing as it goes (unless the pen is up)."
  ),
  command(
    "moveXY",
    () => [PCode.mvxy],
    [p("x", "integer"), p("y", "integer")],
    null,
    { category: 0, level: 1 },
    "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, <em>without</em> drawing (regardless of the current pen status)."
  ),
  // 1. Turtle: absolute movement
  command(
    "home",
    () => [PCode.home],
    [],
    null,
    { category: 1, level: 0 },
    "Moves the Turtle back to its starting position in the centre of the canvas, facing north, drawing as it goes (unless the pen is up)."
  ),
  command(
    "setX",
    () => [PCode.setx],
    [p("x", "integer")],
    null,
    { category: 1, level: 0 },
    "Sets the Turtle’s <code>x</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turtx</code>."
  ),
  command(
    "setY",
    () => [PCode.sety],
    [p("y", "integer")],
    null,
    { category: 1, level: 0 },
    "Sets the Turtle’s <code>y</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turty</code>."
  ),
  command(
    "setXY",
    () => [PCode.toxy],
    [p("x", "integer"), p("y", "integer")],
    null,
    { category: 1, level: 0 },
    "Sets the Turtle’s <code>x</code> and <code>y</code> coordinates directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variables <code>turtx</code> and <code>turty</code>."
  ),
  command(
    "direction",
    () => [PCode.setd],
    [p("n", "integer")],
    null,
    { category: 1, level: 0 },
    "Sets the Turtle’s direction to <code>n</code> degrees (0 for north, 90 for east, 180 for south, 270 for west). This can also be achieved by direct assignment of the global variable <code>turtd</code>. Note that the number of degrees in a circle (360 by default) can be changed with the <code>angles</code> command."
  ),
  command(
    "angles",
    () => [PCode.angl],
    [p("degrees", "integer")],
    null,
    { category: 1, level: 1 },
    "Sets the number of <code>degrees</code> in a circle (360 by default)."
  ),
  command(
    "turnXY",
    () => [PCode.turn],
    [p("x", "integer"), p("y", "integer")],
    null,
    { category: 1, level: 1 },
    "Turns the Turtle to face the point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis."
  ),
  // 2. Turtle: shape drawing
  command(
    "circle",
    () => [PCode.circ],
    [p("radius", "integer")],
    null,
    { category: 2, level: 0 },
    "Draws a circle outline in the Turtle’s current colour and thickness, of the given <code>radius</code>, centred on the Turtle’s current location."
  ),
  command(
    "blot",
    () => [PCode.blot],
    [p("radius", "integer")],
    null,
    { category: 2, level: 0 },
    "Draws a filled circle in the Turtle’s current colour, of the given <code>radius</code>, centred on the Turtle’s current location."
  ),
  command(
    "ellipse",
    () => [PCode.elps],
    [p("xRadius", "integer"), p("yRadius", "integer")],
    null,
    { category: 2, level: 0 },
    "Draws an ellipse outline in the Turtle’s current colour and thickness, of the given <code>xRadius</code> and <code>yRadius</code>, centred on the Turtle’s current location."
  ),
  command(
    "ellblot",
    () => [PCode.eblt],
    [p("xRadius", "integer"), p("yRadius", "integer")],
    null,
    { category: 2, level: 0 },
    "Draws a filled ellipse in the Turtle’s current colour, of the given <code>xRadius</code> and <code>yRadius</code>, centred on the Turtle’s current location."
  ),
  command(
    "polyline",
    () => [PCode.poly],
    [p("n", "integer")],
    null,
    { category: 2, level: 1 },
    "Draws a polygon outline in the Turtle’s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."
  ),
  command(
    "polygon",
    () => [PCode.pfil],
    [p("n", "integer")],
    null,
    { category: 2, level: 1 },
    "Draws a filled polygon in the Turtle’s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."
  ),
  command(
    "forget",
    () => [PCode.frgt],
    [p("n", "integer")],
    null,
    { category: 2, level: 1 },
    "Makes the Turtle “forget” the last <code>n</code> points it has visited. Used in conjunction with <code>polyline</code> and <code>polygon</code>."
  ),
  command(
    "remember",
    () => [PCode.rmbr],
    [],
    null,
    { category: 2, level: 1 },
    "Makes the Turtle “remember” its current location. This is only necessary if its current location was set by a direct assignment of the global variables <code>turtx</code> and <code>turty</code>; when using the standard moving commands, the Turtle automatically remembers where it has been."
  ),
  command(
    "box",
    () => [PCode.box],
    [p("x", "integer"), p("y", "integer"), p("colour", "integer"), p("border", "boolean")],
    null,
    { category: 2, level: 1 },
    "Draws a box of width <code>x</code> and height <code>y</code>, with the top left corner in the Turtle’s current location, filled with the specified <code>colour</code>. If <code>border</code> is <code>true</code>, a border is drawn around the box in the Turtle’s current colour and and thickness. This is intended to be used with the <code>display</code> command, to provide a box for framing text."
  ),
  // 3. Other Turtle commands
  command(
    "colour",
    () => [PCode.colr],
    [p("colour", "integer")],
    null,
    { category: 3, level: 0 },
    "Sets the <code>colour</code> of the Turtle’s pen. Takes as an argument either an RGB value, or one of the Turtle System’s fifty predefined colour constants (see the <b>Colours</b> tab). This can also be achieved by direct assignment of the global variable <code>turtc</code>."
  ),
  command(
    ["RNDCOL", "randcol", "randCol", "randcol", "randcol", "randCol"],
    () => [PCode.rand, PCode.incr, PCode.rgb, PCode.colr],
    [p("n", "integer")],
    null,
    { category: 3, level: 0 },
    "Assigns a random colour to the Turtle’s pen, between 1 and <code>n</code> (maximum 50). The colours are taken from the Turtle System’s fifty predefined colours, which are each assigned a number between 1 and 50 (see the <b>Colours</b> tab)."
  ),
  command(
    "thickness",
    () => [PCode.thik],
    [p("thickness", "integer")],
    null,
    { category: 3, level: 0 },
    "Sets the <code>thickness</code> of the Turtle’s pen (for line drawing, and outlines of circles, ellipses, boxes, and polygons). This can also be achieved by direct assignment of the global variable <code>turtt</code>."
  ),
  command(
    "penUp",
    () => [PCode.ldin, 0, PCode.pen],
    [],
    null,
    { category: 3, level: 0 },
    "Lifts the Turtle’s pen, so that subsequent movement will not draw a line on the Canvas."
  ),
  command(
    "penDown",
    () => [PCode.ldin, -1, PCode.pen],
    [],
    null,
    { category: 3, level: 0 },
    "Lowers the Turtle’s pen, so that subsequent movement will draw a line on the Canvas."
  ),
  command(
    "output",
    () => [PCode.outp],
    [p("clear", "boolean"), p("colour", "integer"), p("toFront", "boolean")],
    null,
    { category: 3, level: 1 },
    "Modifies the textual output. If the first argument is <code>true</code>, it clears any existing text. The second argument specifies the background colour, and the third argument is for switching the display. If the third argument is <code>true</code>, it switches to the <b>Output</b> tab, while if it is <code>false</code>, it switches to the <b>Canvas and Console</b> tab."
  ),
  command(
    "console",
    () => [PCode.cons],
    [p("clear", "boolean"), p("colour", "integer")],
    null,
    { category: 3, level: 1 },
    "Modifies the Console; if the first argument is <code>true</code>, it clears any existing text, while the second argument specifies the background colour."
  ),
  command(
    "rgb",
    () => [PCode.rgb],
    [p("colour", "integer")],
    "integer",
    { category: 3, level: 2 },
    "Returns the RGB value of the input <code>colour</code> (an integer between 1 and 50). For example, <code>rgb(red)=255</code>."
  ),
  command(
    "mixCols",
    () => [PCode.mixc],
    [p("col1", "integer"), p("col2", "integer"), p("prop1", "integer"), p("prop2", "integer")],
    "integer",
    { category: 3, level: 2 },
    "Mixes the given colours in the given proportions."
  ),
  command(
    "newTurtle",
    () => [PCode.ldin, 0, PCode.sptr],
    [p("array", "integer", false, 5)],
    null,
    { category: 3, level: 2 },
    "Points the Turtle to a custom array in memory (this must be an array of five integers, corresponding to the Turtle’s five properties, <code>turtx</code>, <code>turty</code>, <code>turtd</code>, <code>turtt</code>, and <code>turtc</code>). Use repeatedly to simulate multiple Turtles."
  ),
  command(
    "oldTurtle",
    (turtleAddress) => [PCode.ldin, turtleAddress, PCode.ldin, 0, PCode.sptr],
    [],
    null,
    { category: 3, level: 2 },
    "Points the Turtle back to the default (built-in) array in memory. Use in conjunction with <code>newTurtle</code>."
  ),
  // 4. Canvas operations
  command(
    "update",
    () => [PCode.ldin, -1, PCode.udat],
    [],
    null,
    { category: 4, level: 0 },
    "Makes the Machine update the Canvas, and continue updating with all subsequent drawing commands. Used in conjunction with <em>noupdate</em>."
  ),
  command(
    "noUpdate",
    () => [PCode.ldin, 0, PCode.udat],
    [],
    null,
    { category: 4, level: 0 },
    "Makes the Machine refrain from updating the Canvas when executing all subsequent drawing commands, until <em>update</em> is called. Use this to create smooth animations, by queueing up several drawing commands to execute simultaneously."
  ),
  command(
    "blank",
    () => [PCode.blnk],
    [p("colour", "integer")],
    null,
    { category: 4, level: 0 },
    "Blanks the entire Canvas with the specified <code>colour</code>."
  ),
  command(
    "canvas",
    () => [PCode.canv],
    [p("x1", "integer"), p("y1", "integer"), p("x2", "integer"), p("y2", "integer")],
    null,
    { category: 4, level: 1 },
    "Sets the top left Canvas coordinate to <code>(x1,y1)</code>, and the Canvas width and height to <code>x2</code> and <code>y2</code> respectively. Note that the width and height fix the number of virtual points on the Canvas, not the number of actual pixels."
  ),
  command(
    "resolution",
    () => [PCode.reso],
    [p("x", "integer"), p("y", "integer")],
    null,
    { category: 4, level: 1 },
    "Sets the Canvas resolution, i.e. the number of actual pixels in the <code>x</code> and <code>y</code> dimensions. To be used in conjunction with the <code>canvas</code> command, typically to set the number of actual pixels equal to the number of virtual points on the Canvas."
  ),
  command(
    "pixSet",
    () => [PCode.pixs],
    [p("x", "integer"), p("y", "integer"), p("colour", "integer")],
    null,
    { category: 4, level: 2 },
    "Sets the <code>colour</code> at point <code>(x,y)</code>."
  ),
  command(
    "pixCol",
    () => [PCode.pixc],
    [p("x", "integer"), p("y", "integer")],
    "integer",
    { category: 4, level: 2 },
    "Returns the RGB value of the colour at point <code>(x,y)</code>."
  ),
  command(
    "recolour",
    () => [PCode.rcol],
    [p("x", "integer"), p("y", "integer"), p("colour", "integer")],
    null,
    { category: 4, level: 2 },
    "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching any different colour."
  ),
  command(
    "fill",
    () => [PCode.fill],
    [p("x", "integer"), p("y", "integer"), p("colour", "integer"), p("boundary", "integer")],
    null,
    { category: 4, level: 2 },
    "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching the <code>boundary</code> colour."
  ),
  // 5. General arithmetic functions
  command(
    ["INC", , , "inc", ,],
    () => [PCode.dupl, PCode.lptr, PCode.incr, PCode.swap, PCode.sptr],
    [p("variable", "integer", true)],
    null,
    { category: 5, level: 0 },
    "Increments the specified <code>variable</code> by 1."
  ),
  command(
    ["DEC", , , "dec", ,],
    () => [PCode.dupl, PCode.lptr, PCode.decr, PCode.swap, PCode.sptr],
    [p("variable", "integer", true)],
    null,
    { category: 5, level: 0 },
    "Decrements the specified <code>variable</code> by 1."
  ),
  command(
    "abs",
    () => [PCode.abs],
    [p("n", "integer")],
    "integer",
    { category: 5, level: 0 },
    "Returns the absolute value of <code>n</code>, i.e. <code>n</code> if positive, <code>-n</code> if negative."
  ),
  command(
    ["SGN", "sign", "sign", "sign", "sign", "sign"],
    () => [PCode.sign],
    [p("a", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns <code>+1</code> if <code>a</code> is positive, <code>-1</code> if <code>a</code> is negative, and <code>0</code> otherwise."
  ),
  command(
    "max",
    () => [PCode.maxi],
    [p("a", "integer"), p("b", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns the maximum of <code>a</code> and <code>b</code>."
  ),
  command(
    "min",
    () => [PCode.mini],
    [p("a", "integer"), p("b", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns the minimum of <code>a</code> and <code>b</code>."
  ),
  command(
    ["SQR", "sqrt", "sqrt", "sqrt", "sqrt", "sqrt"],
    () => [PCode.sqrt],
    [p("a", "integer"), p("mult", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns <code>&radic;a</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "hypot",
    () => [PCode.hyp],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns <code>&radic;(a<sup>2</sup>+b<sup>2</sup>)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    ["RND"],
    () => [PCode.rand, PCode.incr],
    [p("n", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns a random integer between 1 and <code>n</code>."
  ),
  command(
    [, "rand", "randInt", "random", "randrange", "randInt"],
    () => [PCode.rand],
    [p("n", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns a random non-negative integer less than <code>n</code>."
  ),
  command(
    [, , , , "randint"],
    () => [
      PCode.swap,
      PCode.dupl,
      PCode.rota,
      PCode.incr,
      PCode.swap,
      PCode.subt,
      PCode.rand,
      PCode.plus,
    ],
    [p("a", "integer"), p("b", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Returns a random integer between <code>a</code> and <code>b</code>."
  ),
  command(
    ["RNDSEED", "srand", "seed", "randseed", "randseed", "seed"],
    () => [PCode.seed],
    [p("seed", "integer")],
    "integer",
    { category: 5, level: 1 },
    "Initialises the random number generator with the given <code>seed</code>, and returns that seed. If <code>seed</code> is 0, the seed is set from the current system clock."
  ),
  command(
    ["POWER", "pow", "power", "power", "power", "pow"],
    () => [PCode.powr],
    [p("a", "integer"), p("b", "integer"), p("c", "integer"), p("mult", "integer")],
    "integer",
    { category: 5, level: 2 },
    "Returns <code>(a/b)<sup>c</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "root",
    () => [PCode.root],
    [p("a", "integer"), p("b", "integer"), p("c", "integer"), p("mult", "integer")],
    "integer",
    { category: 5, level: 2 },
    "Returns <code><sup>c</sup>&radic;(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "divMult",
    () => [PCode.divm],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 5, level: 2 },
    "Returns <code>a/b</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "maxInt",
    () => [PCode.mxin],
    [],
    "integer",
    { category: 5, level: 2 },
    "Returns the maximum integer that the Machine can deal with (2<sup>31</sup>-1)."
  ),
  command(
    [, , , "shl"],
    () => [PCode.shft],
    [p("number", "integer"), p("shift", "integer")],
    "integer",
    { category: 5, level: 2 },
    "Shift bits left."
  ),
  command(
    [, , , "shr"],
    () => [PCode.neg, PCode.shft],
    [p("number", "integer"), p("shift", "integer")],
    "integer",
    { category: 5, level: 2 },
    "Shift bits right."
  ),
  // 6. Trig / exp / log functions
  command(
    "sin",
    () => [PCode.sin],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 1 },
    "Returns <code>sin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "cos",
    () => [PCode.cos],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 1 },
    "Returns <code>cos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "tan",
    () => [PCode.tan],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 1 },
    "Returns <code>tan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "pi",
    () => [PCode.pi],
    [p("mult", "integer")],
    "integer",
    { category: 6, level: 1 },
    "Returns the value of Pi, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "exp",
    () => [PCode.exp],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 1 },
    "Returns <code>a<sup>b</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    ["LN", "log", "log", "ln", "log", "log"],
    () => [PCode.ln],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 1 },
    "Returns <code>ln(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "antilog",
    () => [PCode.alog],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 2 },
    "Returns <code>antilog<sub>10</sub>(a/b)</code> - i.e. <code>10<sup>a/b</sub></code> - multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    "log10",
    () => [PCode.log],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 2 },
    "Returns <code>log<sub>10</sub>(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    ["ASN", "asin", "asin", "arcsin", "asin", "asin"],
    () => [PCode.asin],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 2 },
    "Returns <code>arcsin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    ["ACS", "acos", "acos", "arccos", "acos", "acos"],
    () => [PCode.acos],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 2 },
    "Returns <code>arccos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    ["ATN", "atan", "atan", "arctan", "atan", "atan"],
    () => [PCode.atan],
    [p("a", "integer"), p("b", "integer"), p("mult", "integer")],
    "integer",
    { category: 6, level: 2 },
    "Returns <code>arctan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  // 7. String/list operations
  command(
    ["PRINTON", "printon", "printon", "write", "printon"],
    () => [PCode.writ],
    [p("string", "string")],
    null,
    { category: 7, level: 0 },
    "Prints the input <code>string</code> to the console and textual output area of the System."
  ),
  command(
    ["PRINT", "print", "print", "writeln", "print", "print"],
    () => [PCode.writ, PCode.newl],
    [p("string", "string")],
    null,
    { category: 7, level: 0 },
    "Prints the input <code>string</code> to the console and textual output area of the System, followed by a line break."
  ),
  command(
    "display",
    () => [PCode.disp],
    [p("string", "string"), p("font", "integer"), p("size", "integer")],
    null,
    { category: 7, level: 0 },
    "Displays the input <code>string</code> on the canvas, in the Turtle’s current colour and at the Turtle’s current location, in the specified <code>font</code> and <code>size</code>. Can be used in conjunction with the <code>box</code> drawing command. For a list of available fonts, see the <b>Constants</b> tab."
  ),
  command(
    ["LCASE$", "strlwr", "toLowerCase", "lowercase", ".lower", "toLowerCase"],
    () => [PCode.ldin, 1, PCode.case],
    [p("string", "string")],
    "string",
    { category: 7, level: 1 },
    "Returns the input <code>string</code> as all lowercase."
  ),
  command(
    ["UCASE$", "strupr", "toUpperCase", "uppercase", ".upper", "toUpperCase"],
    () => [PCode.ldin, 2, PCode.case],
    [p("string", "string")],
    "string",
    { category: 7, level: 1 },
    "Returns the input <code>string</code> as all uppercase."
  ),
  command(
    ["CCASE$", "strcap", "capitalize", "initcap", ".capitalize", "capitalize"],
    () => [PCode.ldin, 3, PCode.case],
    [p("string", "string")],
    "string",
    { category: 7, level: 1 },
    "Returns the input <code>string</code> with the first letter capitalized."
  ),
  command(
    ["TCASE$", "strtitle", "toTitleCase", "titlecase", ".title", "toTitleCase"],
    () => [PCode.ldin, 4, PCode.case],
    [p("string", "string")],
    "string",
    { category: 7, level: 1 },
    "Returns the input <code>string</code> in title case (i.e. the first letter of each word capitalized)."
  ),
  command(
    ["SCASE$", "strswap", "swapCase", "swapcase", ".swapcase", "swapCase"],
    () => [PCode.ldin, 5, PCode.case],
    [p("string", "string")],
    "string",
    { category: 7, level: 1 },
    "Returns the input <code>string</code> with all the cases swapped."
  ),
  command(
    ["LEN", "strlen", "length", "length", "len", "length"],
    () => [PCode.slen],
    [p("string", "string")],
    "integer",
    { category: 7, level: 1 },
    "Returns the length of the input <code>string</code> (i.e. the number of characters)."
  ),
  command(
    ["DEL$", "delete"],
    () => [PCode.dels],
    [p("string", "string"), p("index", "integer"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    [, "strdel", "delete", , ".delete", "delete"],
    () => [PCode.swap, PCode.incr, PCode.swap, PCode.dels],
    [p("string", "string"), p("index", "integer"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    ["LEFT$"],
    () => [PCode.ldin, 1, PCode.swap, PCode.copy],
    [p("string", "string"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns a copy of the characters in the input <code>string</code>, starting on the left and of the specified <code>length</code>."
  ),
  command(
    ["MID$", , , "copy"],
    () => [PCode.copy],
    [p("string", "string"), p("index", "integer"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    [, "strcpy", "copy", , , "slice"],
    () => [PCode.swap, PCode.incr, PCode.swap, PCode.copy],
    [p("string", "string"), p("index", "integer"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    ["RIGHT$"],
    () => [
      PCode.swap,
      PCode.dupl,
      PCode.slen,
      PCode.incr,
      PCode.rota,
      PCode.subt,
      PCode.mxin,
      PCode.copy,
    ],
    [p("string", "string"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns a copy of the characters in the input <code>string</code>, starting on the right and of the specified <code>length</code>."
  ),
  command(
    ["INSERT$"],
    () => [PCode.rota, PCode.rota, PCode.inss],
    [p("string", "string"), p("index", "integer"), p("substr", "string")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  command(
    [, "strins", "insert", , "insert", "insert"],
    () => [PCode.rota, PCode.rota, PCode.swap, PCode.rota, PCode.incr, PCode.inss],
    [p("string", "string"), p("substr", "string"), p("index", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  command(
    [, , , "insert"],
    () => [PCode.inss],
    [p("substr", "string"), p("string", "string"), p("index", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  command(
    ["PAD$", "strpad", "pad", "pad", "pad"],
    () => [PCode.spad],
    [p("string", "string"), p("padding", "string"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with the input <code>padding</code> added either before or after to make a string of minimum given <code>length</cope>. The <code>padding</code> is placed before if <code>length</code> is positive, after if it is negative."
  ),
  command(
    [, , , , , "padStart"],
    () => [PCode.spad],
    [p("string", "string"), p("padding", "string"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with the input <code>padding</code> added before to make a string of minimum given <code>length</cope>."
  ),
  command(
    [, , , , , "padEnd"],
    () => [PCode.neg, PCode.spad],
    [p("string", "string"), p("padding", "string"), p("length", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with the input <code>padding</code> added after to make a string of minimum given <code>length</cope>."
  ),
  command(
    ["REPLACE$", "strrepl", "replace", "replace", ".replace", "replace"],
    () => [PCode.repl],
    [p("string", "string"), p("substr", "string"), p("replace", "string"), p("n", "integer")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with up to <code>n</code> occurences of <code>substring</code> replaced by <code>replace</code>. Set <code>n</code> equal to <code>0</code> to replace every occurence."
  ),
  command(
    ["INSTR"],
    () => [PCode.swap, PCode.poss],
    [p("string", "string"), p("substr", "string")],
    "integer",
    { category: 7, level: 2 },
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  command(
    [, "strpos", "indexOf", , ".index", "indexOf"],
    () => [PCode.swap, PCode.poss, PCode.decr],
    [p("string", "string"), p("substr", "string")],
    "integer",
    { category: 7, level: 2 },
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  command(
    [, "strpos", "indexOf", , ".index", "indexOf"],
    () => [PCode.swap, PCode.poss, PCode.decr],
    [p("string", "string"), p("substr", "string")],
    "integer",
    { category: 7, level: 2 },
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  command(
    [, , , , ".find"],
    () => [PCode.poss],
    [p("string", "string"), p("substr", "string")],
    "integer",
    { category: 7, level: 2 },
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, throws an error otherwise."
  ),
  command(
    [, , , "pos"],
    () => [PCode.poss],
    [p("substr", "string"), p("string", "string")],
    "integer",
    { category: 7, level: 2 },
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  command(
    ["STRIP", "strip", "trim", "strip", ".strip", "trim"],
    () => [PCode.trim],
    [p("string", "string")],
    "string",
    { category: 7, level: 2 },
    "Returns the input <code>string</code> with leading and trailing whitespace removed."
  ),
  command(
    [, , , , ".append"],
    () => [PCode.lapp],
    [],
    "string",
    { category: 7, level: 1 },
    "Appends the object to the specified list."
  ),
  command(
    [, , , , ".copy"],
    () => [PCode.lcpy],
    [],
    "string",
    { category: 7, level: 1 },
    "Returns a copy of the specified list."
  ),
  command(
    [, , , , ".extend"],
    () => [PCode.lext],
    [],
    "string",
    { category: 7, level: 1 },
    "Extends the contents of the specified list by concatenation."
  ),
  command(
    [, , , , ".insert"],
    () => [PCode.lins],
    [],
    "string",
    { category: 7, level: 1 },
    "Inserts the object at the specified index."
  ),
  command(
    [, , , , ".remove"],
    () => [PCode.lrem],
    [],
    "string",
    { category: 7, level: 1 },
    "Removes the first item from the specified list whose value is equal to the specified value."
  ),
  command(
    [, , , , ".reverse"],
    () => [PCode.lrev],
    [],
    "string",
    { category: 7, level: 1 },
    "Reverses the order of the specified list."
  ),
  // 8. Type conversion routines
  command(
    ["STR$", "itoa", "toString", "str", "str", "toString"],
    () => [PCode.itos],
    [p("n", "integer")],
    "string",
    { category: 8, level: 0 },
    "Returns the integer <code>n</code> as a string, e.g. <code>str(12)='12'</code>."
  ),
  command(
    ["VAL"],
    () => [PCode.ldin, 1, PCode.sval],
    [p("string", "string")],
    "integer",
    { category: 8, level: 0 },
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    [, , , "val"],
    () => [PCode.ldin, 2, PCode.sval],
    [p("string", "string")],
    "integer",
    { category: 8, level: 0 },
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    [, "atoi", "parseInt", , "int", "parseInt"],
    () => [PCode.ldin, 3, PCode.sval],
    [p("string", "string")],
    "integer",
    { category: 8, level: 0 },
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    ["VALDEF"],
    () => [PCode.ldin, 1, PCode.svdf],
    [p("string", "string"), p("default", "integer")],
    "integer",
    { category: 8, level: 0 },
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    [, , , "valdef"],
    () => [PCode.ldin, 2, PCode.svdf],
    [p("string", "string"), p("default", "integer")],
    "integer",
    { category: 8, level: 0 },
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    [, "atoidef", "parseIntDef", , "intdef", "parseIntDef"],
    () => [PCode.ldin, 3, PCode.svdf],
    [p("string", "string"), p("default", "integer")],
    "integer",
    { category: 8, level: 0 },
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    ["QSTR$", "qitoa", "toStringQ", "qstr", "qstr", "toStringQ"],
    () => [PCode.qtos],
    [p("a", "integer"), p("b", "integer"), p("decplaces", "integer")],
    "string",
    { category: 8, level: 1 },
    "Returns the value of <code>a/b</code> to the specified number of decimal places, as a decimal string, e.g. <code>qstr(2,3,4)='0.6667'</code>."
  ),
  command(
    ["QVAL", "qatoi", "parseIntQ", "qval", "qint", "parseIntQ"],
    () => [PCode.qval],
    [p("string", "string"), p("mult", "integer"), p("default", "integer")],
    "integer",
    { category: 8, level: 1 },
    "Returns the input decimal <code>string</code> as an integer, multiplied by <code>mult</code> and rounded to the nearest integer, e.g. <code>qval('1.5',10)=15</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not a decimal string)."
  ),
  command(
    ["CHR$", , , , "chr", "fromCharCode"],
    () => [PCode.ctos],
    [p("n", "integer")],
    "string",
    { category: 8, level: 2 },
    "Returns the character with ASCII character code <code>n</code>."
  ),
  command(
    [, , "fromCharCode", "chr"],
    () => [],
    [p("n", "integer")],
    "character",
    { category: 8, level: 2 },
    "Returns the character with ASCII character code <code>n</code>."
  ),
  command(
    ["ASC", , "charCode", , "ord", "charCode"],
    () => [PCode.sasc],
    [p("char", "string")],
    "integer",
    { category: 8, level: 2 },
    "Returns the ASCII code of the input character, or of the first character of the input string."
  ),
  command(
    [, , , "ord"],
    () => [],
    [p("char", "character")],
    "integer",
    { category: 8, level: 2 },
    "Returns the ASCII code of the input character."
  ),
  command(
    ["BOOLINT", , , "boolint"],
    () => [],
    [p("boolean", "boolean")],
    "integer",
    { category: 8, level: 2 },
    "Returns the input <code>boolean</code> as an integer (-1 for <code>true</code>, 0 for <code>false</code>)."
  ),
  command(
    ["HEX$", "itoahex", "toStringHex", "hexstr", "hex", "toStringHex"],
    () => [PCode.hexs],
    [p("n", "integer"), p("minlength", "integer")],
    "string",
    { category: 8, level: 2 },
    "Returns a string representation of integer <code>n</code> in hexadecimal format, padded with leading zeros as up to <code>minlength</code>, e.g. <code>hexstr(255,6)='0000FF'</code>."
  ),
  // 9. Input and timing routines
  command(
    "pause",
    () => [PCode.wait],
    [p("m", "integer")],
    null,
    { category: 9, level: 0 },
    "Makes the Turtle Machine wait <code>m</code> milliseconds before performing the next operation. This is useful for controlling the speed of animations."
  ),
  command(
    ["HALT", "exit", "halt", "halt", "halt", "halt"],
    () => [PCode.halt],
    [],
    null,
    { category: 9, level: 0 },
    "Halts the program."
  ),
  command(
    ["GETLINE$", "gets", "readLine", "readln", "readLine", "readLine"],
    () => [PCode.rdln],
    [],
    "string",
    { category: 9, level: 0 },
    "Waits for the RETURN key to be pressed, then returns everything in the keybuffer up to (and not including) the new line character."
  ),
  command(
    ["INPUT$", "scan", "input", , "input", "input"],
    () => [PCode.writ, PCode.newl, PCode.rdln],
    [p("prompt", "string")],
    "string",
    { category: 9, level: 0 },
    "Gives an input prompt, then returns the input when the RETURN key is pressed (using the keybuffer)."
  ),
  command(
    "cursor",
    () => [PCode.curs],
    [p("cursorcode", "integer")],
    null,
    { category: 9, level: 1 },
    "Sets which cursor to display (1-15) when the mouse pointer is over the canvas. 0 hides the cursor; any value outside the range 0-15 resets the default cursor. For a list of available cursors, see the <b>Cursors</b> tab."
  ),
  command(
    "keyEcho",
    () => [PCode.kech],
    [p("on", "boolean")],
    null,
    { category: 9, level: 1 },
    "Turns the keyboard echo to the console on (<code>true</code>) or off (<code>false</code>)."
  ),
  command(
    "detect",
    () => [PCode.tdet],
    [p("inputcode", "integer"), p("m", "integer")],
    "integer",
    { category: 9, level: 1 },
    "Waits a maximum of <code>m</code> milliseconds for the key with the specified <code>inputcode</code> to be pressed; returns its current input value if pressed (and stops waiting), and <code>0</code> otherwise."
  ),
  command(
    ["GET$", "get", "read", "read", "read", "read"],
    () => [PCode.read],
    [p("n", "integer")],
    "string",
    { category: 9, level: 1 },
    "Returns the first <code>n</code> characters from the keybuffer as a string."
  ),
  command(
    "time",
    () => [PCode.time],
    [],
    "integer",
    { category: 9, level: 1 },
    "Returns the time (in milliseconds) since the program began."
  ),
  command(
    "timeSet",
    () => [PCode.tset],
    [p("m", "integer")],
    null,
    { category: 9, level: 1 },
    "Artificially sets the time since the program began to <code>m</code> milliseconds."
  ),
  command(
    "reset",
    () => [PCode.iclr],
    [p("\\inputcode", "integer")],
    null,
    { category: 9, level: 2 },
    "Resets the specified <code>\\inputcode</code> (<code>\\mousex</code>, <code>\\mousey</code>, <code>\\backspace</code>, <code>\\enter</code>, etc.) to its initial value (i.e. -1)."
  ),
  command(
    "status",
    () => [PCode.stat],
    [p("\\inputcode", "integer")],
    "integer",
    { category: 9, level: 2 },
    "Returns the <code>?kshift</code> value for the most recent press/click of the input with the specified <code>\\inputcode</code>."
  ),
  command(
    "keyBuffer",
    () => [PCode.bufr, PCode.ldin, 1, PCode.sptr, PCode.hfix],
    [p("n", "integer")],
    null,
    { category: 9, level: 2 },
    "Creates a new custom keybuffer of length <code>n</code>. A keybuffer of length 32 is available by default; use this command if you need a larger buffer."
  ),
  // 10. file processing
  command(
    "chdir",
    () => [PCode.chdr],
    [p("directory name", "string")],
    null,
    { category: 10, level: 1 },
    "Changes the current directory."
  ),
  command(
    "rmdir",
    () => [PCode.ldin, 1, PCode.diry, PCode.ldin, 128, PCode.less],
    [p("subdirectory name", "string")],
    "boolean",
    { category: 10, level: 1 },
    "Removes a subdirectory."
  ),
  command(
    "mkdir",
    () => [PCode.ldin, 2, PCode.diry, PCode.ldin, 127, PCode.more],
    [p("subdirectory name", "string")],
    "boolean",
    { category: 10, level: 1 },
    "Creates a subdirectory."
  ),
  command(
    [, "openFile", "openFile", "openfile", "fopen", "openFile"],
    () => [PCode.open],
    [p("filename", "string"), p("mode", "integer")],
    "integer",
    { category: 10, level: 1 },
    "Opens a file (1: read, 2: append, 3: write)."
  ),
  command(
    ["OPENIN"],
    () => [PCode.ldin, 1, PCode.open],
    [p("filename", "string")],
    "integer",
    { category: 10, level: 1 },
    "Open a file for reading."
  ),
  command(
    ["OPENUP"],
    () => [PCode.ldin, 2, PCode.open],
    [p("filename", "string")],
    "integer",
    { category: 10, level: 1 },
    "Opens a file for appending."
  ),
  command(
    ["OPENOUT"],
    () => [PCode.ldin, 4, PCode.open],
    [p("filename", "string")],
    "integer",
    { category: 10, level: 1 },
    "Opens a file for writing."
  ),
  command(
    ["CLOSE#", "closeFile", "closeFile", "closefile", "fclose", "closeFile"],
    () => [PCode.clos],
    [p("file handle", "integer")],
    null,
    { category: 10, level: 1 },
    "Closes a file."
  ),
  command(
    ["DELETEFILE", "deleteFile", "deleteFile", "deletefile", "fremove", "deleteFile"],
    () => [PCode.ldin, 1, PCode.file, PCode.ldin, 128, PCode.less],
    [p("filename", "string")],
    "boolean",
    { category: 10, level: 1 },
    "Deletes a file."
  ),
  command(
    ["FREAD#", "fread", "fread", "fread", "fread", "fread"],
    () => [PCode.frds],
    [p("file handle", "integer"), p("n", "integer")],
    "string",
    { category: 10, level: 1 },
    "Reads n characters (maximum) from a file."
  ),
  command(
    ["FREADLN#", "freadln", "freadln", "freadln", "freadline", "freadln"],
    () => [PCode.frln],
    [p("file handle", "integer")],
    "string",
    { category: 10, level: 1 },
    "Reads a line from a file."
  ),
  command(
    ["FWRITE#", "fwrite", "fwrite", "fwrite", "fwrite", "fwrite"],
    () => [PCode.fwrs],
    [p("file handle", "integer"), p("string", "string")],
    null,
    { category: 10, level: 1 },
    "Writes a string to a file."
  ),
  command(
    ["FWRITELN#", "fwriteln", "fwriteln", "fwriteln", "fwriteline", "fwriteln"],
    () => [PCode.fwln],
    [p("file handle", "integer"), p("string", "string")],
    null,
    { category: 10, level: 1 },
    "Writes a line to a file."
  ),
  command(
    ["EOF#", "eof", "eof", "eof", "feof", "eof"],
    () => [PCode.eof],
    [p("file handle", "integer")],
    "boolean",
    { category: 10, level: 1 },
    "Tests for the end of file."
  ),
  command(
    "checkdir",
    () => [PCode.ldin, 0, PCode.diry, PCode.ldin, 127, PCode.more],
    [p("directory name", "string"), p("code", "integer")],
    "integer",
    { category: 10, level: 2 },
    "Creates/deletes/checks a directory."
  ),
  command(
    "checkfile",
    () => [PCode.ldin, 0, PCode.file, PCode.ldin, 127, PCode.more],
    [p("filename", "string"), p("code", "integer")],
    "integer",
    { category: 10, level: 2 },
    "Creates/deletes/checks a file."
  ),
  command(
    ["COPYFILE", "copyFile", "copyFile", "copyfile", "fcopy", "copyFile"],
    () => [PCode.ldin, 3, PCode.fmov],
    [p("old name", "string"), p("new name", "string")],
    "boolean",
    { category: 10, level: 2 },
    "Copies a file."
  ),
  command(
    ["DIREXISTS", "dirExists", "dirExists", "direxists", "isdir", "dirExists"],
    () => [PCode.ldin, 0, PCode.diry, PCode.ldin, 127, PCode.more],
    [p("subdirectory name", "string")],
    "boolean",
    { category: 10, level: 2 },
    "Checks whether a subdirectory exists."
  ),
  command(
    ["FILEEXISTS", "fileExists", "fileExists", "fileexists", "isfile", "fileExists"],
    () => [PCode.ldin, 0, PCode.file, PCode.ldin, 127, PCode.more],
    [p("filename", "string")],
    "boolean",
    { category: 10, level: 2 },
    "Checks whether a file exists."
  ),
  command(
    "findDir",
    () => [PCode.dupl, PCode.lptr, PCode.rota, PCode.fdir, PCode.swap, PCode.rota, PCode.sptr],
    [p("directory name pattern", "string"), p("file handle", "integer")],
    "string",
    { category: 10, level: 2 },
    "Finds the first directory matching the pattern."
  ),
  command(
    "findFirst",
    () => [PCode.dupl, PCode.lptr, PCode.rota, PCode.ffnd, PCode.swap, PCode.rota, PCode.sptr],
    [p("filename pattern", "string"), p("file handle", "integer")],
    "string",
    { category: 10, level: 2 },
    "Finds the first file matching the pattern."
  ),
  command(
    "findNext",
    () => [PCode.fnxt],
    [p("file handle", "integer")],
    "string",
    { category: 10, level: 2 },
    "Finds the next file/directory matching a pattern."
  ),
  command(
    ["RENAMEFILE", "renameFile", "renameFile", "renamefile", "frename", "renameFile"],
    () => [PCode.ldin, 1, PCode.fmov],
    [p("old filename", "string"), p("new filename", "string")],
    "boolean",
    { category: 10, level: 2 },
    "Rename file"
  ),
  command(
    ["MOVEFILE", "moveFile", "moveFile", "movefile", "fmove", "moveFile"],
    () => [PCode.ldin, 2, PCode.fmov],
    [p("old filename", "string"), p("new filename", "string")],
    "boolean",
    { category: 10, level: 2 },
    "Moves a file."
  ),
  command(
    ["RESTARTFILE", "restartFile", "restartFile", "restartfile", "frestart", "restartFile"],
    () => [PCode.fbeg],
    [p("file handle", "integer")],
    null,
    { category: 10, level: 2 },
    "Restarts reading a file."
  ),
  command(
    ["EOLN#", "eoln", "eoln", "eoln", "eoln", "eoln"],
    () => [PCode.eoln],
    [p("file handle", "integer")],
    "boolean",
    { category: 10, level: 2 },
    "Tests for end of line in a file."
  ),
  // 11. Turtle Machine monitoring
  command(
    "dump",
    () => [PCode.dump],
    [],
    null,
    { category: 11, level: 2 },
    "“Dumps” the current memory state into the display in the memory tab."
  ),
  command(
    "heapReset",
    () => [PCode.hrst],
    [],
    null,
    { category: 11, level: 2 },
    "Resets the memory heap to the initial global value."
  ),
  command(
    "address",
    () => [],
    [p("variable", "integer", true)],
    "integer",
    { category: 11, level: 2 },
    "Returns the address in memory of the given <code>variable</code>."
  ),
  command(
    "peek",
    () => [PCode.lptr],
    [p("address", "integer")],
    "integer",
    { category: 11, level: 2 },
    "Peek at the value of the memory at the given <code>address</code>."
  ),
  command(
    "poke",
    () => [PCode.poke],
    [p("address", "integer"), p("value", "integer")],
    null,
    { category: 11, level: 2 },
    "Poke the <code>value</code> into the memory at the given <code>address</code>."
  ),
  command(
    "trace",
    () => [PCode.trac],
    [p("on", "boolean")],
    null,
    { category: 11, level: 2 },
    "Turns the PCode trace facility on (<code>true</code>) or off (<code>false</code>)."
  ),
  command(
    "watch",
    () => [PCode.memw],
    [p("address", "integer")],
    null,
    { category: 11, level: 2 },
    "Sets an <code>address</code> in memory for the trace facility to watch."
  ),
  command(
    "pcodeHalt",
    () => [PCode.pcoh],
    [p("pcodeLine", "integer")],
    null,
    { category: 11, level: 2 },
    "Halts program execution after the given <code>pcodeLine</code>."
  ),
] as const;

export default commands;
