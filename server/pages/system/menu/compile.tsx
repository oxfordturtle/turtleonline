import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu" data-mode="expert,machine">
      <a data-action="toggleSystemMenu" data-arg="compile">
        <i className="fa fa-code" title="Compile"></i>
        <span>Compile</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div
        className="system-sub-menu"
        data-system-menu="compile"
        data-mode="expert,machine"
      >
        <a data-action="compile">
          <span>Compile to Turtle Machine PCode</span>
        </a>
        <hr />
        <a data-action="savePCodeJson">
          <span>Save Turtle Machine PCode file (JSON)</span>
        </a>
        <a data-action="savePCodeBinary" data-mode="machine">
          <span>Save Turtle Machine PCode file (binary)</span>
        </a>
        <hr data-mode="machine" />
        <label data-mode="machine">
          <input type="checkbox" data-binding="setupDefaultKeyBuffer" />
          <span>Automatically set up default key buffer (length 32)</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-binding="turtleAttributesAsGlobals" />
          <span>Treat Turtle attributes as global variables</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-binding="initialiseLocals" />
          <span>Initialise local variables (to zero/false)</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-binding="allowCSTR" />
          <span>Allow quick string parameter copying with CSTR</span>
        </label>
        <hr data-mode="machine" />
        <label data-mode="machine">
          <input type="checkbox" data-binding="separateReturnStack" />
          <span>Turtle machine using separate Return Stack</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-binding="separateMemoryControlStack" />
          <span>Turtle machine using separate Memory Control Stack</span>
        </label>
        <label data-mode="machine">
          <input
            type="checkbox"
            data-binding="separateSubroutineRegisterStack"
          />
          <span>Turtle machine using Subroutine Register Stack</span>
        </label>
      </div>
    </div>
  </>
);
