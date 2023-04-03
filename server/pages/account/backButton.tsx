import React from "https://esm.sh/react@18.2.0"

export default (): JSX.Element => (
  <div className="dashboard-back-button">
    <a href="/account" className="button green">
      <span className="icon">
        <i className="fa fa-chevron-left"></i>
      </span>
      <span className="text">back</span>
    </a>
  </div>
)
