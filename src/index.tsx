import * as React from "react";
import * as ReactDOM from "react-dom";
import { Routes } from "./routes";
import { ArmstrongConfig } from '@rocketmakers/armstrong';
import { HashRouter } from 'react-router-dom';

import "./theme/theme.scss";

ArmstrongConfig.setLocale("en-GB");

document.addEventListener(
  "deviceready",
  () => {
    onDeviceReady();
  },
  false
);

// Force app load if running in a browser
if (window["cordova"] === undefined) {
  renderApp();
}

// All cordova specific init calls go in here
async function onDeviceReady(): Promise<void> {
  renderApp();
}

async function renderApp() {
  ReactDOM.render(
    <HashRouter>
      <Routes />
    </HashRouter>
    , document.getElementById('host'));
}