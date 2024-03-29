import React from "react";

export default (): JSX.Element => (
  <>
    <div className="controls" data-action="closeMenu" data-arg="system">
      <select aria-label="tab" data-action="selectTab">
        <option value="canvas">Canvas &amp; Console</option>
        <option value="output">Output</option>
        <option value="usage" data-mode="normal,expert,machine">
          Usage
        </option>
        <option value="comments" data-mode="expert,machine">
          Comments
        </option>
        <option value="syntax" data-mode="expert,machine">
          Syntax
        </option>
        {/*<option value="variables" data-mode="expert,machine">Variables &amp; Subroutines</option>*/}
        <option value="pcode" data-mode="expert,machine">
          PCode
        </option>
        <option value="memory" data-mode="expert,machine">
          Memory
        </option>
        <option value="options" data-mode="machine">
          Run Settings
        </option>
      </select>
      <select aria-label="language" data-binding="language"></select>
      <button title="Maximize" data-action="maximize">
        <i className="fa fa-expand" aria-hidden="true"></i>
      </button>
    </div>
  </>
);
