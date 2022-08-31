const AutoGitUpdate = require("auto-git-update");
const {exec} = require("child_process");
const { stdout } = require("process");
const config = {
  repository: "https://github.com/namanshandilyapsiborg/31Aug2022Code.git",
  fromReleases: false,
  tempLocation: "D:/PsiBorg",
  token: "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",
  //ignoreFiles: ['util/config.js'],
  //executeOnComplete: 'C:/Users/scheg/Desktop/worksapce/AutoGitUpdate/startTest.bat',
  executeOnComplete: print(),
  exitOnComplete: false,
};
const updater = new AutoGitUpdate(config);
//updater.autoUpdate();
updater.forceUpdate();
//updater.compareVersions();

function print()
{
    console.log("print function got hit")
    setTimeout(()=>{
    exec("node app.js", {cwd : "/"},(error , stdout,stderr)=>{
        if(error)
        {
            console.log("error inside child_process",error)
        }
        if(stdout)
        {
            console.log("//=== Executed Successfully ===//")
        }
        else{
            console.log("//==== stdout ==> ", stderr)
        }
    })
    console.log("Timer completed")
    },20000)
}