import React from "react";

export default (): JSX.Element => (
  <>
    <p>
      The Turtle System has 50 predefined colour constants, shown in the table
      below. Every command that takes a colour argument (e.g. the{" "}
      <code data-language="BASIC">COLOUR</code>
      <code data-language="C">colour</code>
      <code data-language="Java">colour</code>
      <code data-language="Pascal">colour</code>
      <code data-language="Python">colour</code>
      <code data-language="TypeScript">colour</code> command, which sets the
      Turtle’s current drawing colour) can be given an RGB value, or one of the
      predefined colour names below. The compiler will translate this name into
      the corresponding RGB value. Alternatively, you can also use the
      corresponding number between 1 and 50 together with the{" "}
      <code data-language="BASIC">RGB</code>
      <code data-language="C">rgb</code>
      <code data-language="Java">rgb</code>
      <code data-language="Pascal">rgb</code>
      <code data-language="Python">rgb</code>
      <code data-language="TypeScript">rgb</code> command. For example,{" "}
      <code data-language="BASIC">BLUE</code>
      <code data-language="C">blue</code>
      <code data-language="Java">blue</code>
      <code data-language="Pascal">blue</code>
      <code data-language="Python">blue</code>
      <code data-language="TypeScript">blue</code> is equivalent to{" "}
      <code data-language="BASIC">RGB(3)</code>
      <code data-language="C">rgb(3)</code>
      <code data-language="Java">rgb(3)</code>
      <code data-language="Pascal">rgb(3)</code>
      <code data-language="Python">rgb(3)</code>
      <code data-language="TypeScript">rgb(3)</code>.
    </p>
  </>
);
