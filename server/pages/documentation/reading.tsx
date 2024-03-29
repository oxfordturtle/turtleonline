import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>Further Reading</h1>
    <p>
      The principles behind the <i>Turtle System</i> were explained in Peter Millican’s 2004
      research thesis, which discusses much of the relevant pedagogical literature, as well as
      providing technical details and results from teaching experience. For a less technical
      introduction, see Peter Millican’s articles in Computing at School’s SwitchedOn magazine.
    </p>
  </>
);

const main = (
  <>
    <h2>Peter Millican’s Research Thesis</h2>
    <ul>
      <li>
        <a href="http://www.millican.org/papers/2004MSc.pdf">
          <i>Turtle</i>: Innovative Software for the Learning of Computing Concepts
        </a>{" "}
        (PDF)
      </li>
      <li>
        <a href="http://www.millican.org/papers/2004MScImages.pdf">
          Appendix: Examples of student work using <i>Turtle</i>
        </a>{" "}
        (PDF)
      </li>
    </ul>
    <h2>Peter Millican’s Articles in SwitchedOn Magazine</h2>
    <ul className="articles-list">
      <li>
        <a href="/downloads/SwitchedOn_Issue15_Double.pdf">
          <img src="/images/switchedon-issue15.jpg" alt="SwitchedOn Article 1" />
        </a>
      </li>
      <li>
        <a href="/downloads/SwitchedOn_Issue16_Double.pdf">
          <img src="/images/switchedon-issue16.jpg" alt="SwitchedOn Article 2" />
        </a>
      </li>
      <li>
        <a href="/downloads/SwitchedOn_Issue21_Double.pdf">
          <img src="/images/switchedon-issue21.jpg" alt="SwitchedOn Article 3" />
        </a>
      </li>
    </ul>
    <h3>The Turtle System</h3>
    <h4>An Easy Way Into Text-Based Programming and Computer Science</h4>
    <ul>
      <li>
        <a href="/downloads/SwitchedOn_Issue15_Single.pdf">
          The Turtle System (PDF, single-page format)
        </a>
      </li>
      <li>
        <a href="/downloads/SwitchedOn_Issue15_Double.pdf">
          The Turtle System (PDF, double-page format)
        </a>
      </li>
    </ul>
    <p>
      “The <i>Turtle System</i>, with teaching resources and tools for setting and marking
      coursework, is available free thanks to a new project at Oxford University co-funded by the
      Department for Education. Peter Millican, Professor of Philosophy at Hertford College,
      explains the principles behind the system he has developed.”
    </p>
    <h3>Using the Turtle System:</h3>
    <h4>An Easy Way To Start Text-Based Programming</h4>
    <ul>
      <li>
        <a href="/downloads/SwitchedOn_Issue16_Single.pdf">
          Using the Turtle System (PDF, single-page format)
        </a>
      </li>
      <li>
        <a href="/downloads/SwitchedOn_Issue16_Double.pdf">
          Using the Turtle System (PDF, double-page format)
        </a>
      </li>
    </ul>
    <p>
      “The <i>Turtle System</i>, with teaching resources and coursework setting and marking tools,
      is available free thanks to a new project at Oxford University co-funded by the Department for
      Education. Peter Millican, Professor at Hertford College, Oxford, shows how to get started,
      both using the system and teaching with it.”
    </p>
    <h3>Computing Concepts and Models</h3>
    <h4>to Enrich the Entire School Curriculum</h4>
    <ul>
      <li>
        <a href="/downloads/SwitchedOn_Issue21_Single.pdf">
          Computing Concepts and Models (PDF, single-page format)
        </a>
      </li>
      <li>
        <a href="/downloads/SwitchedOn_Issue21_Double.pdf">
          Computing Concepts and Models (PDF, double-page format)
        </a>
      </li>
    </ul>
    <p>
      “The <i>Turtle System</i> has recently been significantly developed at Oxford University
      thanks to a project co-funded by the Department for Education. Peter Millican, Professor at
      Hertford College and author of the system, has written a free book and suite of programs
      illustrating the value of CS concepts to many subjects.”
    </p>
  </>
);
