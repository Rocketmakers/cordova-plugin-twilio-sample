const fs = require('fs');
const moment = require('moment');
const ejs = require('ejs');
const path = require("path");

const appName = "Boilerplate";
const appDescription = "Oh lawd, he comin.";
const packageName = "com.rocketmakers.boilerplate";
const version = "0.0.1";
const bundleVersion = Math.round(moment().unix() / 60);
const authorName = "Adam Walker";
const authorEmail = "adam@rocketmakers.com";
const authorWebsite = "rocketmakers.com";

const androidIcons = require(path.join(__dirname, "icons/android"));
const iosIcons = require(path.join(__dirname, "icons/ios"));

var template = fs.readFileSync(path.join(__dirname, "/config.xml.ejs"), "utf8");

console.log("Writing config.xml")

let out = ejs.render(template, {
  appName,
  appDescription,
  packageName,
  version,
  bundleVersion,
  authorName,
  authorEmail,
  authorWebsite,
  androidIcons: androidIcons.icons.map(ai => `<icon height="${ai.size}" width="${ai.size}" src="res/icons/android/icon-${ai.name}.png"/>`),
  iosIcons: iosIcons.icons.map(ai => `<icon height="${ai.size}" width="${ai.size}" src="res/icons/ios/icon-${ai.name}.png"/>`),
})

fs.writeFileSync(path.join(__dirname, "../config.xml"), out)

console.log("Complete!")