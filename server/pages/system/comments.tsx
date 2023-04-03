import React from "https://esm.sh/react@18.2.0"

export default (): JSX.Element => <>
  <div className="system-tab-pane" data-tab="comments" data-mode="expert,machine">
    <table>
      <thead>
        <th>Line</th>
        <th>Comment</th>
      </thead>
      <tbody data-component="commentsTableBody"></tbody>
    </table>
  </div>
</>
