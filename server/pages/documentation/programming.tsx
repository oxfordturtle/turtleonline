import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>Programming with the Turtle System</h1>
    <p>
      The guides here cover both using the Turtle System and learning to program with it. They start
      by taking you through the basics of the system itself, and of using Turtle Graphics to create
      pictures and animations. They then introduce key programming concepts like variables, loops,
      functions, and recursion. They then teach you how to use these tools to create fun and complex
      programs, applying Computer Science to several other aspects of the National Curriculum
      (incorporating materials from our <a href="/documentation/csac">CSAC project</a>).
    </p>
  </>
);

const main = (
  <>
    <p>
      <em>
        Note: versions of these documents for other languages are potentially available on request -
        if you are a teacher who would like to use such documents, please email details of your
        request to Peter Millican (peter.millican@hertford.ox.ac.uk).
      </em>
    </p>
    <ul>
      <li>
        <a href="/downloads/docs/Turtle_Python_1_Getting_Started.pdf">
          Turtle Python 1 - Getting Started
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_2_Spirals_and_Shapes.pdf">
          Turtle Python 2 - Spirals and Shapes
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_3_Introducing_Recursion.pdf">
          Turtle Python 3 - Introducing Recursion
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_4_Animation_and_Input.pdf">
          Turtle Python 4 - Animation and Input
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_5_Cellular_Models.pdf">
          Turtle Python 5 - Cellular Models
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_6_Cellular_Automata.pdf">
          Turtle Python 6 - Cellular Automata
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_7_Chaotic_Phenomena.pdf">
          Turtle Python 7 - Chaotic Phenomena
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_8_Iterated_Function_Systems.pdf">
          Turtle Python 8 - Iterated Function Systems
        </a>
      </li>
    </ul>
  </>
);
