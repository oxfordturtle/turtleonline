import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-action="toggleSystemMenu" data-arg="options">
        <i className="fa fa-cogs" title="Options"></i>
        <span>Options</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="options">
        <label>
          <input
            type="radio"
            name="canvasStartSize"
            data-binding="canvasStartSize"
            value="500"
          />
          <span>Start programs with 500x500 Canvas and Resolution</span>
        </label>
        <label>
          <input
            type="radio"
            name="canvasStartSize"
            data-binding="canvasStartSize"
            value="1000"
          />
          <span>Start programs with 1000x1000 Canvas and Resolution</span>
        </label>
        <label>
          <input
            type="radio"
            name="canvasStartSize"
            data-binding="canvasStartSize"
            value="2000"
          />
          <span>Start programs with 2000x2000 Canvas and Resolution</span>
        </label>
        <hr data-mode="expert,machine" />
        <label data-mode="expert,machine">
          <input type="checkbox" data-binding="autoCompileOnLoad" />
          <span>Auto-Compile on loading</span>
        </label>
        <label data-mode="expert,machine">
          <input type="checkbox" data-binding="autoRunOnLoad" />
          <span>Auto-Run on loading</span>
        </label>
        <label data-mode="expert,machine">
          <input type="checkbox" data-binding="autoFormatOnLoad" />
          <span>Auto-Format on loading</span>
        </label>
        <hr />
        <a data-action="saveSettings">
          <span>Save current settings (login required)</span>
        </a>
        <label>
          <input type="checkbox" data-binding="alwaysSaveSettings" />
          <span>Always save current settings (login required)</span>
        </label>
        <a data-action="resetSettings">
          <span>Reset settings to default</span>
        </a>
      </div>
    </div>
  </>
);
