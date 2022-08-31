const AutoGitUpdate = require("auto-git-update");
const config = {
  repository: "https://github.com/namanshandilyapsiborg/31Aug2022Code.git",
  fromReleases: false,
  tempLocation: "D:/PsiBorg",
  token: "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",
  //ignoreFiles: ['util/config.js'],
  //executeOnComplete: 'C:/Users/scheg/Desktop/worksapce/AutoGitUpdate/startTest.bat',
  executeOnComplete: print(),
  exitOnComplete: true,
};
const updater = new AutoGitUpdate(config);
//updater.autoUpdate();
updater.forceUpdate();
//updater.compareVersions();

function print()
{
    console.log("print function got hit")
}