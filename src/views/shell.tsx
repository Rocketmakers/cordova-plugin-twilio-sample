import * as React from "react";
import "./shell.scss";

declare var FastClick: { attach(element: HTMLElement): void };

export const Shell: React.FunctionComponent<{}> = props => {

  // STARTUP
  React.useEffect(() => {
    if (window["cordova"] !== undefined) {
      FastClick.attach(document.body);
    }
  },[]);
  return (
    <div className="shell">
      <header>
        <div className="fixed-width">
          LOGO
        </div>
      </header>
      <main>{props.children}</main>
    </div>
  );
}