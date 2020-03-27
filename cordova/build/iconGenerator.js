const mkdirp = require("mkdirp");
const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs-extra");
const sharp = require("sharp");

const androidIcons = require(path.join(__dirname, "icons/android"));
const iosIcons = require(path.join(__dirname, "icons/ios"));

let iconPath = path.join(__dirname, "icons/icon.png");
let iconDirectory = path.join(__dirname, "/../res/icons");
let iosIconDirectory = path.join(iconDirectory, "ios");
let androidIconDirectory = path.join(iconDirectory, "android");

rimraf(iconDirectory, async () => {
  fs.mkdirSync(iconDirectory);
  fs.mkdirSync(iosIconDirectory);
  fs.mkdirSync(androidIconDirectory);
  fs.writeFileSync(path.join(iconDirectory, "icon.png"), fs.readFileSync(iconPath));


  console.log("Generating Android icons");
  await resize(androidIcons.icons, androidIconDirectory);

  console.log("Generating iOS icons");
  await resize(iosIcons.icons, iosIconDirectory);

  console.log('Complete!')
});

const resize = async (icons, directory) =>{
  for (let i = 0; i < icons.length; i++) {
    const ai = icons[i];
    await sharp(iconPath)
      .resize(ai.size, ai.size, { withoutEnlargement: true })
      .removeAlpha()
      .png()
      .toFile(path.join(directory, `icon-${ai.name}.png`))
    console.log(ai)
  }
};
