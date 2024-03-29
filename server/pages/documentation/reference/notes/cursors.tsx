import React from "react";

export default (): JSX.Element => (
  <>
    <p>
      The native <code data-language="BASIC">CURSOR</code>
      <code data-language="C">cursor</code>
      <code data-language="Java">cursor</code>
      <code data-language="Pascal">cursor</code>
      <code data-language="Python">cursor</code>
      <code data-language="TypeScript">cursor</code> command sets which cursor
      to display when the mouse is over the canvas. Setting it to 0 makes the
      mouse invisible. Values in the range 1-15 set it to the cursor shown in
      the table below (move your mouse over each box to preview the cursor). Any
      other value will reset to the default cursor. Note that the actual cursor
      displayed depends on your operating system, and may vary from computer to
      computer.
    </p>
  </>
);
