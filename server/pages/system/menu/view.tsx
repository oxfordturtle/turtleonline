import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-action="toggleSystemMenu" data-arg="view">
        <i className="fa fa-glasses" title="View"></i>
        <span>View</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="view">
        <label>
          <span>Font family for editor:</span>
          <select data-binding="editorFontFamily"></select>
        </label>
        <label>
          <span>Font size for editor (px):</span>
          <input type="number" data-binding="editorFontSize" />
        </label>
        <hr />
        <label>
          <span>Font family for output:</span>
          <select data-binding="outputFontFamily"></select>
        </label>
        <label>
          <span>Font size for output (px):</span>
          <input type="number" data-binding="outputFontSize" />
        </label>
        <hr />
        <label>
          <input type="radio" name="mode" data-binding="mode" value="simple" />
          <span>Simple Mode</span>
        </label>
        <label>
          <input type="radio" name="mode" data-binding="mode" value="normal" />
          <span>Normal Mode</span>
        </label>
        <label>
          <input type="radio" name="mode" data-binding="mode" value="expert" />
          <span>Expert Mode</span>
        </label>
        <label>
          <input type="radio" name="mode" data-binding="mode" value="machine" />
          <span>Machine Mode</span>
        </label>
      </div>
    </div>
  </>
);
