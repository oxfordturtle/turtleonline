import React from "react";

export default (): JSX.Element => (
  <>
    <p>
      The <code data-language="BASIC">KEYSTATUS</code>
      <code data-language="C">keystatus</code>
      <code data-language="Java">keyStatus</code>
      <code data-language="Pascal">keystatus</code>
      <code data-language="Python">keystatus</code>
      <code data-language="TypeScript">keyStatus</code> and{" "}
      <code data-language="BASIC">RESET</code>
      <code data-language="C">reset</code>
      <code data-language="Java">reset</code>
      <code data-language="Pascal">reset</code>
      <code data-language="Python">reset</code>
      <code data-language="TypeScript">reset</code> commands both take an
      integer parameter specifying the index of the key in the key status array
      (see the{" "}
      <a href="{{ path('documentation_help', {tab: 'input'}) }}">
        Turtle Languages Help: User Input
      </a>{" "}
      page). These indexes correspond to the standard numeric codes for keys
      used in a variety of contexts. To save you from having to remember them,
      the <em>Turtle System</em> has several predefined constants providing you
      with simpler mnemonics for these codes. The full list is given below.
    </p>
  </>
);
