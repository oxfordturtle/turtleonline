import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>Self-Teach Exercises</h1>
    <p>
      The <em>Turtle System</em> supports programming in several specially designed languages. These
      are cut-down versions of their respective parent languages, but are still highly expressive,
      with support for constants and variables, procedures and functions, loops and conditionals,
      keyboard and mouse input detection, and of course Turtle Graphics commands for drawing and
      animation. The core documentation for these languages is available within the Turtle System
      itself, under the “QuickHelp 1” and “QuickHelp 2” tabs, and in the{" "}
      <a href="/documentation/languages">Turtle Languages</a> documentation on this site. In
      addition, the links below provide some self-teach exercises, which are designed to help
      complete beginners get started with the basics of text-based programming.
    </p>
  </>
);

const main = (
  <>
    <ul>
      <li>
        <a href="/downloads/docs/Turtle_BASIC_Exercises_1-12.pdf">
          Turtle BASIC - Self-Teach Exercises 1-12
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_BASIC_Exercises_Getting_Started.pdf">
          Turtle BASIC - Getting Started with the Exercises
        </a>
      </li>
    </ul>
    <ul>
      <li>Turtle C - Self-Teach Exercises 1-12 [coming soon]</li>
      <li>Turtle C - Getting Started with the Exercises [coming soon]</li>
    </ul>
    <ul>
      <li>Turtle Java - Self-Teach Exercises 1-12 [coming soon]</li>
      <li>Turtle Java - Getting Started with the Exercises [coming soon]</li>
    </ul>
    <ul>
      <li>
        <a href="/downloads/docs/Turtle_Pascal_Exercises_1-12.pdf">
          Turtle Pascal - Self-Teach Exercises 1-12
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Pascal_Exercises_Getting_Started.pdf">
          Turtle Pascal - Getting Started with the Exercises
        </a>
      </li>
    </ul>
    <ul>
      <li>
        <a href="/downloads/docs/Turtle_Python_Exercises_1-12.pdf">
          Turtle Python - Self-Teach Exercises 1-12
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_Exercises_Getting_Started.pdf">
          Turtle Python - Getting Started with the Exercises
        </a>
      </li>
    </ul>
    <ul>
      <li>Turtle TypeScript - Self-Teach Exercises 1-12 [coming soon]</li>
      <li>Turtle TypeScript - Getting Started with the Exercises [coming soon]</li>
    </ul>
  </>
);
