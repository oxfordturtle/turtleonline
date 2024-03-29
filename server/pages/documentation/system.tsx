import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>Turtle System User Guides</h1>
    <p>
      The <i>Turtle System</i> is designed to be as easy to use and self-explanatory as possible,
      and consequently you should have little difficulty at least in getting started. However, there
      are several features&mdash;particularly those designed to help teachers&mdash;that will not be
      obvious unless you know to look for them. The following guides point these out to you, while
      going systematically through the various menus.
    </p>
  </>
);

const main = (
  <>
    <ul>
      <li>
        <a href="/downloads/docs/Guide_for_Normal_Users.pdf">
          The Turtle System - Guide for Normal Users
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Guide_for_Online_Users.pdf">
          The Turtle System - Guide for Online Users
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Guide_for_Power_Users.pdf">
          The Turtle System - Guide for Power Users
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Guide_for_Teachers.pdf">The Turtle System - Guide for Teachers</a>
      </li>
    </ul>
  </>
);
